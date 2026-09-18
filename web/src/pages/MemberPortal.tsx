import React, { useState, useEffect } from 'react'
import { dict, type Lang } from '../../../shared/content/translations'
import { useAuth } from '../lib/auth'
import { getMember, getMemberPayments, getMemberAttendance, updateProfile } from '../lib/api'
import type { Member, Payment, Attendance } from '../lib/database.types'
import {
  getBeltColor,
  beltStripePercent,
  statusColors,
  daysUntil,
  formatDate,
  buildWeekBars,
  sessionsThisMonth,
} from '../lib/utils'
import hero4 from '../assets/hero-4.jpg'

interface MemberPortalProps {
  lang: Lang
  setPage: (p: string) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MemberPortal({ lang, setPage }: MemberPortalProps) {
  const t = dict[lang]
  const { user, profile, signOut, refreshProfile } = useAuth()

  const [member, setMember]       = useState<Member | null>(null)
  const [payments, setPayments]   = useState<Payment[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])

  const [loadingData, setLoadingData] = useState(true)
  const [dataErr, setDataErr]         = useState<string | null>(null)
  const [noMemberRow, setNoMemberRow] = useState(false)

  // Profile edit state
  const [profileName,  setProfileName]  = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const [saveErr,      setSaveErr]      = useState<string | null>(null)
  const [saveBusy,     setSaveBusy]     = useState(false)

  const DARK  = '#1d1c18'
  const GOLD  = '#FCD116'
  const BLU   = '#00A3DD'
  const MUTED = '#8d897e'

  // ── Fetch data on mount ─────────────────────────────────────
  useEffect(() => {
    if (!user) return

    async function load() {
      setLoadingData(true)
      setDataErr(null)

      try {
        const [memberRes, paymentsRes, attendanceRes] = await Promise.all([
          getMember(user!.id),
          getMemberPayments(user!.id),
          getMemberAttendance(user!.id),
        ])

        if (memberRes.error) {
          if (memberRes.error.code === 'PGRST116') {
            // No row found — member profile not created yet
            setNoMemberRow(true)
          } else {
            setDataErr(memberRes.error.message)
          }
        } else {
          setMember(memberRes.data)
        }

        if (!paymentsRes.error)   setPayments(paymentsRes.data ?? [])
        if (!attendanceRes.error) setAttendance(attendanceRes.data ?? [])
      } catch (e: unknown) {
        setDataErr(e instanceof Error ? e.message : 'Failed to load member data')
      } finally {
        setLoadingData(false)
      }
    }

    load()
  }, [user])

  // Pre-fill profile edit form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileName(profile.name ?? '')
      setProfilePhone(profile.phone ?? '')
    }
  }, [profile])

  // ── Sign out ────────────────────────────────────────────────
  const handleSignOut = async () => {
    await signOut()
    setPage('home')
  }

  // ── Save profile ────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaveBusy(true)
    setSaveErr(null)
    setProfileSaved(false)

    const { error } = await updateProfile(user.id, {
      name:  profileName.trim() || null,
      phone: profilePhone.trim() || null,
    })

    setSaveBusy(false)
    if (error) {
      setSaveErr(error.message)
    } else {
      await refreshProfile()
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    }
  }

  // ── Derived display values ───────────────────────────────────
  const displayName   = profile?.name ?? user?.email ?? 'Member'
  const initial       = displayName.trim().charAt(0).toUpperCase()
  const belt          = member?.belt ?? 'White Belt'
  const stripes       = member?.stripes ?? 0
  const statusBadge   = statusColors(member?.status ?? 'active')
  const daysLeft      = daysUntil(member?.due_date ?? null)
  const beltPct       = beltStripePercent(stripes)
  const weekBars      = buildWeekBars(attendance)
  const sessionsMonth = sessionsThisMonth(attendance)
  const recentPayments = payments.slice(0, 5)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#f9f8f5',
    border: '1px solid #e6e2d8',
    borderRadius: 4,
    padding: '10px 13px',
    fontFamily: 'Archivo, sans-serif',
    fontSize: 14,
    color: DARK,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Archivo, sans-serif',
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: MUTED,
    marginBottom: 6,
  }

  // ── Loading skeleton ─────────────────────────────────────────
  if (loadingData) {
    return (
      <div
        style={{
          background: '#f4f1ea',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: `3px solid ${BLU}`,
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ color: MUTED, fontFamily: 'Archivo, sans-serif', fontSize: 13 }}>
          Loading your portal…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Data error ───────────────────────────────────────────────
  if (dataErr) {
    return (
      <div
        style={{
          background: '#f4f1ea',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #fca5a5',
            borderRadius: 8,
            padding: 32,
            maxWidth: 440,
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#dc2626', fontFamily: 'Archivo, sans-serif', fontSize: 14, marginBottom: 16 }}>
            {dataErr}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: DARK,
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '10px 20px',
              borderRadius: 4,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // ── No member row yet ─────────────────────────────────────────
  if (noMemberRow) {
    return (
      <div
        style={{
          background: '#f4f1ea',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #e6e2d8',
            borderRadius: 8,
            padding: 40,
            maxWidth: 480,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: GOLD,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 22,
              color: DARK,
            }}
          >
            {initial}
          </div>
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 20,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 12px 0',
            }}
          >
            Complete Your Profile
          </h2>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            Your account was created but your member record hasn't been set up yet.
            Please contact admin to activate your membership.
          </p>
          <button
            onClick={() => setPage('contact')}
            style={{
              background: BLU,
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '11px 24px',
              borderRadius: 4,
              marginRight: 10,
            }}
          >
            Contact Admin
          </button>
          <button
            onClick={handleSignOut}
            style={{
              background: 'transparent',
              border: '1px solid #e6e2d8',
              cursor: 'pointer',
              color: MUTED,
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '11px 20px',
              borderRadius: 4,
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  // ── Main portal ───────────────────────────────────────────────
  return (
    <div style={{ background: '#f4f1ea', minHeight: 'calc(100vh - 64px)' }}>

      {/* Hero banner */}
      <div
        style={{
          position: 'relative',
          height: 240,
          backgroundImage: `url(${hero4})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(29,28,24,0.9), rgba(29,28,24,0.4))',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '0 60px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            width: '100%',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: GOLD,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 24,
              color: DARK,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div>
            <p
              style={{
                color: GOLD,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                margin: '0 0 4px 0',
              }}
            >
              {t.portalKick}
            </p>
            <h1
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 900,
                fontSize: 28,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                margin: '0 0 4px 0',
              }}
            >
              {displayName}
            </h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: '#cfccc3', fontSize: 13 }}>
                {belt} · {stripes} stripe{stripes !== 1 ? 's' : ''}
              </span>
              <span
                style={{
                  background: statusBadge.bg,
                  color: statusBadge.color,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 999,
                }}
              >
                {member?.status ?? 'active'}
              </span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              onClick={handleSignOut}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                color: '#cfccc3',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                borderRadius: 4,
              }}
            >
              Sign Out
            </button>
            <button
              onClick={() => setPage('home')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                color: '#fff',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '8px 16px',
                borderRadius: 4,
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 60px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}
      >
        {/* ── Payment card ──────────────────────────────────── */}
        <div
          style={{
            background: DARK,
            borderRadius: 8,
            padding: 24,
            border: `1px solid ${GOLD}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p
                style={{
                  color: GOLD,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  margin: '0 0 4px 0',
                }}
              >
                {t.nextPayment}
              </p>
              <p
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 900,
                  fontSize: 32,
                  color: '#fff',
                  margin: '0 0 4px 0',
                }}
              >
                {member?.fee_amount?.toLocaleString() ?? '—'} TZS
              </p>
              <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>
                Due {formatDate(member?.due_date ?? null)}
              </p>
            </div>
            {daysLeft >= 0 && daysLeft <= 3 && (
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: 4,
                }}
              >
                {daysLeft} day{daysLeft !== 1 ? 's' : ''}
              </span>
            )}
            {daysLeft < 0 && (
              <span
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: 4,
                }}
              >
                Overdue
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <a
              href="tel:+255"
              style={{
                background: GOLD,
                border: 'none',
                cursor: 'pointer',
                color: DARK,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '10px 20px',
                borderRadius: 4,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              {t.payNow}
            </a>
            <button
              onClick={() => setPage('contact')}
              style={{
                background: 'transparent',
                border: '1px solid #3a382f',
                cursor: 'pointer',
                color: '#cfccc3',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '10px 20px',
                borderRadius: 4,
              }}
            >
              {t.askOffice}
            </button>
          </div>
          <p style={{ color: '#55524a', fontSize: 11, marginTop: 12 }}>{t.payMethods}</p>
        </div>

        {/* ── Membership details ─────────────────────────────── */}
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 24,
            border: '1px solid #e6e2d8',
          }}
        >
          <h3
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 16px 0',
            }}
          >
            {t.membership}
          </h3>
          {[
            { k: 'Name',      v: profile?.name ?? '—' },
            { k: 'Email',     v: profile?.email ?? '—' },
            { k: 'Program',   v: profile?.program ?? '—' },
            { k: 'Location',  v: profile?.location ?? '—' },
            { k: 'Member since', v: formatDate(profile?.joined_date ?? null) },
            { k: 'Status',    v: member?.status ?? '—' },
          ].map((row) => (
            <div
              key={row.k}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #f4f1ea',
              }}
            >
              <span style={{ color: MUTED, fontSize: 13 }}>{row.k}</span>
              <span
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 600,
                  fontSize: 13,
                  color: DARK,
                }}
              >
                {row.v}
              </span>
            </div>
          ))}
        </div>

        {/* ── Attendance chart ───────────────────────────────── */}
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 24,
            border: '1px solid #e6e2d8',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                color: DARK,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: 0,
              }}
            >
              {t.attendance}
            </h3>
            <span
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 22,
                color: BLU,
              }}
            >
              {sessionsMonth}
            </span>
          </div>
          <p style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>
            {sessionsMonth} {t.thisMonth}
          </p>
          {/* Bar chart */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
            {weekBars.map((w) => (
              <div key={w.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', position: 'relative', height: 60 }}>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      height: `${Math.max(w.pct, 4)}%`,
                      background: w.pct > 0 ? BLU : '#e6e2d8',
                      borderRadius: '2px 2px 0 0',
                      opacity: 0.85,
                    }}
                  />
                </div>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 9, color: MUTED }}>{w.label}</span>
              </div>
            ))}
          </div>
          {attendance.length === 0 && (
            <p style={{ color: MUTED, fontSize: 11, marginTop: 10, fontStyle: 'italic' }}>
              No attendance records yet — check in at class to start tracking.
            </p>
          )}
        </div>

        {/* ── Belt progress ──────────────────────────────────── */}
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 24,
            border: '1px solid #e6e2d8',
          }}
        >
          <h3
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 16px 0',
            }}
          >
            {t.beltTitle}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 16, color: DARK }}>
              {belt}
            </span>
            <span style={{ color: MUTED, fontSize: 13 }}>
              {stripes} / 4 stripe{stripes !== 1 ? 's' : ''}
            </span>
          </div>
          {/* Belt colour swatch */}
          <div
            style={{
              background: '#f4f1ea',
              borderRadius: 999,
              height: 12,
              overflow: 'hidden',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: `${beltPct}%`,
                height: '100%',
                background: getBeltColor(belt),
                borderRadius: 999,
                transition: 'width 0.6s ease',
                minWidth: beltPct > 0 ? 12 : 0,
              }}
            />
          </div>
          {/* Stripe dots */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: i <= stripes ? GOLD : '#e6e2d8',
                  border: `2px solid ${i <= stripes ? GOLD : '#d4d0c8'}`,
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
          <p style={{ color: MUTED, fontSize: 11, marginTop: 4, fontStyle: 'italic' }}>
            Belt promotions are awarded by Chief Keith based on technical skill and mat time.
          </p>
        </div>

        {/* ── Payment history ────────────────────────────────── */}
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 24,
            border: '1px solid #e6e2d8',
          }}
        >
          <h3
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 16px 0',
            }}
          >
            {t.history}
          </h3>
          {recentPayments.length === 0 ? (
            <p style={{ color: MUTED, fontSize: 13 }}>No payment history yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {[t.hDate, t.hAmount, t.hMethod, t.hStatus].map((h) => (
                    <th
                      key={h}
                      style={{
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 700,
                        fontSize: 10,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: MUTED,
                        textAlign: 'left',
                        padding: '0 0 10px 0',
                        borderBottom: '1px solid #f4f1ea',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((row) => {
                  const paidColors = row.status === 'paid'
                    ? { bg: '#dcfce7', color: '#166534' }
                    : row.status === 'pending'
                    ? { bg: '#fef3c7', color: '#92400e' }
                    : { bg: '#fee2e2', color: '#991b1b' }
                  return (
                    <tr key={row.id}>
                      <td style={{ padding: '9px 0', borderBottom: '1px solid #f4f1ea', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: DARK }}>
                        {formatDate(row.paid_date)}
                      </td>
                      <td style={{ padding: '9px 0', borderBottom: '1px solid #f4f1ea', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: DARK }}>
                        {row.amount.toLocaleString()} TZS
                      </td>
                      <td style={{ padding: '9px 0', borderBottom: '1px solid #f4f1ea', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: DARK }}>
                        {row.method ?? '—'}
                      </td>
                      <td style={{ padding: '9px 0', borderBottom: '1px solid #f4f1ea' }}>
                        <span
                          style={{
                            background: paidColors.bg,
                            color: paidColors.color,
                            fontFamily: 'Archivo, sans-serif',
                            fontWeight: 600,
                            fontSize: 10,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            padding: '2px 7px',
                            borderRadius: 3,
                          }}
                        >
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

        {/* ── Upcoming classes (static schedule) ───────────────── */}
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 24,
            border: '1px solid #e6e2d8',
          }}
        >
          <h3
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 16px 0',
            }}
          >
            {t.upcoming}
          </h3>
          {[
            { day: 'Monday',    time: '18:00', what: 'Fundamentals — No-Gi' },
            { day: 'Wednesday', time: '18:00', what: 'BJJ / Gi' },
            { day: 'Friday',    time: '18:00', what: 'Open Mat' },
            { day: 'Saturday',  time: '09:00', what: 'Kids BJJ' },
          ].map((cls, i, arr) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < arr.length - 1 ? '1px solid #f4f1ea' : 'none',
              }}
            >
              <div
                style={{
                  background: '#e3f4fb',
                  border: '1px solid #a5dcf3',
                  borderRadius: 4,
                  padding: '8px 12px',
                  textAlign: 'center',
                  flexShrink: 0,
                  minWidth: 52,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#1d4d6b',
                  }}
                >
                  {cls.time}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 600,
                    fontSize: 13,
                    color: DARK,
                  }}
                >
                  {cls.what}
                </div>
                <div style={{ color: MUTED, fontSize: 12 }}>{cls.day}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Profile edit (full width) ─────────────────────── */}
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 24,
            border: '1px solid #e6e2d8',
            gridColumn: '1 / -1',
          }}
        >
          <h3
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 20px 0',
            }}
          >
            {t.profile}
          </h3>
          <form onSubmit={handleSave}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <label style={labelStyle}>{t.fName}</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t.fPhone}</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+255 000 000 000"
                  style={inputStyle}
                />
              </div>
            </div>
            {saveErr && (
              <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12, fontFamily: 'Archivo, sans-serif' }}>
                {saveErr}
              </p>
            )}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                type="submit"
                disabled={saveBusy}
                style={{
                  background: saveBusy ? '#8d897e' : DARK,
                  border: 'none',
                  cursor: saveBusy ? 'not-allowed' : 'pointer',
                  color: '#fff',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '11px 22px',
                  borderRadius: 4,
                  transition: 'background 0.15s',
                }}
              >
                {saveBusy ? 'Saving…' : t.saveChanges}
              </button>
              {profileSaved && (
                <span style={{ color: '#16a34a', fontSize: 13, fontFamily: 'Archivo, sans-serif' }}>
                  {t.profileSaved}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
