import { useState, useEffect, useCallback, useRef } from 'react'
import { getAllPayments, getAllProfiles, markMemberPaid } from '../../../lib/api'

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

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: '#e8f6ee', color: '#1f8a5b' },
  due:       { bg: '#fdf6d8', color: '#a3820e' },
  overdue:   { bg: '#fce8e6', color: '#c0392b' },
  suspended: { bg: '#ebebeb', color: '#666' },
}

// Hardcoded expense placeholders until Content tab is used to manage them
const EXPENSES = [
  { label: 'Rent — Stone Town', amount: 1200000 },
  { label: 'Rent — Kiwengwa', amount: 900000 },
  { label: 'Rent — Jambiani', amount: 750000 },
  { label: 'Rent — Fumba Town', amount: 800000 },
  { label: 'Equipment & Gear', amount: 350000 },
  { label: 'Utilities', amount: 180000 },
  { label: 'Marketing', amount: 120000 },
]
const TOTAL_EXPENSES = EXPENSES.reduce((s, e) => s + e.amount, 0)

function getLastSixMonths() {
  const months: { label: string; value: string }[] = []
  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleString('default', { month: 'long', year: 'numeric' })
    months.push({ label, value })
  }
  return months
}

function fmt(n: number) { return n.toLocaleString() }

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

interface Props {
  location: string
}

export default function Accounting({ location }: Props) {
  const months = getLastSixMonths()
  const [selectedMonth, setSelectedMonth] = useState(months[0].value)
  const [payments, setPayments] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [payRes, profRes] = await Promise.all([
        getAllPayments(selectedMonth),
        getAllProfiles(),
      ])
      if (payRes.error) throw payRes.error
      if (profRes.error) throw profRes.error
      setPayments(payRes.data ?? [])
      setProfiles(profRes.data ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load accounting data')
    } finally {
      setLoading(false)
    }
  }, [selectedMonth])

  useEffect(() => { load() }, [load])

  // Filter payments by location
  const locPayments = location === 'all'
    ? payments
    : payments.filter(p => (p.profiles as any)?.location === location)

  const totalCollected = locPayments.reduce((s, p) => s + p.amount, 0)

  // Outstanding = members with due/overdue status
  const members = profiles.filter(p => p.role === 'member')
  const locMembers = location === 'all' ? members : members.filter(p => p.location === location)
  const outstanding = locMembers
    .filter(p => p.members?.status === 'due' || p.members?.status === 'overdue')
    .map(p => ({
      id: p.id,
      name: p.name,
      location: p.location,
      amount: p.members?.fee_amount ?? 0,
      status: p.members?.status,
      due_date: p.members?.due_date,
      daysLate: p.members?.due_date
        ? Math.max(0, Math.floor((Date.now() - new Date(p.members.due_date).getTime()) / 86400000))
        : 0,
    }))
    .sort((a, b) => b.daysLate - a.daysLate)

  const totalOutstanding = outstanding.reduce((s, r) => s + r.amount, 0)
  const net = totalCollected - TOTAL_EXPENSES

  // Income by source — classify by program
  const kidsPayments = locPayments.filter(p => {
    const prof = profiles.find(pr => pr.id === p.member_id)
    return prof?.program?.toLowerCase().includes('kid')
  })
  const localPayments = locPayments.filter(p => {
    const prof = profiles.find(pr => pr.id === p.member_id)
    return !prof?.program?.toLowerCase().includes('kid') && !prof?.program?.toLowerCase().includes('beach')
  })
  const visitorPayments = locPayments.filter(p => {
    const prof = profiles.find(pr => pr.id === p.member_id)
    return prof?.program?.toLowerCase().includes('beach')
  })

  const kidsTotal = kidsPayments.reduce((s, p) => s + p.amount, 0)
  const localTotal = localPayments.reduce((s, p) => s + p.amount, 0)
  const visitorTotal = visitorPayments.reduce((s, p) => s + p.amount, 0)
  const sourceMax = Math.max(kidsTotal, localTotal, visitorTotal, 1)

  async function handleMarkAllPaid() {
    if (!confirm(`Mark all ${outstanding.length} outstanding members as paid?`)) return
    const results = await Promise.all(outstanding.map(o => markMemberPaid(o.id, o.amount, 'cash')))
    const errors = results.filter((r: any) => r.error)
    if (errors.length > 0) { showToast(`${errors.length} errors occurred`, false); return }
    showToast(`Marked ${outstanding.length} members as paid`)
    load()
  }

  const scopeLabel = location === 'all' ? 'All locations' : location

  return (
    <div style={{ padding: '28px 32px', minHeight: 'calc(100vh - 62px)', background: BRAND.bg }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 26, letterSpacing: '.03em', textTransform: 'uppercase', color: BRAND.dark }}>
            Accounting
          </h2>
          <p style={{ margin: '4px 0 0', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted }}>
            {scopeLabel}
          </p>
        </div>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 7, border: `1.5px solid ${BRAND.border}`, background: BRAND.dark, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 13, cursor: 'pointer', outline: 'none' }}
        >
          {months.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{ background: '#fce8e6', border: '1.5px solid #e57373', borderRadius: 8, padding: '12px 18px', marginBottom: 16, color: '#c0392b', fontFamily: 'Archivo, sans-serif', fontSize: 14 }}>
          {error}
          <button onClick={load} style={{ marginLeft: 12, background: 'none', border: 'none', color: BRAND.blue, cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {loading ? Array(4).fill(null).map((_, i) => (
          <div key={i} style={{ background: BRAND.dark, borderRadius: 10, padding: '20px 20px 18px' }}>
            <Skeleton w="60%" h={13} />
            <div style={{ marginTop: 10 }}><Skeleton w="80%" h={36} /></div>
          </div>
        )) : [
          { label: 'Total Collected', value: `${fmt(totalCollected)} TZS`, color: '#1f8a5b' },
          { label: 'Outstanding', value: `${fmt(totalOutstanding)} TZS`, color: '#a3820e' },
          { label: 'Expenses', value: `${fmt(TOTAL_EXPENSES)} TZS`, color: BRAND.muted },
          { label: 'Net', value: `${fmt(net)} TZS`, color: net >= 0 ? '#1f8a5b' : '#c0392b' },
        ].map((card, i) => (
          <div key={i} style={{ background: BRAND.dark, borderRadius: 10, padding: '20px 20px 18px' }}>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: BRAND.muted, marginBottom: 8 }}>
              {card.label}
            </div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 24, fontWeight: 900, color: card.color, lineHeight: 1 }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Income by source */}
        <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 20 }}>
            Income by Source
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Array(3).fill(null).map((_, i) => <Skeleton key={i} h={40} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Local Members', total: localTotal, color: BRAND.blue },
                { label: 'Beach / Visitors', total: visitorTotal, color: BRAND.gold },
                { label: 'Kids Program', total: kidsTotal, color: '#a259ff' },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{row.label}</span>
                    <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, fontWeight: 700, color: BRAND.text }}>{fmt(row.total)} TZS</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: BRAND.border }}>
                    <div style={{
                      height: '100%', borderRadius: 5,
                      width: `${Math.round((row.total / sourceMax) * 100)}%`,
                      background: row.color, transition: 'width .4s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expenses */}
        <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text }}>
              Expenses
            </div>
            <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: BRAND.muted }}>Manage in Content tab ✏️</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {EXPENSES.map(exp => (
              <div key={exp.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{exp.label}</span>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, fontWeight: 600, color: BRAND.text }}>{fmt(exp.amount)} TZS</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, fontWeight: 700, color: BRAND.text }}>Total</span>
              <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 14, fontWeight: 900, color: BRAND.gold }}>{fmt(TOTAL_EXPENSES)} TZS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding balances table */}
      <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text }}>
            Outstanding Balances
            {outstanding.length > 0 && (
              <span style={{ marginLeft: 10, background: '#fce8e6', color: '#c0392b', borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                {outstanding.length}
              </span>
            )}
          </div>
          {outstanding.length > 0 && (
            <button
              onClick={handleMarkAllPaid}
              style={{ padding: '8px 18px', borderRadius: 7, background: BRAND.gold, color: BRAND.dark, border: 'none', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
            >
              Mark all paid
            </button>
          )}
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array(4).fill(null).map((_, i) => <Skeleton key={i} h={36} />)}
          </div>
        ) : outstanding.length === 0 ? (
          <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 14, color: BRAND.muted, margin: 0 }}>No outstanding balances. All members up to date.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Member', 'Location', 'Amount', 'Days Late', 'Status'].map(h => (
                  <th key={h} style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: BRAND.muted, textAlign: 'left', padding: '0 12px 10px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {outstanding.map(row => {
                const pill = STATUS_STYLE[row.status] ?? STATUS_STYLE.due
                return (
                  <tr key={row.id}>
                    <td style={{ padding: '12px 12px 12px 0', borderBottom: `1px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text, fontWeight: 600 }}>{row.name ?? '—'}</td>
                    <td style={{ padding: '12px 12px 12px 0', borderBottom: `1px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{row.location ?? '—'}</td>
                    <td style={{ padding: '12px 12px 12px 0', borderBottom: `1px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{fmt(row.amount)} TZS</td>
                    <td style={{ padding: '12px 12px 12px 0', borderBottom: `1px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 13, color: row.daysLate > 14 ? '#c0392b' : BRAND.text }}>{row.daysLate}d</td>
                    <td style={{ padding: '12px 12px 12px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                      <span style={{ background: pill.bg, color: pill.color, borderRadius: 12, padding: '3px 10px', fontSize: 12, fontFamily: 'Archivo, sans-serif', fontWeight: 600, textTransform: 'capitalize' }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
