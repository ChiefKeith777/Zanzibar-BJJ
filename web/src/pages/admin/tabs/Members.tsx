import { useState, useEffect, useCallback, useRef } from 'react'
import { getAllProfiles, markMemberPaid, upsertMember, approveMember } from '../../../lib/api'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../lib/auth'

const BRAND = {
  bg: '#f4f1ea',
  dark: '#1d1c18',
  mid: '#26251f',
  border: '#3a382f',
  blue: '#00A3DD',
  gold: '#FCD116',
  text: '#f0ede4',
  muted: '#9c9a8e',
}

const LOCATIONS = ['Stone Town', 'Kiwengwa', 'Jambiani', 'Fumba Town']
const PROGRAMS = ['Adults BJJ', 'Kids BJJ', 'Competition', 'Beach BJJ']
const BELTS = ['White', 'Blue', 'Purple', 'Brown', 'Black']

type StatusFilter = 'all' | 'active' | 'due' | 'overdue' | 'suspended' | 'pending'

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: '#e8f6ee', color: '#1f8a5b' },
  due:       { bg: '#fdf6d8', color: '#a3820e' },
  overdue:   { bg: '#fce8e6', color: '#c0392b' },
  suspended: { bg: '#ebebeb', color: '#666' },
}

function Skeleton({ w = '100%', h = 32 }: { w?: string; h?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 6,
      background: 'linear-gradient(90deg, #2e2c24 25%, #3a382f 50%, #2e2c24 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  )
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: ok ? '#1f8a5b' : '#c0392b',
      color: '#fff', borderRadius: 8, padding: '12px 20px',
      fontFamily: 'Archivo, sans-serif', fontSize: 14, fontWeight: 600,
      boxShadow: '0 4px 24px rgba(0,0,0,.3)',
    }}>
      {msg}
    </div>
  )
}

function exportCSV(rows: any[]) {
  const headers = ['Name', 'Email', 'Phone', 'Location', 'Program', 'Belt', 'Status', 'Monthly Fee', 'Next Due', 'Sessions This Month']
  const lines = rows.map(r => {
    const m = r.members
    return [
      r.name ?? '', r.email ?? '', r.phone ?? '', r.location ?? '', r.program ?? '',
      m?.belt ?? '', m?.status ?? '', m?.fee_amount ?? '', m?.due_date ?? '', m?.sessions_this_month ?? '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  })
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `zanzibar-bjj-members-${new Date().toISOString().slice(0, 10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

interface Props {
  location: string
}

export default function Members({ location }: Props) {
  useAuth()
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Add member form state
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', location: '', program: '', fee_amount: '' })
  const [addLoading, setAddLoading] = useState(false)

  // Edit state for expanded row
  const [editFields, setEditFields] = useState<Record<string, any>>({})

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const { data, error: e } = await getAllProfiles()
      if (e) throw e
      setProfiles(data ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load members')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Filter members
  const pending = profiles.filter(p => p.role === 'pending')
  const members = profiles.filter(p => p.role === 'member')
  const locFiltered = location === 'all' ? members : members.filter(p => p.location === location)
  const searched = search.trim()
    ? locFiltered.filter(p => (p.name ?? '').toLowerCase().includes(search.toLowerCase()) || (p.phone ?? '').includes(search))
    : locFiltered
  const statusFiltered = statusFilter === 'pending'
    ? pending
    : statusFilter === 'all' ? searched : searched.filter(p => p.members?.status === statusFilter)

  const counts = {
    all: locFiltered.length,
    active: locFiltered.filter(p => p.members?.status === 'active').length,
    due: locFiltered.filter(p => p.members?.status === 'due').length,
    overdue: locFiltered.filter(p => p.members?.status === 'overdue').length,
    suspended: locFiltered.filter(p => p.members?.status === 'suspended').length,
    pending: pending.length,
  }

  async function handleMarkPaid(profileId: string, feeAmount: number) {
    const { error: e } = await markMemberPaid(profileId, feeAmount, 'cash')
    if (e) { showToast('Failed to mark paid', false); return }
    showToast('Marked as paid')
    load()
  }

  async function handleApprove(profileId: string) {
    const { error: e } = await approveMember(profileId)
    if (e) { showToast('Approval failed', false); return }
    showToast('Member approved and activated')
    load()
  }

  async function handleSaveEdit(profileId: string) {
    const fields = editFields[profileId] ?? {}
    const { name, phone, loc, program, belt, stripes, fee_amount } = fields
    const updates: any[] = []
    if (name || phone || loc || program) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updates.push((supabase.from('profiles') as any).update({
        ...(name && { name }),
        ...(phone && { phone }),
        ...(loc && { location: loc }),
        ...(program && { program }),
      }).eq('id', profileId))
    }
    if (belt || stripes !== undefined || fee_amount) {
      updates.push(upsertMember({
        id: profileId,
        ...(belt && { belt }),
        ...(stripes !== undefined && { stripes }),
        ...(fee_amount && { fee_amount: Number(fee_amount) }),
      }))
    }
    const results = await Promise.all(updates)
    const hasError = results.some((r: any) => r.error)
    if (hasError) { showToast('Save failed', false); return }
    showToast('Profile saved')
    setExpandedId(null)
    load()
  }

  async function handleAddMember() {
    if (!addForm.name || !addForm.email) { showToast('Name and email required', false); return }
    setAddLoading(true)
    try {
      // Insert directly into profiles (no auth.admin needed for basic signup)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: e } = await (supabase.from('profiles') as any).insert({
        id: crypto.randomUUID(),
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        location: addForm.location,
        program: addForm.program,
        role: 'member',
        joined_date: new Date().toISOString().split('T')[0],
      })
      if (e) throw e
      showToast('Member added')
      setShowAddModal(false)
      setAddForm({ name: '', email: '', phone: '', location: '', program: '', fee_amount: '' })
      load()
    } catch (e: any) {
      showToast(e?.message ?? 'Failed to add member', false)
    } finally {
      setAddLoading(false)
    }
  }

  function getEditField(id: string, field: string, fallback: any) {
    return editFields[id]?.[field] ?? fallback ?? ''
  }

  function setEditField(id: string, field: string, val: any) {
    setEditFields(prev => ({ ...prev, [id]: { ...(prev[id] ?? {}), [field]: val } }))
  }

  return (
    <div style={{ padding: '28px 32px', minHeight: 'calc(100vh - 62px)', background: BRAND.bg }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 26, letterSpacing: '.03em', textTransform: 'uppercase', color: BRAND.dark }}>
            Members
          </h2>
          <p style={{ margin: '4px 0 0', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted }}>
            {counts.all} members · {counts.active} active · {counts.due} due · {counts.overdue} overdue
            {counts.pending > 0 && <span style={{ color: '#e08a1e', fontWeight: 700 }}> · {counts.pending} pending approval</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => exportCSV(statusFiltered)}
            style={{ padding: '9px 18px', borderRadius: 7, border: `1.5px solid ${BRAND.border}`, background: 'transparent', color: BRAND.dark, fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: '9px 18px', borderRadius: 7, border: 'none', background: BRAND.gold, color: BRAND.dark, fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
          >
            + Add member
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fce8e6', border: '1.5px solid #e57373', borderRadius: 8, padding: '12px 18px', marginBottom: 16, color: '#c0392b', fontFamily: 'Archivo, sans-serif', fontSize: 14 }}>
          {error}
          <button onClick={load} style={{ marginLeft: 12, background: 'none', border: 'none', color: BRAND.blue, cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 7, border: `1.5px solid ${BRAND.border}`, background: '#fff', fontFamily: 'Archivo, sans-serif', fontSize: 13, width: 240, outline: 'none', color: BRAND.dark }}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', 'active', 'due', 'overdue', 'suspended'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontFamily: 'Archivo, sans-serif', fontSize: 12, fontWeight: 600,
                textTransform: 'capitalize',
                background: statusFilter === s ? BRAND.dark : '#e8e6de',
                color: statusFilter === s ? BRAND.text : BRAND.dark,
              }}
            >
              {s} {s !== 'all' && `(${counts[s]})`}
            </button>
          ))}
          <button
            onClick={() => setStatusFilter('pending')}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontFamily: 'Archivo, sans-serif', fontSize: 12, fontWeight: 700,
              background: statusFilter === 'pending' ? '#e08a1e' : '#fdf6d8',
              color: statusFilter === 'pending' ? '#fff' : '#a3820e',
            }}
          >
            Pending ({counts.pending})
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array(6).fill(null).map((_, i) => (
            <div key={i} style={{ background: BRAND.dark, borderRadius: 8, padding: 16 }}>
              <Skeleton h={20} />
            </div>
          ))}
        </div>
      ) : statusFiltered.length === 0 ? (
        <div style={{ background: BRAND.dark, borderRadius: 10, padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 15, color: BRAND.muted, margin: 0 }}>
            No members found{search ? ` matching "${search}"` : ''}.
          </p>
        </div>
      ) : (
        <div style={{ background: BRAND.dark, borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#26251f' }}>
                {['Member', 'Location', 'Program', 'Monthly Fee', 'Next Due', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: BRAND.muted, textAlign: 'left', padding: '12px 14px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statusFiltered.map(p => {
                const m = p.members
                const st = p.role === 'pending' ? 'pending' : (m?.status ?? 'active')
                const pill = st === 'pending'
                  ? { bg: '#fdf6d8', color: '#a3820e' }
                  : (STATUS_STYLE[st] ?? STATUS_STYLE.active)
                const isExpanded = expandedId === p.id

                return (
                  <>
                    <tr
                      key={p.id}
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      style={{ cursor: 'pointer', borderTop: `1px solid ${BRAND.border}`, transition: 'background .15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#26251f')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 14, fontWeight: 600, color: BRAND.text }}>{p.name ?? '—'}</div>
                        <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 12, color: BRAND.muted }}>{p.phone ?? ''}</div>
                      </td>
                      <td style={{ padding: '13px 14px', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{p.location ?? '—'}</td>
                      <td style={{ padding: '13px 14px', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{p.program ?? '—'}</td>
                      <td style={{ padding: '13px 14px', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{m?.fee_amount?.toLocaleString() ?? '—'} TZS</td>
                      <td style={{ padding: '13px 14px', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{m?.due_date ?? '—'}</td>
                      <td style={{ padding: '13px 14px' }}>
                        <span style={{ background: pill.bg, color: pill.color, borderRadius: 12, padding: '3px 10px', fontSize: 12, fontFamily: 'Archivo, sans-serif', fontWeight: 600, textTransform: 'capitalize' }}>
                          {st}
                        </span>
                      </td>
                      <td style={{ padding: '13px 14px' }} onClick={e => e.stopPropagation()}>
                        {p.role === 'pending' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => handleApprove(p.id)}
                              style={{ padding: '5px 12px', borderRadius: 5, background: '#1f8a5b', color: '#fff', fontSize: 11, fontFamily: 'Archivo, sans-serif', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                            >
                              ✓ Approve
                            </button>
                            <a
                              href={`https://wa.me/${(p.phone ?? '').replace(/\D/g, '')}?text=Hi+${encodeURIComponent(p.name ?? '')}%2C+please+complete+your+first+payment+to+activate+your+Zanzibar+BJJ+membership.`}
                              target="_blank" rel="noreferrer"
                              style={{ padding: '5px 10px', borderRadius: 5, background: '#25D366', color: '#fff', fontSize: 11, fontFamily: 'Archivo, sans-serif', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}
                            >
                              WhatsApp
                            </a>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <a
                              href={`https://wa.me/${(p.phone ?? '').replace(/\D/g, '')}?text=Hi+${encodeURIComponent(p.name ?? '')}%2C+your+Zanzibar+BJJ+payment+is+due.`}
                              target="_blank" rel="noreferrer"
                              style={{ padding: '5px 10px', borderRadius: 5, background: '#25D366', color: '#fff', fontSize: 11, fontFamily: 'Archivo, sans-serif', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}
                            >
                              Remind
                            </a>
                            <button
                              onClick={() => handleMarkPaid(p.id, m?.fee_amount ?? 0)}
                              style={{ padding: '5px 10px', borderRadius: 5, background: BRAND.blue, color: '#fff', fontSize: 11, fontFamily: 'Archivo, sans-serif', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                            >
                              Mark paid
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${p.id}-expand`} style={{ borderTop: `1px solid ${BRAND.border}` }}>
                        <td colSpan={7} style={{ padding: '20px 24px', background: '#26251f' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
                            {[
                              { label: 'Name', field: 'name', val: p.name },
                              { label: 'Phone', field: 'phone', val: p.phone },
                              { label: 'Location', field: 'loc', val: p.location, type: 'select', options: LOCATIONS },
                              { label: 'Program', field: 'program', val: p.program, type: 'select', options: PROGRAMS },
                              { label: 'Belt', field: 'belt', val: m?.belt, type: 'select', options: BELTS },
                              { label: 'Stripes', field: 'stripes', val: m?.stripes, type: 'number' },
                              { label: 'Monthly Fee (TZS)', field: 'fee_amount', val: m?.fee_amount, type: 'number' },
                              { label: 'Sessions this month', field: '_sessions', val: m?.sessions_this_month, readOnly: true },
                            ].map(f => (
                              <div key={f.field}>
                                <label style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.muted, display: 'block', marginBottom: 5 }}>
                                  {f.label}
                                </label>
                                {f.readOnly ? (
                                  <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{f.val ?? '—'}</div>
                                ) : f.type === 'select' ? (
                                  <select
                                    value={getEditField(p.id, f.field, f.val)}
                                    onChange={e => setEditField(p.id, f.field, e.target.value)}
                                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: `1.5px solid ${BRAND.border}`, background: BRAND.dark, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 13, outline: 'none' }}
                                  >
                                    <option value="">—</option>
                                    {f.options!.map(o => <option key={o} value={o}>{o}</option>)}
                                  </select>
                                ) : (
                                  <input
                                    type={f.type ?? 'text'}
                                    value={getEditField(p.id, f.field, f.val)}
                                    onChange={e => setEditField(p.id, f.field, e.target.value)}
                                    style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: `1.5px solid ${BRAND.border}`, background: BRAND.dark, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <button
                              onClick={() => handleSaveEdit(p.id)}
                              style={{ padding: '8px 20px', borderRadius: 7, background: BRAND.blue, color: '#fff', border: 'none', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                            >
                              Save changes
                            </button>
                            <button
                              onClick={() => setExpandedId(null)}
                              style={{ padding: '8px 16px', borderRadius: 7, background: 'transparent', color: BRAND.muted, border: `1.5px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 13, cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                            <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 12, color: BRAND.muted }}>
                              Joined: {p.joined_date ?? 'unknown'} · Email: {p.email ?? '—'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BRAND.dark, borderRadius: 12, padding: 32, width: 460, maxWidth: '95vw', boxShadow: '0 8px 48px rgba(0,0,0,.5)' }}>
            <h3 style={{ margin: '0 0 20px', fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 18, letterSpacing: '.03em', textTransform: 'uppercase', color: BRAND.text }}>
              Add Member
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {[
                { label: 'Full Name *', field: 'name', type: 'text' },
                { label: 'Email *', field: 'email', type: 'email' },
                { label: 'Phone', field: 'phone', type: 'tel' },
                { label: 'Monthly Fee (TZS)', field: 'fee_amount', type: 'number' },
              ].map(f => (
                <div key={f.field}>
                  <label style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.muted, display: 'block', marginBottom: 5 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={(addForm as any)[f.field]}
                    onChange={e => setAddForm(prev => ({ ...prev, [f.field]: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 7, border: `1.5px solid ${BRAND.border}`, background: BRAND.mid, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.muted, display: 'block', marginBottom: 5 }}>Location</label>
                <select
                  value={addForm.location}
                  onChange={e => setAddForm(prev => ({ ...prev, location: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 7, border: `1.5px solid ${BRAND.border}`, background: BRAND.mid, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 13, outline: 'none' }}
                >
                  <option value="">— Select —</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.muted, display: 'block', marginBottom: 5 }}>Program</label>
                <select
                  value={addForm.program}
                  onChange={e => setAddForm(prev => ({ ...prev, program: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 7, border: `1.5px solid ${BRAND.border}`, background: BRAND.mid, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 13, outline: 'none' }}
                >
                  <option value="">— Select —</option>
                  {PROGRAMS.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleAddMember}
                disabled={addLoading}
                style={{ flex: 1, padding: '11px', borderRadius: 8, background: BRAND.gold, color: BRAND.dark, border: 'none', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 14, cursor: addLoading ? 'not-allowed' : 'pointer', opacity: addLoading ? .6 : 1 }}
              >
                {addLoading ? 'Adding…' : 'Add member'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ padding: '11px 20px', borderRadius: 8, background: 'transparent', color: BRAND.muted, border: `1.5px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 14, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
