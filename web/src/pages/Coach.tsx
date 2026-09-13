import { useState } from 'react'
import { dict, type Lang } from '../../../shared/content/translations'
import { CURRICULUM_WEEKS } from '../../../shared/content/data'
import bjj3 from '../assets/bjj-3.jpg'

interface CoachProps {
  lang: Lang
  setPage?: (p: string) => void
}

const COACH_PASSWORD = 'roanbjj'

type CurrTab = 'fund' | 'kids' | 'comp'

const TAB_LABELS: Record<CurrTab, string> = {
  fund: 'Fundamentals',
  kids: 'Kids',
  comp: 'Competition',
}

export default function Coach({ lang }: CoachProps) {
  const t = dict[lang]
  const [input, setInput]     = useState('')
  const [err, setErr]         = useState(false)
  const [authed, setAuthed]   = useState(false)
  const [tab, setTab]         = useState<CurrTab>('fund')
  const [openWeek, setOpenWeek] = useState<number | null>(null)

  const DARK  = '#1d1c18'
  const GOLD  = '#FCD116'
  const MUTED = '#8d897e'
  const MID   = '#26251f'

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === COACH_PASSWORD) {
      setAuthed(true)
      setErr(false)
    } else {
      setErr(true)
    }
  }

  // ── Password gate ────────────────────────────────────────────────
  if (!authed) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bjj3})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(29,28,24,0.88)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            background: MID,
            border: '1px solid #3a382f',
            borderRadius: 10,
            padding: '40px 48px',
            width: '100%',
            maxWidth: 420,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#3a382f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 24,
            }}
          >
            🔒
          </div>
          <h1
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 24,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 8px 0',
            }}
          >
            {t.coachTitle}
          </h1>
          <p style={{ color: MUTED, fontSize: 14, marginBottom: 28 }}>{t.coachSub}</p>
          <form onSubmit={handleEnter} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {err && (
              <p
                style={{
                  color: '#ef4444',
                  fontSize: 13,
                  fontFamily: 'Archivo, sans-serif',
                  margin: 0,
                }}
              >
                {t.pwErr}
              </p>
            )}
            <input
              type="password"
              placeholder={t.pwLabel}
              value={input}
              onChange={(e) => { setInput(e.target.value); setErr(false) }}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${err ? '#ef4444' : '#3a382f'}`,
                borderRadius: 4,
                padding: '12px 14px',
                color: '#fff',
                fontFamily: 'Archivo, sans-serif',
                fontSize: 15,
                outline: 'none',
                textAlign: 'center',
                letterSpacing: '0.1em',
              }}
            />
            <button
              type="submit"
              style={{
                background: GOLD,
                border: 'none',
                cursor: 'pointer',
                color: DARK,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '13px 0',
                borderRadius: 4,
              }}
            >
              {t.enter}
            </button>
          </form>
          <p style={{ color: '#55524a', fontSize: 11, marginTop: 16 }}>
            Hint: roanbjj
          </p>
        </div>
      </div>
    )
  }

  // ── Curriculum view ──────────────────────────────────────────────
  const weeks = CURRICULUM_WEEKS[tab]

  return (
    <main style={{ background: '#f4f1ea', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ background: DARK, padding: '40px 60px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p
              style={{
                color: GOLD,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              {t.coachKick}
            </p>
            <h1
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 900,
                fontSize: 36,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              {t.currTitle}
            </h1>
          </div>
          <button
            onClick={() => setAuthed(false)}
            style={{
              background: 'transparent',
              border: '1px solid #3a382f',
              cursor: 'pointer',
              color: MUTED,
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              borderRadius: 4,
            }}
          >
            {t.logout}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e6e2d8',
          padding: '0 60px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 0 }}>
          {(Object.keys(TAB_LABELS) as CurrTab[]).map((k) => (
            <button
              key={k}
              onClick={() => { setTab(k); setOpenWeek(null) }}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: tab === k ? `3px solid ${GOLD}` : '3px solid transparent',
                cursor: 'pointer',
                color: tab === k ? DARK : MUTED,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '16px 24px',
              }}
            >
              {TAB_LABELS[k]}
            </button>
          ))}
        </div>
      </div>

      {/* Week accordion */}
      <div style={{ padding: '40px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weeks.map((week) => (
            <div
              key={week.wk}
              style={{
                background: '#fff',
                border: '1px solid #e6e2d8',
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpenWeek(openWeek === week.wk ? null : week.wk)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '18px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    background: GOLD,
                    color: DARK,
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                >
                  {t.week} {week.wk}
                </span>
                <span
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 15,
                    color: DARK,
                    flex: 1,
                  }}
                >
                  {week.theme}
                </span>
                <span
                  style={{
                    color: MUTED,
                    fontSize: 18,
                    transform: openWeek === week.wk ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s',
                  }}
                >
                  ▾
                </span>
              </button>
              {openWeek === week.wk && (
                <div
                  style={{
                    padding: '0 20px 20px 20px',
                    borderTop: '1px solid #f4f1ea',
                  }}
                >
                  <ul style={{ margin: '16px 0 0 0', padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {week.pts.map((pt, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: 'Archivo, sans-serif',
                          fontSize: 14,
                          color: '#22211d',
                          lineHeight: 1.6,
                        }}
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 16 }}>
                    <button
                      style={{
                        background: 'none',
                        border: '1px dashed #e6e2d8',
                        cursor: 'pointer',
                        color: MUTED,
                        fontFamily: 'Archivo, sans-serif',
                        fontSize: 12,
                        padding: '7px 14px',
                        borderRadius: 4,
                      }}
                    >
                      + {t.addVideo}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
