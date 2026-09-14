import React, { useState } from 'react'
import { dict, type Lang } from '../../../shared/content/translations'
import { useAuth } from '../lib/auth'
import hero1 from '../assets/hero-1.jpg'
import logoCircle from '../assets/logo-circle.png'

interface SignInProps {
  lang: Lang
  setPage: (p: string) => void
}

type Tab = 'signin' | 'signup'

export default function SignIn({ lang, setPage }: SignInProps) {
  const t = dict[lang]
  const { signIn, signInWithGoogle, signInWithMicrosoft, signUp } = useAuth()

  const [tab, setTab]           = useState<Tab>('signin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [err, setErr]           = useState<string | null>(null)
  const [success, setSuccess]   = useState<string | null>(null)
  const [busy, setBusy]         = useState(false)

  const DARK  = '#1d1c18'
  const GOLD  = '#FCD116'
  const BLU   = '#00A3DD'
  const MUTED = '#8d897e'

  const clearMessages = () => { setErr(null); setSuccess(null) }

  // ── Sign In ──────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    setBusy(true)
    const { error } = await signIn(email.trim(), password)
    setBusy(false)
    if (error) {
      setErr(error)
    } else {
      // App.tsx useEffect will redirect based on role
      setPage('member')
    }
  }

  // ── Sign Up ──────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    if (!name.trim()) { setErr('Please enter your full name.'); return }
    setBusy(true)
    const { error } = await signUp(email.trim(), password, name.trim())
    setBusy(false)
    if (error) {
      setErr(error)
    } else {
      setSuccess('Check your email to confirm your account before signing in.')
      setTab('signin')
    }
  }

  // ── OAuth ────────────────────────────────────────────────────
  const handleGoogle = async () => {
    clearMessages()
    setBusy(true)
    await signInWithGoogle()
    // Page redirect handled by Supabase OAuth flow
  }

  const handleMicrosoft = async () => {
    clearMessages()
    setBusy(true)
    await signInWithMicrosoft()
    // Page redirect handled by Supabase OAuth flow
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#fff',
    border: '1px solid #e6e2d8',
    borderRadius: 4,
    padding: '12px 14px',
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
    fontSize: 12,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: DARK,
    marginBottom: 6,
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* ── Left — hero image panel ─────────────────────────── */}
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

      {/* ── Right — form panel ──────────────────────────────── */}
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

          {/* Tab switcher */}
          <div
            style={{
              display: 'flex',
              background: '#e6e2d8',
              borderRadius: 6,
              padding: 3,
              marginBottom: 28,
            }}
          >
            {(['signin', 'signup'] as Tab[]).map((t_) => (
              <button
                key={t_}
                onClick={() => { setTab(t_); clearMessages() }}
                style={{
                  flex: 1,
                  background: tab === t_ ? '#fff' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: tab === t_ ? DARK : MUTED,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '8px 0',
                  borderRadius: 4,
                  transition: 'all 0.15s',
                }}
              >
                {t_ === 'signin' ? t.signIn : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Error message */}
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
                marginBottom: 14,
              }}
            >
              {err}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #86efac',
                borderRadius: 4,
                padding: '10px 14px',
                color: '#166534',
                fontFamily: 'Archivo, sans-serif',
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              {success}
            </div>
          )}

          {/* ── Sign In form ── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>{t.emailOrPhone}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearMessages() }}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t.password}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearMessages() }}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                style={{
                  background: busy ? '#8d897e' : DARK,
                  border: 'none',
                  cursor: busy ? 'not-allowed' : 'pointer',
                  color: '#fff',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '14px 0',
                  borderRadius: 4,
                  marginTop: 4,
                  transition: 'background 0.15s',
                }}
              >
                {busy ? 'Signing in…' : t.signIn}
              </button>
            </form>
          )}

          {/* ── Sign Up form ── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearMessages() }}
                  placeholder="Amina Rashid"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t.emailOrPhone}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearMessages() }}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t.password}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearMessages() }}
                  placeholder="8+ characters"
                  required
                  minLength={8}
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                style={{
                  background: busy ? '#8d897e' : BLU,
                  border: 'none',
                  cursor: busy ? 'not-allowed' : 'pointer',
                  color: '#fff',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '14px 0',
                  borderRadius: 4,
                  marginTop: 4,
                  transition: 'background 0.15s',
                }}
              >
                {busy ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}

          {/* ── OAuth divider ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '20px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: '#e6e2d8' }} />
            <span style={{ color: MUTED, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Archivo, sans-serif' }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: 1, background: '#e6e2d8' }} />
          </div>

          {/* OAuth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleGoogle}
              disabled={busy}
              style={{
                background: '#fff',
                border: '1px solid #e6e2d8',
                cursor: busy ? 'not-allowed' : 'pointer',
                color: DARK,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 600,
                fontSize: 13,
                padding: '11px 0',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = BLU)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e6e2d8')}
            >
              {/* Google G icon */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.205c0-.638-.057-1.252-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleMicrosoft}
              disabled={busy}
              style={{
                background: '#fff',
                border: '1px solid #e6e2d8',
                cursor: busy ? 'not-allowed' : 'pointer',
                color: DARK,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 600,
                fontSize: 13,
                padding: '11px 0',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = BLU)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e6e2d8')}
            >
              {/* Microsoft Windows icon */}
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          {/* Forgot + no account */}
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

          {/* Staff / coach access */}
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
        </div>
      </div>
    </div>
  )
}
