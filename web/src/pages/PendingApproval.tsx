import { useAuth } from '../lib/auth'
import logo from '../assets/logo-circle.png'

const DARK = '#1d1c18'
const GOLD = '#FCD116'
const MID  = '#26251f'
const BOR  = '#3a382f'
const MUT  = '#8d897e'
const TXT  = '#f0ede4'

interface Props {
  setPage: (p: string) => void
}

export default function PendingApproval({ setPage }: Props) {
  const { signOut, profile } = useAuth()

  return (
    <div style={{
      minHeight: '100vh', background: DARK,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'Archivo, sans-serif',
    }}>
      <div style={{
        background: MID, borderRadius: 16, padding: '48px 40px',
        width: '100%', maxWidth: 460, textAlign: 'center',
        border: `1.5px solid ${BOR}`,
        boxShadow: '0 8px 48px rgba(0,0,0,.5)',
      }}>
        <img src={logo} alt="Zanzibar BJJ" style={{ width: 64, height: 64, marginBottom: 20 }} />

        <div style={{
          display: 'inline-block', background: GOLD, color: DARK,
          fontWeight: 700, fontSize: 10, letterSpacing: '.18em',
          textTransform: 'uppercase', padding: '4px 12px',
          borderRadius: 4, marginBottom: 20,
        }}>
          Awaiting Approval
        </div>

        <h1 style={{ color: TXT, fontSize: 22, fontWeight: 900, margin: '0 0 12px', letterSpacing: '-.01em' }}>
          Almost there{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}!
        </h1>

        <p style={{ color: MUT, fontSize: 15, lineHeight: 1.7, margin: '0 0 32px' }}>
          Your account has been created. A member of the Zanzibar BJJ team will
          review and activate your account once your first payment is confirmed.
        </p>

        <div style={{
          background: DARK, borderRadius: 10, padding: '20px 24px',
          border: `1px solid ${BOR}`, marginBottom: 32, textAlign: 'left',
        }}>
          <p style={{ color: MUT, fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            What happens next
          </p>
          {[
            'Contact us on WhatsApp to confirm your first payment',
            'Our team will activate your account within 24 hours',
            'You\'ll have full access to your member portal',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 2 ? 10 : 0 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: GOLD,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 11, fontWeight: 700, color: DARK,
              }}>
                {i + 1}
              </div>
              <span style={{ color: TXT, fontSize: 14, lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>

        <a
          href="https://wa.me/255628031317"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', width: '100%', padding: '13px',
            background: '#25D366', borderRadius: 9, border: 'none',
            color: '#fff', fontWeight: 700, fontSize: 15,
            textDecoration: 'none', marginBottom: 12, boxSizing: 'border-box',
            letterSpacing: '.02em',
          }}
        >
          💬 Message us on WhatsApp
        </a>

        <button
          onClick={() => setPage('home')}
          style={{
            width: '100%', padding: '11px', borderRadius: 9,
            border: `1.5px solid ${BOR}`, background: 'transparent',
            color: MUT, fontFamily: 'Archivo, sans-serif',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            marginBottom: 24,
          }}
        >
          Back to main site
        </button>

        <button
          onClick={signOut}
          style={{
            background: 'none', border: 'none', color: MUT,
            fontFamily: 'Archivo, sans-serif', fontSize: 13,
            cursor: 'pointer', textDecoration: 'underline',
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
