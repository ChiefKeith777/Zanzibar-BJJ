import React, { useState } from 'react' // React needed for FormEvent type
import { dict, type Lang } from '../../../shared/content/translations'
import { VENUES, WA_HREF } from '../../../shared/content/data'
import { isKidsProgram } from '../lib/utils'

interface ContactProps {
  lang: Lang
  setPage: (p: string) => void
}

export default function Contact({ lang }: ContactProps) {
  const t = dict[lang]

  const [name, setName]     = useState('')
  const [phone, setPhone]   = useState('')
  const [location, setLoc]  = useState('')
  const [program, setProg]  = useState('')
  const [kidName, setKidName] = useState('')
  const [kidAge, setKidAge]   = useState('')
  const [kidExp, setKidExp]   = useState('')
  const [news, setNews]       = useState(true)
  const [err, setErr]         = useState(false)
  const [done, setDone]       = useState(false)

  const DARK  = '#1d1c18'
  const MID   = '#26251f'
  const GOLD  = '#FCD116'
  const MUTED = '#8d897e'

  const isKids = isKidsProgram(program)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setErr(true)
      return
    }
    setErr(false)
    setDone(true)
  }

  const waMsg = encodeURIComponent(
    `Hi! I'd like to book a free class.\nName: ${name}\nPhone: ${phone}\nLocation: ${location}\nProgram: ${program}`
  )

  const benefitsData = [t.bene1, t.bene2, t.bene3]

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid #3a382f',
    borderRadius: 4,
    padding: '11px 14px',
    color: '#fff',
    fontFamily: 'Archivo, sans-serif',
    fontSize: 14,
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'Archivo, sans-serif',
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#cfccc3',
    marginBottom: 6,
  }

  return (
    <main>
      <section
        style={{
          background: DARK,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '72px 60px',
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: 64,
            alignItems: 'start',
          }}
        >
          {/* Left — info panel */}
          <div>
            <p
              style={{
                color: GOLD,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              {t.contactKick}
            </p>
            <h1
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(36px, 5vw, 52px)',
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 1.0,
                margin: '0 0 16px 0',
              }}
            >
              {t.funnelTitle}
            </h1>
            <p style={{ color: '#cfccc3', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 380 }}>
              {t.funnelSub}
            </p>

            {/* Benefits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
              {benefitsData.map((b) => (
                <div key={b} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: GOLD,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <span style={{ color: DARK, fontSize: 12, fontWeight: 700 }}>✓</span>
                  </div>
                  <span style={{ color: '#cfccc3', fontSize: 15, lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>

            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textDecoration: 'none',
                  color: '#cfccc3',
                }}
              >
                <span style={{ fontSize: 20 }}>💬</span>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 14 }}>
                  WhatsApp: +255 628 031 317
                </span>
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#cfccc3' }}>
                <span style={{ fontSize: 20 }}>📍</span>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 14 }}>
                  Stone Town, Kiwengwa, Jambiani, Fumba Town
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#cfccc3' }}>
                <span style={{ fontSize: 20 }}>✉️</span>
                <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 14 }}>
                  info@zanzibarbjj.com
                </span>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div
            style={{
              background: MID,
              border: '1px solid #3a382f',
              borderRadius: 10,
              padding: '36px 36px 32px',
            }}
          >
            {done ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h2
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 900,
                    fontSize: 24,
                    color: GOLD,
                    textTransform: 'uppercase',
                    margin: '0 0 12px 0',
                  }}
                >
                  {t.successTitle}
                </h2>
                <p style={{ color: '#cfccc3', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
                  {t.successBody}
                </p>
                <a
                  href={`${WA_HREF}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    background: '#25D366',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '15px 0',
                    borderRadius: 4,
                    textDecoration: 'none',
                    textAlign: 'center',
                    marginBottom: 14,
                  }}
                >
                  {t.confirmWa}
                </a>
                <button
                  onClick={() => { setDone(false); setName(''); setPhone(''); setLoc(''); setProg('') }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: MUTED,
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: 13,
                    textDecoration: 'underline',
                  }}
                >
                  {t.another}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 900,
                    fontSize: 20,
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    margin: '0 0 4px 0',
                  }}
                >
                  {t.ctaFree}
                </h2>

                {err && (
                  <p style={{ color: '#ef4444', fontSize: 13, margin: 0, fontFamily: 'Archivo, sans-serif' }}>
                    {t.formErr}
                  </p>
                )}

                <div>
                  <label style={labelStyle}>{t.fName}</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErr(false) }}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t.fPhone}</label>
                  <input
                    type="tel"
                    placeholder="+255 000 000 000"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErr(false) }}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{t.fLoc}</label>
                  <select
                    value={location}
                    onChange={(e) => setLoc(e.target.value)}
                    style={{
                      ...inputStyle,
                      color: location ? '#fff' : '#8d897e',
                    }}
                  >
                    <option value="" style={{ background: DARK }}>{t.fLoc}</option>
                    {VENUES.map((v) => (
                      <option key={v.id} value={v.name} style={{ background: DARK }}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>{t.fProg}</label>
                  <select
                    value={program}
                    onChange={(e) => setProg(e.target.value)}
                    style={{
                      ...inputStyle,
                      color: program ? '#fff' : '#8d897e',
                    }}
                  >
                    <option value="" style={{ background: DARK }}>{t.fProg}</option>
                    <option value={t.progAdults} style={{ background: DARK }}>{t.progAdults}</option>
                    <option value={t.progK47} style={{ background: DARK }}>{t.progK47}</option>
                    <option value={t.progK812} style={{ background: DARK }}>{t.progK812}</option>
                    <option value={t.progT1316} style={{ background: DARK }}>{t.progT1316}</option>
                  </select>
                </div>

                {/* Kids fields — conditional */}
                {isKids && (
                  <div
                    style={{
                      background: 'rgba(252, 209, 22, 0.06)',
                      border: `1px solid rgba(252,209,22,0.2)`,
                      borderRadius: 6,
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: GOLD,
                        margin: 0,
                      }}
                    >
                      {t.kidsFieldsTitle}
                    </p>
                    <div>
                      <label style={{ ...labelStyle, color: '#cfccc3' }}>{t.fKidName}</label>
                      <input
                        type="text"
                        value={kidName}
                        onChange={(e) => setKidName(e.target.value)}
                        style={inputStyle}
                        placeholder="Child's name"
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, color: '#cfccc3' }}>{t.fKidAge}</label>
                      <input
                        type="number"
                        min={4}
                        max={16}
                        value={kidAge}
                        onChange={(e) => setKidAge(e.target.value)}
                        style={inputStyle}
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, color: '#cfccc3' }}>{t.fKidExp}</label>
                      <select
                        value={kidExp}
                        onChange={(e) => setKidExp(e.target.value)}
                        style={{ ...inputStyle, color: kidExp ? '#fff' : '#8d897e' }}
                      >
                        <option value="" style={{ background: DARK }}>{t.fKidExp}</option>
                        <option value="none" style={{ background: DARK }}>{t.expNone}</option>
                        <option value="some" style={{ background: DARK }}>{t.expSome}</option>
                        <option value="lots" style={{ background: DARK }}>{t.expLots}</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* News opt-in */}
                <label
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={news}
                    onChange={(e) => setNews(e.target.checked)}
                    style={{ marginTop: 2, accentColor: GOLD, width: 16, height: 16, flexShrink: 0 }}
                  />
                  <span style={{ color: '#cfccc3', fontSize: 13, lineHeight: 1.5 }}>
                    {t.newsOptIn}
                  </span>
                </label>

                <button
                  type="submit"
                  style={{
                    background: GOLD,
                    border: 'none',
                    cursor: 'pointer',
                    color: DARK,
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '15px 0',
                    borderRadius: 4,
                    marginTop: 4,
                  }}
                >
                  {t.fSubmit}
                </button>

                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: MUTED,
                    fontSize: 13,
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontFamily: 'Archivo, sans-serif',
                    display: 'block',
                  }}
                >
                  {t.waInstead}
                </a>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
