import React, { useState } from 'react' // React needed for FormEvent
import { dict, type Lang } from '../../../shared/content/translations'
import hero1 from '../assets/hero-1.jpg'
import logoCircle from '../assets/logo-circle.png'

interface SignInProps {
  lang: Lang
  setPage: (p: string) => void
}

const DEMO_EMAIL = 'amina@example.com'
const DEMO_PASS  = 'OSS2026'

export default function SignIn({ lang, setPage }: SignInProps) {
  const t = dict[lang]
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr]         = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASS) {
      setPage('member')
    } else {
      setErr(true)
    }
  }

  const DARK  = '#1d1c18'
  const GOLD  = '#FCD116'
  const BLU   = '#00A3DD'
  const MUTED = '#8d897e'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* Left — hero image panel */}
      <div
        style={{
          position: 'relative',
          backgroundImage: `url(${hero1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 48,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(29,28,24,0.92) 40%, rgba(29,28,24,0.5) 100%)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <img
              src={logoCircle}
              alt="Zanzibar BJJ"
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Zanzibar BJJ
              </div>
              <div
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 400,
                  fontSize: 10,
                  color: MUTED,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                Roan Jucao Association
              </div>
            </div>
          </div>
          <p
            style={{
              color: GOLD,
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {t.loginKick}
          </p>
          <h1
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 52,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
              margin: '0 0 16px 0',
            }}
          >
            {t.loginHeroA}
            <br />
            <span style={{ color: BLU }}>{t.loginHeroB}</span>
          </h1>
          <p style={{ color: '#cfccc3', fontSize: 15, lineHeight: 1.6, maxWidth: 340 }}>
            {t.loginHeroSub}
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div
        style={{
          background: '#f4f1ea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 28,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 32px 0',
            }}
          >
            {t.signIn}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {err && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  borderRadius: 4,
                  padding: '10px 14px',
                  color: '#dc2626',
                  fontFamily: 'Archivo, sans-serif',
                  fontSize: 13,
                }}
              >
                {t.loginErr}
              </div>
            )}
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: DARK,
                  marginBottom: 6,
                }}
              >
                {t.emailOrPhone}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErr(false) }}
                placeholder={DEMO_EMAIL}
                style={{
                  width: '100%',
                  background: '#fff',
                  border: '1px solid #e6e2d8',
                  borderRadius: 4,
                  padding: '12px 14px',
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
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: DARK,
                  marginBottom: 6,
                }}
              >
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErr(false) }}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: '#fff',
                  border: '1px solid #e6e2d8',
                  borderRadius: 4,
                  padding: '12px 14px',
                  fontFamily: 'Archivo, sans-serif',
                  fontSize: 14,
                  color: DARK,
                  outline: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: DARK,
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '14px 0',
                borderRadius: 4,
                marginTop: 4,
              }}
            >
              {t.signIn}
            </button>
          </form>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => {}}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: BLU,
                fontFamily: 'Archivo, sans-serif',
                fontSize: 13,
                textAlign: 'left',
                padding: 0,
              }}
            >
              {t.forgot}
            </button>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ color: MUTED, fontSize: 13 }}>{t.noAccount}</span>
              <button
                onClick={() => setPage('contact')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: DARK,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                {t.ctaFree}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 40, borderTop: '1px solid #e6e2d8', paddingTop: 20 }}>
            <button
              onClick={() => setPage('coach')}
              style={{
                background: 'none',
                border: '1px solid #e6e2d8',
                cursor: 'pointer',
                color: MUTED,
                fontFamily: 'Archivo, sans-serif',
                fontSize: 12,
                padding: '8px 16px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {t.staffAccess}
            </button>
          </div>

          {/* Hint for demo */}
          <div
            style={{
              marginTop: 20,
              background: '#fff',
              border: '1px dashed #e6e2d8',
              borderRadius: 4,
              padding: '10px 14px',
              color: MUTED,
              fontSize: 11,
            }}
          >
            Demo: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASS}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
