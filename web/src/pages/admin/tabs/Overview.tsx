import { useState, useEffect, useCallback } from 'react'
import { getAdminOverview, getAllProfiles, getBookings, getAllPayments } from '../../../lib/api'

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

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function fmt(n: number) {
  return n.toLocaleString()
}

interface Props {
  location: string
  setPage?: (p: string) => void
}

export default function Overview({ location }: Props) {
  const [overview, setOverview] = useState<{ total: number; active: number; due: number; overdue: number; revenue: number } | null>(null)
  const [profiles, setProfiles] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const loc = location === 'all' ? undefined : location
      const [ov, prof, book, pay] = await Promise.all([
        getAdminOverview(loc),
        getAllProfiles(),
        getBookings(),
        getAllPayments(),
      ])
      if (prof.error) throw prof.error
      if (book.error) throw book.error
      if (pay.error) throw pay.error
      setOverview(ov)
      setProfiles(prof.data ?? [])
      setBookings(book.data ?? [])
      setPayments(pay.data ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load overview data')
    } finally {
      setLoading(false)
    }
  }, [location])

  useEffect(() => { load() }, [load])

  // Build location breakdown from profiles
  const locationBreakdown = LOCATIONS.map(loc => {
    const locProfiles = profiles.filter(p => p.role === 'member' && p.location === loc)
    const members = locProfiles.map(p => p.members).filter(Boolean)
    const active = members.filter((m: any) => m?.status === 'active').length
    const due = members.filter((m: any) => m?.status === 'due').length
    const overdue = members.filter((m: any) => m?.status === 'overdue').length
    const revenue = members.filter((m: any) => m?.status === 'active').reduce((s: number, m: any) => s + (m?.fee_amount ?? 0), 0)
    return { loc, total: locProfiles.length, active, due, overdue, revenue }
  })

  // Monthly bar chart data — last 6 months from payments
  const now = new Date()
  const monthLabels: string[] = []
  const monthCounts: number[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleString('default', { month: 'short' })
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthLabels.push(label)
    const count = payments.filter(p => p.paid_date?.startsWith(key)).length
    monthCounts.push(count)
  }
  const maxCount = Math.max(...monthCounts, 1)

  // Payment health
  const totalMembers = overview ? overview.total : 0
  const paidPct = totalMembers > 0 ? Math.round(((overview?.active ?? 0) / totalMembers) * 100) : 0
  const duePct = totalMembers > 0 ? Math.round(((overview?.due ?? 0) / totalMembers) * 100) : 0
  const overduePct = totalMembers > 0 ? Math.round(((overview?.overdue ?? 0) / totalMembers) * 100) : 0

  const newBookingsCount = bookings.filter(b => b.status === 'new').length
  const scopeLabel = location === 'all' ? 'All locations' : location

  return (
    <div style={{ padding: '28px 32px', minHeight: 'calc(100vh - 62px)', background: BRAND.bg }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      {/* Page title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 26, letterSpacing: '.03em', textTransform: 'uppercase', color: BRAND.dark }}>
            Overview
          </h2>
          <p style={{ margin: '4px 0 0', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted }}>
            {scopeLabel} · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            style={{ padding: '9px 18px', borderRadius: 7, border: 'none', background: BRAND.gold, color: BRAND.dark, fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: '.02em' }}
          >
            Remind all due
          </button>
          <button
            style={{ padding: '9px 18px', borderRadius: 7, border: `1.5px solid ${BRAND.border}`, background: 'transparent', color: BRAND.dark, fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
          >
            All members
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fce8e6', border: '1.5px solid #e57373', borderRadius: 8, padding: '12px 18px', marginBottom: 20, color: '#c0392b', fontFamily: 'Archivo, sans-serif', fontSize: 14 }}>
          {error}
          <button onClick={load} style={{ marginLeft: 12, background: 'none', border: 'none', color: BRAND.blue, cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
        {loading ? Array(5).fill(null).map((_, i) => (
          <div key={i} style={{ background: BRAND.dark, borderRadius: 10, padding: '20px 20px 18px' }}>
            <Skeleton w="60%" h={13} />
            <div style={{ marginTop: 10 }}><Skeleton w="80%" h={36} /></div>
            <div style={{ marginTop: 8 }}><Skeleton w="50%" h={11} /></div>
          </div>
        )) : [
          { label: 'Active Members', value: fmt(overview?.active ?? 0), delta: `of ${overview?.total ?? 0} total` },
          { label: 'Monthly Revenue (TZS)', value: `${fmt(overview?.revenue ?? 0)}`, delta: 'active members only' },
          { label: 'Payment Rate', value: `${paidPct}%`, delta: `${duePct}% due · ${overduePct}% overdue` },
          { label: 'New Bookings', value: fmt(newBookingsCount), delta: 'awaiting contact' },
          { label: 'Overdue', value: fmt(overview?.overdue ?? 0), delta: 'need follow-up' },
        ].map((card, i) => (
          <div key={i} style={{ background: BRAND.dark, borderRadius: 10, padding: '20px 20px 18px' }}>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: BRAND.muted, marginBottom: 8 }}>
              {card.label}
            </div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 30, fontWeight: 900, color: BRAND.text, lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 12, color: BRAND.muted, marginTop: 6 }}>
              {card.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Two-column charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* Monthly active bar chart */}
        <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 20 }}>
            Monthly Payments
          </div>
          {loading ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 120 }}>
              {Array(6).fill(null).map((_, i) => <Skeleton key={i} w="14%" h={60 + i * 10} />)}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 120 }}>
              {monthCounts.map((count, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 11, fontFamily: 'Archivo, sans-serif', color: BRAND.muted }}>{count}</div>
                  <div style={{
                    width: '100%',
                    height: Math.max(4, Math.round((count / maxCount) * 100)),
                    background: BRAND.blue,
                    borderRadius: '3px 3px 0 0',
                    transition: 'height .3s ease',
                  }} />
                  <div style={{ fontSize: 11, fontFamily: 'Archivo, sans-serif', color: BRAND.muted }}>{monthLabels[i]}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment health */}
        <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 18 }}>
            Payment Health
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton h={20} />
              <Skeleton h={14} />
              <Skeleton h={14} />
              <Skeleton h={14} />
            </div>
          ) : (
            <>
              {/* Proportional bar */}
              <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ width: `${paidPct}%`, background: '#1f8a5b', transition: 'width .3s' }} />
                <div style={{ width: `${duePct}%`, background: '#a3820e', transition: 'width .3s' }} />
                <div style={{ width: `${overduePct}%`, background: '#c0392b', transition: 'width .3s' }} />
                {(paidPct + duePct + overduePct) < 100 && (
                  <div style={{ flex: 1, background: '#3a382f' }} />
                )}
              </div>
              {[
                { label: 'Paid / Active', count: overview?.active ?? 0, pct: paidPct, color: '#1f8a5b', bg: '#e8f6ee' },
                { label: 'Due this month', count: overview?.due ?? 0, pct: duePct, color: '#a3820e', bg: '#fdf6d8' },
                { label: 'Overdue', count: overview?.overdue ?? 0, pct: overduePct, color: '#c0392b', bg: '#fce8e6' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: row.color }} />
                    <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>{row.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, fontWeight: 700, color: BRAND.text }}>{row.count}</span>
                    <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: BRAND.muted }}>{row.pct}%</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Location breakdown table */}
      <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24, marginBottom: 28 }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 18 }}>
          Location Breakdown
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array(4).fill(null).map((_, i) => <Skeleton key={i} h={36} />)}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Location', 'Members', 'Monthly TZS', 'Paid', 'Due', 'Overdue', ''].map(h => (
                  <th key={h} style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: BRAND.muted, textAlign: 'left', padding: '0 12px 10px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locationBreakdown.map(row => (
                <tr key={row.loc}>
                  {[
                    row.loc,
                    fmt(row.total),
                    fmt(row.revenue),
                    row.active,
                    row.due,
                    row.overdue,
                  ].map((cell, ci) => (
                    <td key={ci} style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text, padding: '12px 12px 12px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                      {cell}
                    </td>
                  ))}
                  <td style={{ padding: '12px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                    <button style={{ background: 'none', border: `1.5px solid ${BRAND.border}`, color: BRAND.blue, fontFamily: 'Archivo, sans-serif', fontSize: 12, padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontWeight: 600 }}>
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent activity */}
      <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 18 }}>
          Recent Activity
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array(5).fill(null).map((_, i) => <Skeleton key={i} h={22} />)}
          </div>
        ) : bookings.length === 0 ? (
          <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted, margin: 0 }}>No recent bookings.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {bookings.slice(0, 10).map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: BRAND.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}>
                    {(b.name ?? '?')[0].toUpperCase()}
                  </div>
                  <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>
                    <strong>{b.name}</strong> booked a free class at <strong>{b.location ?? 'unknown'}</strong>
                  </span>
                </div>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 12, color: BRAND.muted, whiteSpace: 'nowrap' }}>
                  {timeAgo(b.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
