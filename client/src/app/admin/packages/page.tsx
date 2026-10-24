'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Search, Eye, EyeOff, X, Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Package = {
  _id: string; title: string; slug: string; category: string; duration: string
  adultPrice: number | null; childPrice: number | null; maxCapacity: number
  isPublished: boolean; badge: string | null; createdAt: string
}

const CATEGORIES = ['day-tour', 'multi-day', 'camping', 'temple', 'adventure']

const EMPTY_FORM = {
  title: '', slug: '', subtitle: '', category: 'day-tour', duration: '',
  description: '', departureLocations: '', adultPrice: '', childPrice: '',
  maxCapacity: '', bestSeason: 'October – March', isPublished: false,
  highlights: '', inclusions: '', exclusions: '', cancellationPolicy: '',
  badge: '', seoTitle: '', seoDescription: '',
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    fetch(`${API}/admin/packages?search=${encodeURIComponent(search)}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setPackages(d.packages ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setError('')
    setShowForm(true)
  }

  const openEdit = (pkg: Package) => {
    setEditingId(pkg._id)
    setForm({
      title: pkg.title, slug: pkg.slug, subtitle: '',
      category: pkg.category, duration: pkg.duration,
      description: '', departureLocations: '',
      adultPrice: pkg.adultPrice != null ? String(pkg.adultPrice) : '',
      childPrice: pkg.childPrice != null ? String(pkg.childPrice) : '',
      maxCapacity: String(pkg.maxCapacity),
      bestSeason: 'October – March',
      isPublished: pkg.isPublished,
      highlights: '', inclusions: '', exclusions: '',
      cancellationPolicy: '', badge: pkg.badge ?? '',
      seoTitle: '', seoDescription: '',
    })
    setError('')
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const body = {
        ...form,
        adultPrice: form.adultPrice ? Number(form.adultPrice) : null,
        childPrice: form.childPrice ? Number(form.childPrice) : null,
        maxCapacity: Number(form.maxCapacity) || 0,
        departureLocations: form.departureLocations.split(',').map(s => s.trim()).filter(Boolean),
        highlights: form.highlights.split('\n').filter(Boolean),
        inclusions: form.inclusions.split('\n').filter(Boolean),
        exclusions: form.exclusions.split('\n').filter(Boolean),
        badge: form.badge || null,
      }
      const url = editingId ? `${API}/admin/packages/${editingId}` : `${API}/admin/packages`
      const method = editingId ? 'PUT' : 'POST'
      const r = await fetch(url, { method, credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await r.json()
      if (!r.ok) { setError(d.message ?? 'Save failed'); return }
      setShowForm(false)
      load()
    } catch { setError('Network error') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await fetch(`${API}/admin/packages/${deleteId}`, { method: 'DELETE', credentials: 'include' })
    setDeleteId(null)
    load()
  }

  const togglePublish = async (pkg: Package) => {
    await fetch(`${API}/admin/packages/${pkg._id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !pkg.isPublished }),
    })
    load()
  }

  const filtered = packages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted hover:text-ink"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="font-display text-2xl font-bold text-ink">Packages</h1>
            <span className="text-xs text-muted bg-gray-100 px-2 py-0.5 rounded-full">{packages.length}</span>
          </div>
          <button onClick={openCreate} className="btn-primary text-sm py-2 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> New Package
          </button>
        </div>

        <div className="card mb-4">
          <div className="p-4 flex items-center gap-3 border-b border-gray-100">
            <Search className="w-4 h-4 text-muted" />
            <input className="flex-1 bg-transparent outline-none text-sm text-ink placeholder-muted"
              placeholder="Search packages…" value={search} onChange={e => { setSearch(e.target.value); load() }} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Title', 'Category', 'Duration', 'Adult Price', 'Child Price', 'Capacity', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-muted">No packages found</td></tr>
                  ) : filtered.map(pkg => (
                    <tr key={pkg._id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-ink">{pkg.title}</div>
                        {pkg.badge && <span className="text-xs text-teal">{pkg.badge}</span>}
                      </td>
                      <td className="px-4 py-3 text-muted capitalize">{pkg.category.replace('-', ' ')}</td>
                      <td className="px-4 py-3 text-muted">{pkg.duration}</td>
                      <td className="px-4 py-3 text-ink">{pkg.adultPrice != null ? `₹${pkg.adultPrice.toLocaleString('en-IN')}` : '—'}</td>
                      <td className="px-4 py-3 text-ink">{pkg.childPrice != null ? `₹${pkg.childPrice.toLocaleString('en-IN')}` : '—'}</td>
                      <td className="px-4 py-3 text-center text-ink">{pkg.maxCapacity}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => togglePublish(pkg)} className={`badge text-xs flex items-center gap-1 ${pkg.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {pkg.isPublished ? <><Eye className="w-3 h-3" /> Published</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(pkg)} className="text-river hover:text-river/70"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteId(pkg._id)} className="text-red-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Package form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-display font-bold text-ink">{editingId ? 'Edit Package' : 'New Package'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="p-5 space-y-4 flex-1">
              {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Title *</label>
                  <input className="input-field" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: f.slug || e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Slug *</label>
                  <input className="input-field font-mono text-sm" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Subtitle</label>
                <input className="input-field" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Category *</label>
                  <select className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Duration *</label>
                  <input className="input-field" placeholder="e.g. 1 Day" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Adult Price (₹)</label>
                  <input type="number" className="input-field" value={form.adultPrice} onChange={e => setForm(f => ({ ...f, adultPrice: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Child Price (₹)</label>
                  <input type="number" className="input-field" value={form.childPrice} onChange={e => setForm(f => ({ ...f, childPrice: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Capacity *</label>
                  <input type="number" className="input-field" value={form.maxCapacity} onChange={e => setForm(f => ({ ...f, maxCapacity: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Departure Locations (comma separated)</label>
                <input className="input-field" placeholder="Bhadrachalam, Rajahmundry" value={form.departureLocations} onChange={e => setForm(f => ({ ...f, departureLocations: e.target.value }))} />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Description</label>
                <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Highlights (one per line)</label>
                <textarea className="input-field font-mono text-xs" rows={3} value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Inclusions (one per line)</label>
                  <textarea className="input-field font-mono text-xs" rows={3} value={form.inclusions} onChange={e => setForm(f => ({ ...f, inclusions: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Exclusions (one per line)</label>
                  <textarea className="input-field font-mono text-xs" rows={3} value={form.exclusions} onChange={e => setForm(f => ({ ...f, exclusions: e.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Badge</label>
                  <input className="input-field" placeholder="e.g. Best Seller" value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Best Season</label>
                  <input className="input-field" value={form.bestSeason} onChange={e => setForm(f => ({ ...f, bestSeason: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">Cancellation Policy</label>
                <textarea className="input-field" rows={2} value={form.cancellationPolicy} onChange={e => setForm(f => ({ ...f, cancellationPolicy: e.target.value }))} />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="published" className="w-4 h-4 text-teal" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                <label htmlFor="published" className="text-sm text-ink">Publish immediately</label>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingId ? 'Save Changes' : 'Create Package'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="font-bold text-ink mb-2">Delete package?</h3>
            <p className="text-sm text-muted mb-4">This action cannot be undone. Existing bookings will retain a snapshot.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
