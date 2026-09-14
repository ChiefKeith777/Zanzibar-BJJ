import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getAlertRules, updateAlertRule,
  getNotificationLog,
  getBeachSignups,
  getBookings, updateBookingStatus,
} from '../../../lib/api'

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

function Skeleton({ h = 32 }: { h?: number }) {
  return (
    <div style={{
      width: '100%', height: h, borderRadius: 6,
      background: 'linear-gradient(90deg, #2e2c24 25%, #3a382f 50%, #2e2c24 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  )
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: ok ? '#1f8a5b' : '#c0392b', color: '#fff', borderRadius: 8, padding: '12px 20px',
      fontFamily: 'Archivo, sans-serif', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(0,0,0,.3)',
    }}>
      {msg}
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
        background: value ? BRAND.blue : BRAND.border,
        position: 'relative', transition: 'background .2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.3)',
      }} />
    </div>
  )
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}


export default function Alerts() {
  const [rules, setRules] = useState<any[]>([])
  const [logEntries, setLogEntries] = useState<any[]>([])
  const [newBookings, setNewBookings] = useState<any[]>([])
  const [beachSignups, setBeachSignups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [updatingRule, setUpdatingRule] = useState<string | null>(null)
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [rulesRes, logRes, bookingsRes, beachRes] = await Promise.all([
        getAlertRules(),
        getNotificationLog(50),
        getBookings('new'),
        getBeachSignups(),
      ])
      if (rulesRes.error) throw rulesRes.error
      if (logRes.error) throw logRes.error
      if (bookingsRes.error) throw bookingsRes.error
      if (beachRes.error) throw beachRes.error
      setRules(rulesRes.data ?? [])
      setLogEntries(logRes.data ?? [])
      setNewBookings(bookingsRes.data ?? [])
      setBeachSignups(beachRes.data ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load alert data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleToggleRule(rule: any, field: 'email_enabled' | 'wa_enabled') {
    setUpdatingRule(rule.id)
    const newVal = !rule[field]
    const { error: e } = await updateAlertRule(rule.id, { [field]: newVal })
    setUpdatingRule(null)
    if (e) { showToast('Failed to update rule', false); return }
    showToast(`${rule.label} — ${field === 'email_enabled' ? 'Email' : 'WhatsApp'} ${newVal ? 'enabled' : 'disabled'}`)
    setRules(prev => prev.map(r => r.id === rule.id ? { ...r, [field]: newVal } : r))
  }

  async function handleBookingAction(id: string, status: 'contacted' | 'enrolled' | 'declined') {
    setUpdatingBooking(id)
    const { error: e } = await updateBookingStatus(id, status)
    setUpdatingBooking(null)
    if (e) { showToast('Failed to update booking', false); return }
    showToast(`Booking marked as ${status}`)
    setNewBookings(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div style={{ padding: '28px 32px', minHeight: 'calc(100vh - 62px)', background: BRAND.bg }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 26, letterSpacing: '.03em', textTransform: 'uppercase', color: BRAND.dark }}>
          Alerts &amp; Automation
        </h2>
        <p style={{ margin: '6px 0 0', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted }}>
          Configure notification rules, review incoming bookings, and manage signups.
        </p>
      </div>

      {error && (
        <div style={{ background: '#fce8e6', border: '1.5px solid #e57373', borderRadius: 8, padding: '12px 18px', marginBottom: 16, color: '#c0392b', fontFamily: 'Archivo, sans-serif', fontSize: 14 }}>
          {error}
          <button onClick={load} style={{ marginLeft: 12, background: 'none', border: 'none', color: BRAND.blue, cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
      )}

      {/* Alert Rules */}
      <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24, marginBottom: 24 }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 18 }}>
          Alert Rules
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array(4).fill(null).map((_, i) => <Skeleton key={i} h={44} />)}
          </div>
        ) : rules.length === 0 ? (
          <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted, margin: 0 }}>No alert rules configured.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Trigger', 'Note', 'Email', 'WhatsApp'].map(h => (
                  <th key={h} style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: BRAND.muted, textAlign: 'left', padding: '0 16px 10px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id} style={{ opacity: updatingRule === rule.id ? .5 : 1, transition: 'opacity .2s' }}>
                  <td style={{ padding: '13px 16px 13px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                    <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, fontWeight: 600, color: BRAND.text }}>{rule.label}</div>
                    <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: BRAND.muted, textTransform: 'capitalize' }}>{rule.trigger_key} · tone: {rule.tone}</div>
                  </td>
                  <td style={{ padding: '13px 16px 13px 0', borderBottom: `1px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 12, color: BRAND.muted, maxWidth: 280 }}>
                    {rule.note ?? '—'}
                  </td>
                  <td style={{ padding: '13px 16px 13px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                    <Toggle value={rule.email_enabled} onChange={() => handleToggleRule(rule, 'email_enabled')} />
                  </td>
                  <td style={{ padding: '13px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                    <Toggle value={rule.wa_enabled} onChange={() => handleToggleRule(rule, 'wa_enabled')} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Two-column: notification log + new bookings inbox */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Notification log */}
        <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 18 }}>
            Notification Log
            <span style={{ marginLeft: 10, background: BRAND.border, borderRadius: 10, padding: '2px 8px', fontSize: 11, color: BRAND.muted, fontWeight: 600 }}>
              {logEntries.length}
            </span>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array(5).fill(null).map((_, i) => <Skeleton key={i} h={40} />)}
            </div>
          ) : logEntries.length === 0 ? (
            <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted, margin: 0 }}>No notifications sent yet.</p>
          ) : (
            <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {logEntries.map(entry => (
                <div key={entry.id} style={{ padding: '11px 0', borderBottom: `1px solid ${BRAND.border}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{
                    flexShrink: 0, borderRadius: 5, padding: '2px 8px',
                    fontFamily: 'Archivo, sans-serif', fontSize: 10, fontWeight: 700,
                    background: entry.channel === 'whatsapp' ? '#25D366' : BRAND.blue,
                    color: '#fff', textTransform: 'uppercase', letterSpacing: '.04em',
                  }}>
                    {entry.channel ?? 'sys'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 12, color: BRAND.text, marginBottom: 2, lineHeight: 1.4 }}>
                      {entry.text ?? '—'}
                    </div>
                    {(entry.profiles as any)?.name && (
                      <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: BRAND.muted }}>→ {(entry.profiles as any).name}</div>
                    )}
                  </div>
                  <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: BRAND.muted, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {timeAgo(entry.sent_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New bookings inbox */}
        <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 18 }}>
            New Bookings Inbox
            {newBookings.length > 0 && (
              <span style={{ marginLeft: 10, background: BRAND.blue, borderRadius: 10, padding: '2px 8px', fontSize: 11, color: '#fff', fontWeight: 700 }}>
                {newBookings.length}
              </span>
            )}
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Array(3).fill(null).map((_, i) => <Skeleton key={i} h={80} />)}
            </div>
          ) : newBookings.length === 0 ? (
            <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted, margin: 0 }}>Inbox clear. No new bookings.</p>
          ) : (
            <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {newBookings.map(b => (
                <div key={b.id} style={{ padding: '14px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 14, fontWeight: 700, color: BRAND.text }}>{b.name}</div>
                      <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 12, color: BRAND.muted }}>{b.phone} · {b.location ?? '?'} · {b.program ?? 'General'}</div>
                      {b.kid_name && (
                        <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 12, color: BRAND.muted }}>Kid: {b.kid_name}, age {b.kid_age}</div>
                      )}
                    </div>
                    <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: BRAND.muted, whiteSpace: 'nowrap' }}>{timeAgo(b.created_at)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, opacity: updatingBooking === b.id ? .4 : 1 }}>
                    <button
                      onClick={() => handleBookingAction(b.id, 'contacted')}
                      disabled={updatingBooking === b.id}
                      style={{ padding: '5px 12px', borderRadius: 5, background: BRAND.gold, color: BRAND.dark, border: 'none', fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Mark contacted
                    </button>
                    <button
                      onClick={() => handleBookingAction(b.id, 'enrolled')}
                      disabled={updatingBooking === b.id}
                      style={{ padding: '5px 12px', borderRadius: 5, background: '#1f8a5b', color: '#fff', border: 'none', fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Enroll
                    </button>
                    <button
                      onClick={() => handleBookingAction(b.id, 'declined')}
                      disabled={updatingBooking === b.id}
                      style={{ padding: '5px 12px', borderRadius: 5, background: 'transparent', color: '#c0392b', border: '1.5px solid #c0392b', fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Beach signups */}
      <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 18 }}>
          Beach Signup List
          <span style={{ marginLeft: 10, background: BRAND.gold, borderRadius: 10, padding: '2px 8px', fontSize: 11, color: BRAND.dark, fontWeight: 700 }}>
            {beachSignups.length}
          </span>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array(4).fill(null).map((_, i) => <Skeleton key={i} h={36} />)}
          </div>
        ) : beachSignups.length === 0 ? (
          <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted, margin: 0 }}>No beach signups yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Name', 'Phone', 'Signed up'].map(h => (
                  <th key={h} style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: BRAND.muted, textAlign: 'left', padding: '0 16px 10px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {beachSignups.map(s => (
                <tr key={s.id}>
                  <td style={{ padding: '11px 16px 11px 0', borderBottom: `1px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text, fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: '11px 16px 11px 0', borderBottom: `1px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text }}>
                    <a
                      href={`https://wa.me/${(s.phone ?? '').replace(/\D/g, '')}?text=Hi+${encodeURIComponent(s.name)}%2C+welcome+to+Zanzibar+BJJ+Beach+training!`}
                      target="_blank" rel="noreferrer"
                      style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600 }}
                    >
                      {s.phone}
                    </a>
                  </td>
                  <td style={{ padding: '11px 0', borderBottom: `1px solid ${BRAND.border}`, fontFamily: 'Archivo, sans-serif', fontSize: 12, color: BRAND.muted }}>
                    {new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {timeAgo(s.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
