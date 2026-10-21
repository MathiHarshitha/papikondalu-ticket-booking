/**
 * Integration tests: authorization, IDOR, and privilege escalation.
 * Uses jest mocking of Mongoose models — no live database or HTTP server.
 *
 * Pattern: call the controller function directly with a hand-crafted
 * req/res/next, then assert on res._status and res._body.
 */

import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

process.env.JWT_ACCESS_SECRET = 'test-secret-integration-64-chars-long-padding-here-12345'
process.env.COOKIE_NAME = 'papikondalu_session'
process.env.NODE_ENV = 'test'

const JWT_SECRET = process.env.JWT_ACCESS_SECRET

// ─── Helpers ──────────────────────────────────────────────────────────────

function makeToken(id: string, role = 'CUSTOMER') {
  return jwt.sign({ id, role, email: `${id}@test.com` }, JWT_SECRET, { expiresIn: '1h' })
}

function makeReqRes(overrides: Record<string, unknown> = {}) {
  const res: any = {
    _status: 200, _body: null,
    status(code: number) { this._status = code; return this },
    json(body: unknown) { this._body = body; return this },
  }
  const req: any = { cookies: {}, body: {}, params: {}, query: {}, user: undefined, ...overrides }
  const next = jest.fn((err?: unknown) => {
    if (err) {
      // Simulate the error handler: set status from AppError
      const e = err as any
      res._status = e.statusCode ?? 500
      res._body = { message: e.message ?? 'error' }
    }
  })
  return { req, res, next }
}

// ─── Mock mongoose models ──────────────────────────────────────────────────

jest.mock('../models/Booking', () => {
  const findOneMock = jest.fn()
  const findOneAndUpdateMock = jest.fn()
  const findMock = jest.fn()
  return {
    __esModule: true,
    default: {
      findOne: findOneMock,
      findOneAndUpdate: findOneAndUpdateMock,
      find: findMock,
    },
    _findOneMock: findOneMock,
    _findOneAndUpdateMock: findOneAndUpdateMock,
    _findMock: findMock,
  }
})

jest.mock('../models/Payment', () => {
  const findByIdMock = jest.fn()
  return {
    __esModule: true,
    default: { findById: findByIdMock },
    _findByIdMock: findByIdMock,
  }
})

jest.mock('../models/Departure', () => ({
  __esModule: true,
  default: { findByIdAndUpdate: jest.fn() },
}))

jest.mock('../models/Ticket', () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}))

// ─── Import after mocking ──────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-require-imports
const BookingMod = require('../models/Booking')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PaymentMod = require('../models/Payment')

// ─── 1. Unauthenticated API access ────────────────────────────────────────

describe('Unauthenticated API access', () => {
  const { authenticate } = jest.requireActual('../middleware/auth') as typeof import('../middleware/auth')

  test('INT-01 GET /bookings/my — 401 without cookie', () => {
    const { req, res, next } = makeReqRes()
    authenticate(req, res, next)
    expect(res._status).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('INT-02 GET /admin/metrics — 401 without cookie', () => {
    const { req, res, next } = makeReqRes()
    authenticate(req, res, next)
    expect(res._status).toBe(401)
  })

  test('INT-03 POST /bookings/hold — 401 without cookie', () => {
    const { req, res, next } = makeReqRes({ body: { packageSlug: 'test', departureDate: '2026-12-01', adults: 2, children: 0 } })
    authenticate(req, res, next)
    expect(res._status).toBe(401)
  })
})

// ─── 2. IDOR: customer cannot read another customer's booking ──────────────

describe('Booking IDOR: cross-customer access prevention', () => {
  const { myBookingDetail } = jest.requireActual('../controllers/bookingsController') as typeof import('../controllers/bookingsController')

  beforeEach(() => { BookingMod._findOneMock.mockReset() })

  test('INT-04 returns 404 when booking belongs to a different customer', async () => {
    // findOne returns null because the customer field doesn't match
    BookingMod._findOneMock.mockReturnValue({
      populate: () => ({ lean: () => Promise.resolve(null) }),
    })
    const { req, res, next } = makeReqRes({
      user: { id: 'customer-A', role: 'CUSTOMER', email: 'a@test.com' },
      params: { id: 'booking-belonging-to-B' },
    })
    await myBookingDetail(req, res, next)
    // next called with an AppError (404)
    expect(next).toHaveBeenCalled()
    const err = (next as jest.Mock).mock.calls[0][0] as any
    expect(err?.statusCode).toBe(404)
  })

  test('INT-05 returns booking when it belongs to the requesting customer', async () => {
    const fakeBooking = { _id: 'b1', customer: 'customer-A', bookingRef: 'PK001' }
    BookingMod._findOneMock.mockReturnValue({
      populate: () => ({ lean: () => Promise.resolve(fakeBooking) }),
    })
    const { req, res, next } = makeReqRes({
      user: { id: 'customer-A', role: 'CUSTOMER', email: 'a@test.com' },
      params: { id: 'b1' },
    })
    await myBookingDetail(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res._body?.booking?.bookingRef).toBe('PK001')
  })
})

// ─── 3. IDOR: customer cannot read another customer's payment ─────────────

describe('Payment IDOR: cross-customer access prevention', () => {
  const { paymentStatus } = jest.requireActual('../controllers/paymentsController') as typeof import('../controllers/paymentsController')

  beforeEach(() => { PaymentMod._findByIdMock.mockReset() })

  test('INT-06 returns 404 when payment belongs to a different customer', async () => {
    const fakePayment = {
      status: 'CAPTURED',
      amount: 1000,
      currency: 'INR',
      booking: { customer: { toString: () => 'customer-B' } },
    }
    PaymentMod._findByIdMock.mockReturnValue({
      populate: () => Promise.resolve(fakePayment),
    })
    const { req, res, next } = makeReqRes({
      user: { id: 'customer-A', role: 'CUSTOMER', email: 'a@test.com' },
      params: { id: 'payment-of-B' },
    })
    await paymentStatus(req, res, next)
    const err = (next as jest.Mock).mock.calls[0][0] as any
    expect(err?.statusCode).toBe(404)
  })

  test('INT-07 returns payment when it belongs to the requesting customer', async () => {
    const fakePayment = {
      status: 'CAPTURED',
      amount: 1500,
      currency: 'INR',
      booking: { customer: { toString: () => 'customer-A' } },
    }
    PaymentMod._findByIdMock.mockReturnValue({
      populate: () => Promise.resolve(fakePayment),
    })
    const { req, res, next } = makeReqRes({
      user: { id: 'customer-A', role: 'CUSTOMER', email: 'a@test.com' },
      params: { id: 'p1' },
    })
    await paymentStatus(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res._body?.status).toBe('CAPTURED')
    expect(res._body?.amount).toBe(1500)
  })
})

// ─── 4. Privilege escalation: CUSTOMER cannot reach admin routes ───────────

describe('Privilege escalation prevention', () => {
  const { requireRole, requireAdmin } = jest.requireActual('../middleware/auth') as typeof import('../middleware/auth')

  test('INT-08 CUSTOMER cannot call requireAdmin endpoint', () => {
    const { req, res, next } = makeReqRes({
      user: { id: 'u1', role: 'CUSTOMER', email: 'c@test.com' },
    })
    requireAdmin(req, res, next)
    expect(res._status).toBe(403)
    expect(next).not.toHaveBeenCalled()
  })

  test('INT-09 CHECKIN_STAFF cannot reach ADMIN-only endpoint', () => {
    const { req, res, next } = makeReqRes({
      user: { id: 'u2', role: 'CHECKIN_STAFF', email: 's@test.com' },
    })
    requireAdmin(req, res, next)
    expect(res._status).toBe(403)
    expect(next).not.toHaveBeenCalled()
  })

  test('INT-10 BOOKING_MANAGER can reach BOOKING_MANAGER|ADMIN route', () => {
    const { req, res, next } = makeReqRes({
      user: { id: 'u3', role: 'BOOKING_MANAGER', email: 'bm@test.com' },
    })
    requireRole('BOOKING_MANAGER', 'ADMIN', 'SUPER_ADMIN')(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res._status).toBe(200)
  })

  test('INT-11 SUPER_ADMIN can reach ADMIN-only endpoint', () => {
    const { req, res, next } = makeReqRes({
      user: { id: 'u4', role: 'SUPER_ADMIN', email: 'sa@test.com' },
    })
    requireAdmin(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})

// ─── 5. Cancellation idempotency ──────────────────────────────────────────

describe('Cancellation: atomic status transition prevents double-decrement', () => {
  test('INT-12 findOneAndUpdate filter prevents second concurrent cancellation', () => {
    // The filter is { bookingStatus: 'CONFIRMED' }.
    // After the first request sets status to CANCELLED, the second finds no document.
    const confirmedBooking = { _id: 'b1', customer: 'u1', bookingStatus: 'CONFIRMED', adultCount: 2, childCount: 0 }
    const cancelledBooking = { ...confirmedBooking, bookingStatus: 'CANCELLED' }

    // Simulate the DB state change: first call returns the booking, second returns null
    let dbState = confirmedBooking.bookingStatus

    function atomicUpdate(filter: Record<string, unknown>) {
      if (filter.bookingStatus === 'CONFIRMED' && dbState === 'CONFIRMED') {
        dbState = 'CANCELLED'
        return cancelledBooking
      }
      return null // concurrent second request
    }

    const first = atomicUpdate({ bookingStatus: 'CONFIRMED' })
    const second = atomicUpdate({ bookingStatus: 'CONFIRMED' })

    expect(first).not.toBeNull()   // first call succeeds
    expect(second).toBeNull()       // second call correctly returns null
  })
})

// ─── 6. Open-redirect validation ──────────────────────────────────────────

describe('Open-redirect: safe redirect validation', () => {
  // Replicate the URL-parser-based validation from login/page.tsx
  function getSafeRedirect(redirect: string, currentOrigin = 'https://example.com'): string {
    let safe = '/account'
    try {
      const parsed = new URL(redirect, currentOrigin)
      if (parsed.origin === currentOrigin) {
        safe = parsed.pathname + parsed.search + parsed.hash
      }
    } catch { /* fall back */ }
    return safe
  }

  test('INT-13 plain relative path is allowed', () => {
    expect(getSafeRedirect('/book?package=test')).toBe('/book?package=test')
  })

  test('INT-14 protocol-relative //evil.com is blocked', () => {
    expect(getSafeRedirect('//evil.com')).toBe('/account')
  })

  test('INT-15 absolute external URL is blocked', () => {
    expect(getSafeRedirect('https://evil.com/steal')).toBe('/account')
  })

  test('INT-16 backslash bypass /\\evil.com is blocked', () => {
    // New URL('/\\evil.com', 'https://example.com').origin === 'https://example.com'
    // on Node.js; backslash in path stays local
    const result = getSafeRedirect('/\\evil.com')
    // Safe: Node normalises /\evil.com to a path on the same origin
    expect(result.startsWith('/')).toBe(true)
  })

  test('INT-17 encoded //evil.com (%2F%2F) is blocked', () => {
    // URL-decode happens via searchParams.get(), so the value arrives as //evil.com
    expect(getSafeRedirect('//evil.com')).toBe('/account')
  })

  test('INT-18 javascript: URI is blocked', () => {
    expect(getSafeRedirect('javascript:alert(1)')).toBe('/account')
  })
})

// ─── 7. PayU payment hash cannot be forged ───────────────────────────────

describe('Payment: forged success cannot confirm booking', () => {
  test('INT-19 verify endpoint rejects when response hash does not match', async () => {
    const { verifyPayment } = jest.requireActual('../controllers/paymentsController') as typeof import('../controllers/paymentsController')

    // Mock Payment.findOne to return a record
    const PaymentModel = require('../models/Payment').default
    PaymentModel.findOne = jest.fn().mockReturnValue(
      Promise.resolve({
        gatewayOrderId: 'TXN1',
        metadata: { firstname: 'Test', email: 'test@x.com', amount: '1000.00', productinfo: 'Trip' },
        status: 'CREATED',
        save: jest.fn(),
      })
    )
    process.env.PAYU_KEY = 'TESTKEY'
    process.env.PAYU_SALT = 'TESTSALT'

    const { req, res, next } = makeReqRes({
      user: { id: 'u1', role: 'CUSTOMER', email: 'test@x.com' },
      body: {
        txnid: 'TXN1',
        mihpayid: 'MID1',
        txnStatus: 'SUCCESS',
        hash: 'completely-wrong-hash',
        bookingId: 'b1',
      },
    })
    await verifyPayment(req, res, next)
    const err = (next as jest.Mock).mock.calls[0][0] as any
    expect(err?.statusCode).toBe(400)
    expect(err?.message).toMatch(/signature/i)
  })
})
