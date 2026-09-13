import React, { useState } from 'react'
import { dict, type Lang } from '../../../shared/content/translations'
import { DEMO_MEMBER } from '../../../shared/content/data'
import hero4 from '../assets/hero-4.jpg'

interface MemberPortalProps {
  lang: Lang
  setPage: (p: string) => void
}

export default function MemberPortal({ lang, setPage }: MemberPortalProps) {
  const t = dict[lang]
  const m = DEMO_MEMBER

  const [profileName, setProfileName] = useState(m.name)
  const [profilePhone, setProfilePhone] = useState('+255 000 000 000')
  const [profileSaved, setProfileSaved] = useState(false)

  const DARK  = '#1d1c18'
  const GOLD  = '#FCD116'
  const BLU   = '#00A3DD'
  const MUTED = '#8d897e'

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

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
            {m.initial}
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
              {m.name}
            </h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: '#cfccc3', fontSize: 13 }}>{m.belt} · {m.stripes}</span>
              <span
                style={{
                  background: '#16a34a',
                  color: '#fff',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: 999,
                }}
              >
                Active
              </span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
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

      {/* Main content */}
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
        {/* Payment card */}
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
                {m.fee} TZS
              </p>
              <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>{m.dueLine}</p>
            </div>
            {m.daysLeft <= 3 && (
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
                {m.daysLeft} days
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <a
              href={m.payHref}
              target="_blank"
              rel="noopener noreferrer"
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

        {/* Membership details */}
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
          {m.details.map((row) => (
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
          <p style={{ color: MUTED, fontSize: 12, marginTop: 12 }}>{m.gymPerk}</p>
        </div>

        {/* Attendance chart */}
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
              {m.sessionsMonth}
            </span>
          </div>
          <p style={{ color: MUTED, fontSize: 12, marginBottom: 16 }}>
            {m.sessionsMonth} {t.thisMonth}
          </p>
          {/* Bar chart */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
            {m.weeks.map((w) => (
              <div key={w.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', position: 'relative', height: 60 }}>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      height: `${w.pct}%`,
                      background: BLU,
                      borderRadius: '2px 2px 0 0',
                      opacity: 0.8,
                    }}
                  />
                </div>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 9, color: MUTED }}>{w.label}</span>
              </div>
            ))}
          </div>
          <p style={{ color: MUTED, fontSize: 11, marginTop: 10, fontStyle: 'italic' }}>
            {m.attendanceNote}
          </p>
        </div>

        {/* Belt progress */}
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
              {m.belt}
            </span>
            <span style={{ color: MUTED, fontSize: 13 }}>{m.stripes}</span>
          </div>
          <div style={{ background: '#f4f1ea', borderRadius: 999, height: 10, overflow: 'hidden' }}>
            <div
              style={{
                width: `${m.beltPct}%`,
                height: '100%',
                background: GOLD,
                borderRadius: 999,
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <p style={{ color: MUTED, fontSize: 11, marginTop: 10, fontStyle: 'italic' }}>
            {m.beltNote}
          </p>
        </div>

        {/* Upcoming classes */}
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
          {m.upcoming.map((cls, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: i < m.upcoming.length - 1 ? '1px solid #f4f1ea' : 'none',
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
                  minWidth: 48,
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

        {/* Payment history */}
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
              {m.history.map((row, i) => (
                <tr key={i}>
                  {[row.date, `${row.amount} TZS`, row.method].map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '9px 0',
                        borderBottom: '1px solid #f4f1ea',
                        fontFamily: 'Archivo, sans-serif',
                        fontSize: 13,
                        color: DARK,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                  <td
                    style={{
                      padding: '9px 0',
                      borderBottom: '1px solid #f4f1ea',
                    }}
                  >
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#166534',
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Profile edit */}
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
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: MUTED,
                    marginBottom: 6,
                  }}
                >
                  {t.fName}
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#f9f8f5',
                    border: '1px solid #e6e2d8',
                    borderRadius: 4,
                    padding: '10px 13px',
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: 14,
                    color: DARK,
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: MUTED,
                    marginBottom: 6,
                  }}
                >
                  {t.fPhone}
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#f9f8f5',
                    border: '1px solid #e6e2d8',
                    borderRadius: 4,
                    padding: '10px 13px',
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: 14,
                    color: DARK,
                    outline: 'none',
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                type="submit"
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
                  padding: '11px 22px',
                  borderRadius: 4,
                }}
              >
                {t.saveChanges}
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
