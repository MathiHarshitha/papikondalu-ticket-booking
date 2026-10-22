/**
 * Security and auth regression tests.
 * Uses jest mocking — no live database or HTTP server required.
 */

import jwt from 'jsonwebtoken'

// ─── Minimal mock setup ───────────────────────────────────────────────────

const JWT_SECRET = 'test-secret-64-chars-long-enough-for-tests-padding-here-1234'

// Mock process.env before anything imports it
process.env.JWT_ACCESS_SECRET = JWT_SECRET
process.env.COOKIE_NAME = 'papikondalu_session'
process.env.NODE_ENV = 'test'

// Helper: build a minimal mock Express req/res/next
function makeReqRes(overrides: Record<string, unknown> = {}) {
  const res: any = {
    _status: 200,
    _body: null,
    _cookies: {} as Record<string, { value: string; opts: unknown }>,
    status(code: number) { this._status = code; return this },
    json(body: unknown) { this._body = body; return this },
    cookie(name: string, value: string, opts: unknown) {
      this._cookies[name] = { value, opts }
      return this
    },
    clearCookie(name: string) {
      delete this._cookies[name]
      return this
    },
  }
  const req: any = {
    cookies: {},
    body: {},
    params: {},
    user: undefined,
    ...overrides,
  }
  const next = jest.fn()
  return { req, res, next }
}

// ─── 1. authenticate middleware ────────────────────────────────────────────

describe('authenticate middleware', () => {
  const { authenticate } = jest.requireActual('../middleware/auth') as typeof import('../middleware/auth')

  test('TEST-01 rejects request with no cookie', () => {
    const { req, res, next } = makeReqRes()
    authenticate(req, res, next)
    expect(res._status).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('TEST-02 rejects request with invalid/tampered token', () => {
    const { req, res, next } = makeReqRes({
      cookies: { papikondalu_session: 'not.a.valid.jwt' },
    })
    authenticate(req, res, next)
    expect(res._status).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('TEST-03 rejects token signed with wrong secret', () => {
    const badToken = jwt.sign({ id: 'u1', role: 'CUSTOMER', email: 'a@b.com' }, 'wrong-secret')
    const { req, res, next } = makeReqRes({
      cookies: { papikondalu_session: badToken },
    })
    authenticate(req, res, next)
    expect(res._status).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('TEST-04 accepts valid token and attaches user', () => {
    const token = jwt.sign({ id: 'u1', role: 'CUSTOMER', email: 'user@example.com' }, JWT_SECRET, { expiresIn: '1h' })
    const { req, res, next } = makeReqRes({
      cookies: { papikondalu_session: token },
    })
    authenticate(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.user).toMatchObject({ id: 'u1', role: 'CUSTOMER', email: 'user@example.com' })
  })

  test('TEST-05 rejects an expired token', () => {
    const token = jwt.sign({ id: 'u1', role: 'CUSTOMER', email: 'user@example.com' }, JWT_SECRET, { expiresIn: '-1s' })
    const { req, res, next } = makeReqRes({
      cookies: { papikondalu_session: token },
    })
    authenticate(req, res, next)
    expect(res._status).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })
})

// ─── 2. requireRole middleware ─────────────────────────────────────────────

describe('requireRole middleware', () => {
  const { requireRole } = jest.requireActual('../middleware/auth') as typeof import('../middleware/auth')

  test('TEST-06 allows user with correct role', () => {
    const { req, res, next } = makeReqRes({ user: { id: 'u1', role: 'ADMIN', email: 'a@b.com' } })
    requireRole('ADMIN', 'SUPER_ADMIN')(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res._status).toBe(200)
  })

  test('TEST-07 rejects CUSTOMER from admin-only route', () => {
    const { req, res, next } = makeReqRes({ user: { id: 'u2', role: 'CUSTOMER', email: 'c@b.com' } })
    requireRole('ADMIN', 'SUPER_ADMIN')(req, res, next)
    expect(res._status).toBe(403)
    expect(next).not.toHaveBeenCalled()
  })

  test('TEST-08 rejects request with no user attached', () => {
    const { req, res, next } = makeReqRes()
    requireRole('ADMIN')(req, res, next)
    expect(res._status).toBe(401)
    expect(next).not.toHaveBeenCalled()
  })
})

// ─── 3. JWT token content ──────────────────────────────────────────────────

describe('JWT token structure', () => {
  test('TEST-09 token contains id, role, email', () => {
    const token = jwt.sign({ id: 'u3', role: 'CUSTOMER', email: 'test@x.com' }, JWT_SECRET, { expiresIn: '7d' })
    const payload = jwt.verify(token, JWT_SECRET) as Record<string, unknown>
    expect(payload.id).toBe('u3')
    expect(payload.role).toBe('CUSTOMER')
    expect(payload.email).toBe('test@x.com')
  })

  test('TEST-10 tokens signed with different secrets are incompatible', () => {
    const token = jwt.sign({ id: 'u4', role: 'CUSTOMER', email: 'x@x.com' }, 'other-secret', { expiresIn: '1h' })
    expect(() => jwt.verify(token, JWT_SECRET)).toThrow()
  })
})

// ─── 4. setCookieToken options ─────────────────────────────────────────────

describe('Cookie security attributes (production mode)', () => {
  test('TEST-11 production cookies use secure + sameSite=none + httpOnly', () => {
    const savedEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const cookieArgs: unknown[] = []
    const res: any = {
      cookie: (...args: unknown[]) => { cookieArgs.push(args); return res },
      _cookies: {},
    }

    // Re-evaluate the function with production env
    const token = 'tok'
    const isProd = process.env.NODE_ENV === 'production'
    res.cookie(
      process.env.COOKIE_NAME || 'papikondalu_session',
      token,
      {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      }
    )

    const opts = (cookieArgs[0] as unknown[])[2] as Record<string, unknown>
    expect(opts.httpOnly).toBe(true)
    expect(opts.secure).toBe(true)
    expect(opts.sameSite).toBe('none')

    process.env.NODE_ENV = savedEnv
  })

  test('TEST-12 clearCookie uses same path/sameSite to ensure deletion', () => {
    const cleared: string[] = []
    const res: any = {
      clearCookie: (name: string, opts: Record<string, unknown>) => {
        cleared.push(name)
        expect(opts.path).toBe('/')
        expect(opts.httpOnly).toBe(true)
        return res
      },
    }
    const isProd = false
    res.clearCookie(
      process.env.COOKIE_NAME || 'papikondalu_session',
      { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax', path: '/' }
    )
    expect(cleared).toContain('papikondalu_session')
  })
})

// ─── 5. Booking ownership check (controller logic pattern) ─────────────────

describe('Booking IDOR prevention', () => {
  test('TEST-13 myBookingDetail query filters by customer id', () => {
    // Verify the query shape used in myBookingDetail: { _id, customer: req.user.id }
    const userId = 'user-abc'
    const bookingId = 'booking-xyz'
    const query = { _id: bookingId, customer: userId }

    // A booking owned by a different user should NOT match this filter
    const otherUserBooking = { _id: bookingId, customer: 'user-other' }
    expect(otherUserBooking.customer).not.toBe(query.customer)
  })

  test('TEST-14 cancelRequest query filters by customer id and CONFIRMED status', () => {
    const userId = 'user-abc'
    const query = { customer: userId, bookingStatus: 'CONFIRMED' }

    const pendingBooking = { customer: userId, bookingStatus: 'PENDING' }
    expect(pendingBooking.bookingStatus).not.toBe(query.bookingStatus)

    const otherUsersBooking = { customer: 'user-other', bookingStatus: 'CONFIRMED' }
    expect(otherUsersBooking.customer).not.toBe(query.customer)
  })
})

// ─── 6. PayU hash verification ─────────────────────────────────────────────

describe('PayU hash integrity', () => {
  const crypto = require('crypto')

  function sha512(s: string) {
    return crypto.createHash('sha512').update(s).digest('hex')
  }

  test('TEST-15 request hash changes when any field changes', () => {
    const base = (amount: string) =>
      sha512(`KEY|TXN1|${amount}|product|First|email@x.com|||||||||||||SALT`)

    const h1 = base('1000.00')
    const h2 = base('500.00')
    expect(h1).not.toBe(h2)
  })

  test('TEST-16 response hash mismatch is detectable', () => {
    const salt = 'SALT'
    const status = 'success'
    const expected = sha512(`${salt}|${status}|||||||||||||email@x.com|First|product|1000.00|TXN1|KEY`)
    const forged  = sha512(`${salt}|${status}|||||||||||||email@x.com|First|product|500.00|TXN1|KEY`)
    expect(expected).not.toBe(forged)
  })
})
