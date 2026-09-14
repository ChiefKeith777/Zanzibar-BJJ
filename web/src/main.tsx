import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider, useAuth } from './lib/auth'
import { supabase } from './lib/supabase'
import App from './App'
import './index.css'
import logoCircle from './assets/logo-circle.png'

// Handles Supabase OAuth redirect at /auth/callback
function AuthCallback() {
  const { profile } = useAuth()
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')

  useEffect(() => {
    async function handleCallback() {
      try {
        // Exchange code/hash for session — Supabase JS v2 does this automatically
        // on getSession(), but we call it explicitly to be sure
        const { error } = await supabase.auth.getSession()
        if (error) throw error
        setStatus('done')
      } catch {
        setStatus('error')
      }
    }
    handleCallback()
  }, [])

  useEffect(() => {
    if (status === 'done') {
      // Once auth state is resolved, redirect based on role
      const role = profile?.role
      if (role === 'admin') {
        window.location.replace('/#admin')
      } else if (role === 'coach') {
        window.location.replace('/#coach')
      } else {
        window.location.replace('/#member')
      }
    }
  }, [status, profile])

  const DARK = '#1d1c18'
  const BLU  = '#00A3DD'

  if (status === 'error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: DARK,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
          fontFamily: 'Archivo, sans-serif',
        }}
      >
        <p style={{ color: '#fca5a5', fontSize: 15 }}>
          Authentication failed. Please try again.
        </p>
        <button
          onClick={() => { window.location.replace('/') }}
          style={{
            background: BLU,
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontFamily: 'Archivo, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '10px 20px',
            borderRadius: 4,
          }}
        >
          Back to Home
        </button>
      </div>
    )
  }

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
          width: 64,
          height: 64,
          borderRadius: '50%',
          objectFit: 'cover',
          animation: 'pulse 1.4s ease-in-out infinite',
        }}
      />
      <p
        style={{
          color: '#cfccc3',
          fontFamily: 'Archivo, sans-serif',
          fontSize: 13,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Signing you in…
      </p>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.93); }
        }
      `}</style>
    </div>
  )
}

function Root() {
  // Detect /auth/callback route (hash-based SPA)
  const isCallback =
    window.location.pathname === '/auth/callback' ||
    window.location.hash === '#auth-callback'

  if (isCallback) {
    return (
      <AuthProvider>
        <AuthCallback />
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
