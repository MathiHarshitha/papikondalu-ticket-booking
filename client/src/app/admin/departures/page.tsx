'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Ship, X, Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Boat = { _id: string; name: string; identifier: string; capacity: number; status: string; notes: string }
type Package = { _id: string; title: string; slug: string }
type Departure = {
  _id: string
  package: Package | null
  boat: Boat | null
  departureDate: string
  departureTime: string
  boardingLocation: string
  route: string
  totalCapacity: number
  confirmedSeats: number
  status: string
  notes: string
}

const DEPARTURE_STATUS = ['SCHEDULED', 'CANCELLED', 'COMPLETED', 'CLOSED']
const BOAT_STATUS = ['ACTIVE', 'MAINTENANCE', 'RETIRED']
const STATUS_STYLE: Record<string, string> = {
  SCHEDULED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CLOSED: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-100 text-green-700',
  MAINTENANCE: 'bg-amber-100 text-amber-700',
  RETIRED: 'bg-gray-100 text-gray-600',
}

const EMPTY_DEP = { package: '', boat: '', departureDate: '', departureTime: '07:00', boardingLocation: '', route: '', totalCapacity: '', notes: '', status: 'SCHEDULED' }
const EMPTY_BOAT = { name: '', identifier: '', capacity: '', status: 'ACTIVE', notes: '' }

export default function AdminDeparturesPage() {
  const [tab, setTab] = useState<'departures' | 'boats'>('departures')
  const [departures, setDepartures] = useState<Departure[]>([])
  const [boats, setBoats] = useState<Boat[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showDepForm, setShowDepForm] = useState(false)
  const [showBoatForm, setShowBoatForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [depForm, setDepForm] = useState({ ...EMPTY_DEP })
  const [boatForm, setBoatForm] = useState({ ...EMPTY_BOAT })
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'dep' | 'boat' } | null>(null)
  const [error, setError] = useState('')

  const loadAll = useCallback(() => {
    setLoading(true)
    const qs = statusFilter ? `?status=${statusFilter}` : ''
    Promise.all([
      fetch(`${API}/admin/departures${qs}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API}/admin/boats`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API}/admin/packages`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([d, b, p]) => {
      setDepartures(d.departures ?? [])
      setBoats(b.boats ?? [])
      setPackages(p.packages ?? [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [statusFilter])

  useEffect(() => { loadAll() }, [loadAll])

  const openCreateDep = () => { setEditingId(null); setDepForm({ ...EMPTY_DEP }); setError(''); setShowDepForm(true) }
  const openEditDep = (d: Departure) => {
    setEditingId(d._id)
    setDepForm({
      package: (d.package as Package)?._id ?? '',
      boat: (d.boat as Boat)?._id ?? '',
      departureDate: d.departureDate?.slice(0, 10) ?? '',
      departureTime: d.departureTime,
      boardingLocation: d.boardingLocation,
      route: d.route,
      totalCapacity: String(d.totalCapacity),
      notes: d.notes,
      status: d.status,
    })
    setError('')
    setShowDepForm(true)
  }

  const openCreateBoat = () => { setEditingId(null); setBoatForm({ ...EMPTY_BOAT }); setError(''); setShowBoatForm(true) }
  const openEditBoat = (b: Boat) => {
    setEditingId(b._id)
    setBoatForm({ name: b.name, identifier: b.identifier, capacity: String(b.capacity), status: b.status, notes: b.notes })
    setError('')
    setShowBoatForm(true)
  }

  const saveDep = async () => {
    setSaving(true); setError('')
    try {
      const body = { ...depForm, totalCapacity: Number(depForm.totalCapacity) || 0 }
      const url = editingId ? `${API}/admin/departures/${editingId}` : `${API}/admin/departures`
      const r = await fetch(url, { method: editingId ? 'PUT' : 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await r.json()
      if (!r.ok) { setError(d.message ?? 'Save failed'); return }
      setShowDepForm(false); loadAll()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const saveBoat = async () => {
    setSaving(true); setError('')
    try {
      const body = { ...boatForm, capacity: Number(boatForm.capacity) || 0 }
      const url = editingId ? `${API}/admin/boats/${editingId}` : `${API}/admin/boats`
      const r = await fetch(url, { method: editingId ? 'PUT' : 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await r.json()
      if (!r.ok) { setError(d.message ?? 'Save failed'); return }
      setShowBoatForm(false); loadAll()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const path = deleteTarget.type === 'dep' ? 'departures' : 'boats'
    await fetch(`${API}/admin/${path}/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
    setDeleteTarget(null); loadAll()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted hover:text-ink"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="font-display text-2xl font-bold text-ink">Boats & Departures</h1>
          </div>
          <button onClick={tab === 'departures' ? openCreateDep : openCreateBoat} className="btn-primary text-sm py-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> {tab === 'departures' ? 'New Departure' : 'New Boat'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          {(['departures', 'boats'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white shadow text-ink' : 'text-muted hover:text-ink'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'departures' && (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              {['', ...DEPARTURE_STATUS].map(s => (
                <button key={s || 'all'} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${statusFilter === s ? 'bg-river text-white border-river' : 'bg-white text-muted border-gray-200 hover:border-river'}`}>
                  {s || 'All'}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Package', 'Boat', 'Date', 'Time', 'Location', 'Capacity', 'Booked', 'Status', ''].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {departures.length === 0 ? (
                        <tr><td colSpan={9} className="px-4 py-10 text-center text-muted">No departures found</td></tr>
                      ) : departures.map(dep => (
                        <tr key={dep._id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-medium text-ink max-w-[180px]"><div className="truncate">{dep.package?.title ?? '—'}</div></td>
                          <td className="px-4 py-3 text-muted"><div className="flex items-center gap-1.5"><Ship className="w-3.5 h-3.5" />{dep.boat?.name ?? '—'}</div></td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{new Date(dep.departureDate).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3 text-muted">{dep.departureTime}</td>
                          <td className="px-4 py-3 text-muted max-w-[140px]"><div className="truncate">{dep.boardingLocation}</div></td>
                          <td className="px-4 py-3 text-center text-ink">{dep.totalCapacity}</td>
                          <td className="px-4 py-3 text-center text-ink">{dep.confirmedSeats}</td>
                          <td className="px-4 py-3"><span className={`badge text-xs ${STATUS_STYLE[dep.status] ?? 'bg-gray-100 text-gray-600'}`}>{dep.status}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openEditDep(dep)} className="text-river hover:text-river/70"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => setDeleteTarget({ id: dep._id, type: 'dep' })} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'boats' && (
          loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boats.length === 0 && <p className="text-muted text-sm col-span-3 py-10 text-center">No boats found</p>}
              {boats.map(b => (
                <div key={b._id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-ink">{b.name}</div>
                      <div className="text-xs text-muted font-mono">{b.identifier}</div>
                    </div>
                    <span className={`badge text-xs ${STATUS_STYLE[b.status] ?? 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
                  </div>
                  <div className="text-sm text-muted mb-3">Capacity: <span className="text-ink font-medium">{b.capacity}</span></div>
                  {b.notes && <p className="text-xs text-muted mb-3">{b.notes}</p>}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => openEditBoat(b)} className="flex-1 btn-secondary text-xs py-1.5 flex items-center justify-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                    <button onClick={() => setDeleteTarget({ id: b._id, type: 'boat' })} className="text-red-500 hover:text-red-400 px-3"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Departure form */}
      {showDepForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40" onClick={e => e.target === e.currentTarget && setShowDepForm(false)}>
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-ink">{editingId ? 'Edit Departure' : 'New Departure'}</h2>
              <button onClick={() => setShowDepForm(false)}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="p-5 space-y-4 flex-1">
              {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Package *</label>
                <select className="input-field" value={depForm.package} onChange={e => setDepForm(f => ({ ...f, package: e.target.value }))}>
                  <option value="">Select package…</option>
                  {packages.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Boat *</label>
                <select className="input-field" value={depForm.boat} onChange={e => setDepForm(f => ({ ...f, boat: e.target.value }))}>
                  <option value="">Select boat…</option>
                  {boats.filter(b => b.status === 'ACTIVE').map(b => <option key={b._id} value={b._id}>{b.name} (cap {b.capacity})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Date *</label>
                  <input type="date" className="input-field" value={depForm.departureDate} onChange={e => setDepForm(f => ({ ...f, departureDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Time *</label>
                  <input type="time" className="input-field" value={depForm.departureTime} onChange={e => setDepForm(f => ({ ...f, departureTime: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Boarding Location *</label>
                <input className="input-field" value={depForm.boardingLocation} onChange={e => setDepForm(f => ({ ...f, boardingLocation: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Route</label>
                <input className="input-field" value={depForm.route} onChange={e => setDepForm(f => ({ ...f, route: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Total Capacity *</label>
                <input type="number" className="input-field" value={depForm.totalCapacity} onChange={e => setDepForm(f => ({ ...f, totalCapacity: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Status</label>
                <select className="input-field" value={depForm.status} onChange={e => setDepForm(f => ({ ...f, status: e.target.value }))}>
                  {DEPARTURE_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Notes</label>
                <textarea className="input-field" rows={2} value={depForm.notes} onChange={e => setDepForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowDepForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={saveDep} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingId ? 'Save Changes' : 'Create Departure'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boat form */}
      {showBoatForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40" onClick={e => e.target === e.currentTarget && setShowBoatForm(false)}>
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-ink">{editingId ? 'Edit Boat' : 'New Boat'}</h2>
              <button onClick={() => setShowBoatForm(false)}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="p-5 space-y-4 flex-1">
              {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Boat Name *</label>
                <input className="input-field" value={boatForm.name} onChange={e => setBoatForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Identifier *</label>
                <input className="input-field font-mono" placeholder="e.g. BOAT-001" value={boatForm.identifier} onChange={e => setBoatForm(f => ({ ...f, identifier: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Capacity *</label>
                  <input type="number" className="input-field" value={boatForm.capacity} onChange={e => setBoatForm(f => ({ ...f, capacity: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Status</label>
                  <select className="input-field" value={boatForm.status} onChange={e => setBoatForm(f => ({ ...f, status: e.target.value }))}>
                    {BOAT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Notes</label>
                <textarea className="input-field" rows={2} value={boatForm.notes} onChange={e => setBoatForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowBoatForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={saveBoat} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingId ? 'Save Changes' : 'Add Boat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="font-bold text-ink mb-2">Delete {deleteTarget.type === 'dep' ? 'departure' : 'boat'}?</h3>
            <p className="text-sm text-muted mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
