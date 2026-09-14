import { useState } from 'react'
import { useAuth, useRole } from '../../lib/auth'
import logo from '../../assets/logo-circle.png'
import Overview from './tabs/Overview'
import Members from './tabs/Members'
import Accounting from './tabs/Accounting'
import Curriculum from './tabs/Curriculum'
import Content from './tabs/Content'
import Alerts from './tabs/Alerts'

const BRAND = {
  bg:     '#f4f1ea',
  dark:   '#1d1c18',
  mid:    '#26251f',
  border: '#3a382f',
  blue:   '#00A3DD',
  gold:   '#FCD116',
  text:   '#f0ede4',
  muted:  '#9c9a8e',
}

type Tab = 'overview' | 'members' | 'accounting' | 'curriculum' | 'content' | 'alerts'

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview',    label: 'Overview'   },
  { key: 'members',     label: 'Members'    },
  { key: 'accounting',  label: 'Accounting' },
  { key: 'curriculum',  label: 'Curriculum' },
  { key: 'content',     label: 'Content'    },
  { key: 'alerts',      label: 'Alerts'     },
]

const LOCATION_OPTIONS = [
  { value: 'all',        label: 'All Locations' },
  { value: 'Stone Town', label: 'Stone Town'    },
  { value: 'Kiwengwa',   label: 'Kiwengwa'      },
  { value: 'Jambiani',   label: 'Jambiani'      },
  { value: 'Fumba Town', label: 'Fumba Town'    },
]

interface Props {
  setPage: (p: string) => void
  lang?: string
}

export default function AdminDashboard({ setPage }: Props) {
  const { signIn, signInWithGoogle, signOut, loading } = useAuth()
  const role = useRole()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError]   = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [location,  setLocation]  = useState('all')

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)
    const { error } = await signIn(email, password)
    setAuthLoading(false)
    if (error) setAuthError(error)
  }

  async function handleGoogleSignIn() {
    setAuthError(null)
    await signInWithGoogle()
  }

  // Resolving session
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: BRAND.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 15, color: BRAND.muted }}>Loading…</div>
      </div>
    )
  }

  // ── Login gate ─────────────────────────────────────────────────────────────
  if (role !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh', background: BRAND.dark,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <div style={{
          background: BRAND.mid, borderRadius: 16, padding: '44px 40px',
          width: '100%', maxWidth: 420,
          boxShadow: '0 8px 48px rgba(0,0,0,.6)',
          border: `1.5px solid ${BRAND.border}`,
        }}>
          {/* Logo + title */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img src={logo} alt="Zanzibar BJJ" style={{ width: 72, height: 72, marginBottom: 16 }} />
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 22, letterSpacing: '.1em', textTransform: 'uppercase', color: BRAND.text }}>
              Zanzibar BJJ
            </div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 12, letterSpacing: '.22em', textTransform: 'uppercase', color: BRAND.gold, marginTop: 4 }}>
              Admin Dashboard
            </div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted, marginTop: 8 }}>
              Staff access only
            </div>
          </div>

          {/* Error */}
          {authError && (
            <div style={{ background: '#fce8e6', border: '1.5px solid #e57373', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontFamily: 'Archivo, sans-serif', fontSize: 13, color: '#c0392b' }}>
              {authError}
            </div>
          )}

          {/* Email/password form */}
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: BRAND.muted, display: 'block', marginBottom: 5 }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: `1.5px solid ${BRAND.border}`, background: BRAND.dark, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: BRAND.muted, display: 'block', marginBottom: 5 }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 8, border: `1.5px solid ${BRAND.border}`, background: BRAND.dark, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              style={{
                width: '100%', padding: '13px', borderRadius: 9,
                background: BRAND.blue, color: '#fff', border: 'none',
                fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 15,
                cursor: authLoading ? 'not-allowed' : 'pointer',
                opacity: authLoading ? .6 : 1, marginBottom: 12, letterSpacing: '.02em',
              }}
            >
              {authLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            style={{
              width: '100%', padding: '12px', borderRadius: 9,
              background: '#fff', color: '#1a1a1a',
              border: '1.5px solid #d0cfc9',
              fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              letterSpacing: '.01em', marginBottom: 24,
            }}
          >
            <span style={{ fontWeight: 900, fontSize: 18, fontFamily: 'Arial, sans-serif', color: '#4285F4' }}>G</span>
            Continue with Google
          </button>

          {/* Back link */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setPage('home')}
              style={{ background: 'none', border: 'none', color: BRAND.muted, fontFamily: 'Archivo, sans-serif', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
            >
              ← Back to main site
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Admin shell ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: BRAND.bg, fontFamily: 'Archivo, sans-serif' }}>

      {/* Sticky header bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 62, background: BRAND.dark,
        borderBottom: `1.5px solid ${BRAND.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 0,
      }}>
        {/* Logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24, flexShrink: 0 }}>
          <img src={logo} alt="Zanzibar BJJ" style={{ width: 34, height: 34 }} />
          <div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: BRAND.text, lineHeight: 1.15 }}>
              Zanzibar BJJ
            </div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: BRAND.gold, lineHeight: 1 }}>
              Admin
            </div>
          </div>
        </div>

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: 2, flex: 1, minWidth: 0 }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontFamily: 'Archivo, sans-serif', fontSize: 12,
                fontWeight: activeTab === tab.key ? 700 : 500,
                letterSpacing: '.02em',
                background: activeTab === tab.key ? BRAND.mid : 'transparent',
                color: activeTab === tab.key ? BRAND.text : BRAND.muted,
                borderBottom: activeTab === tab.key ? `2px solid ${BRAND.gold}` : '2px solid transparent',
                transition: 'all .15s', whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Location filter */}
        <select
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={{
            marginRight: 14, padding: '6px 10px', borderRadius: 6,
            border: `1.5px solid ${BRAND.border}`,
            background: BRAND.mid, color: BRAND.text,
            fontFamily: 'Archivo, sans-serif', fontSize: 12,
            cursor: 'pointer', outline: 'none', flexShrink: 0,
          }}
        >
          {LOCATION_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* View site */}
        <button
          onClick={() => setPage('home')}
          style={{ background: 'none', border: 'none', color: BRAND.muted, fontFamily: 'Archivo, sans-serif', fontSize: 12, cursor: 'pointer', marginRight: 12, flexShrink: 0, padding: '4px 0', whiteSpace: 'nowrap' }}
        >
          ← View site
        </button>

        {/* Log out */}
        <button
          onClick={signOut}
          style={{
            padding: '6px 14px', borderRadius: 6,
            border: `1.5px solid ${BRAND.border}`,
            background: 'transparent', color: BRAND.muted,
            fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 12,
            cursor: 'pointer', flexShrink: 0, transition: 'border-color .15s, color .15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c0392b'; (e.currentTarget as HTMLButtonElement).style.color = '#c0392b' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BRAND.border; (e.currentTarget as HTMLButtonElement).style.color = BRAND.muted }}
        >
          Log out
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'overview'    && <Overview    location={location} setPage={setPage} />}
      {activeTab === 'members'     && <Members     location={location} />}
      {activeTab === 'accounting'  && <Accounting  location={location} />}
      {activeTab === 'curriculum'  && <Curriculum />}
      {activeTab === 'content'     && <Content />}
      {activeTab === 'alerts'      && <Alerts />}
    </div>
  )
}
