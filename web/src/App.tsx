import { useState, useEffect } from 'react'
import { useAuth } from './lib/auth'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import MemberPortal from './pages/MemberPortal'
import AboutBJJ from './pages/AboutBJJ'
import Learn from './pages/Learn'
import Coach from './pages/Coach'
import Contact from './pages/Contact'
import AdminDashboard from './pages/admin/AdminDashboard'
import logoCircle from './assets/logo-circle.png'

export type Lang = 'en' | 'sw'
export type Page = 'home' | 'login' | 'member' | 'about' | 'learn' | 'coach' | 'contact' | 'admin' | 'auth-callback'

const VALID_PAGES: Page[] = ['home', 'login', 'member', 'about', 'learn', 'coach', 'contact', 'admin', 'auth-callback']

export default function App() {
  const { user, profile, loading } = useAuth()
  const [page, setPageRaw] = useState<Page>(() => {
    // Handle hash-based routing on initial load
    const hash = window.location.hash.replace('#', '')
    if (hash === 'auth-callback') return 'auth-callback'
    if (hash === 'admin') return 'admin'
    if (hash === 'member') return 'member'
    if (hash === 'coach') return 'coach'
    return 'home'
  })
  const [lang, setLang] = useState<Lang>('en')

  const setPage = (p: string) => {
    if (VALID_PAGES.includes(p as Page)) setPageRaw(p as Page)
  }

  // After auth resolves: redirect to the appropriate portal
  useEffect(() => {
    if (!loading && user && profile) {
      if (page === 'login' || page === 'auth-callback') {
        const role = profile.role
        if (role === 'admin') setPageRaw('admin')
        else if (role === 'coach') setPageRaw('coach')
        else setPageRaw('member')
      }
    }
  }, [loading, user, profile])

  // Keep hash in sync for OAuth callback deep-link support
  useEffect(() => {
    if (page !== 'home') {
      window.location.hash = page
    } else {
      history.replaceState(null, '', window.location.pathname)
    }
  }, [page])

  const DARK = '#1d1c18'

  // Full-screen loading spinner while Supabase session resolves
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: DARK,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <img
          src={logoCircle}
          alt="Zanzibar BJJ"
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            objectFit: 'cover',
            animation: 'zbj-pulse 1.4s ease-in-out infinite',
          }}
        />
        <p
          style={{
            color: '#8d897e',
            fontFamily: 'Archivo, sans-serif',
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Loading…
        </p>
        <style>{`
          @keyframes zbj-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.9); }
          }
        `}</style>
      </div>
    )
  }

  // Admin gets their own full-screen dashboard (no shared header/footer)
  if (page === 'admin' || (user && profile?.role === 'admin' && (page === 'member' || page === 'coach'))) {
    return <AdminDashboard lang={lang} setPage={setPage} />
  }

  const props = { lang, setPage }
  const isLoggedIn = !!user
  const userRole = profile?.role ?? null

  return (
    <>
      <Header
        lang={lang}
        setLang={setLang}
        setPage={setPage}
        page={page}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
      />
      {page === 'home'          && <Home    {...props} />}
      {page === 'login'         && <SignIn  {...props} />}
      {page === 'member'        && <MemberPortal {...props} />}
      {page === 'about'         && <AboutBJJ {...props} />}
      {page === 'learn'         && <Learn   {...props} />}
      {page === 'coach'         && <Coach   {...props} />}
      {page === 'contact'       && <Contact {...props} />}
      {page === 'auth-callback' && (
        <div
          style={{
            minHeight: 'calc(100vh - 64px)',
            background: DARK,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ color: '#8d897e', fontFamily: 'Archivo, sans-serif', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Completing sign-in…
          </p>
        </div>
      )}
      <Footer lang={lang} setPage={setPage} />
    </>
  )
}
