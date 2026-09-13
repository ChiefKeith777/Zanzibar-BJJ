// Header component
import { dict, type Lang } from '../../../shared/content/translations'
import logoCircle from '../assets/logo-circle.png'

interface HeaderProps {
  lang: Lang
  setLang: (l: Lang) => void
  setPage: (p: string) => void
  page?: string
}

const NAV_ITEMS = [
  { label: 'Programs', page: 'home' },
  { label: 'Schedule', page: 'home' },
  { label: 'Locations', page: 'home' },
  { label: 'Pricing', page: 'home' },
  { label: 'Kids', page: 'home' },
  { label: 'Learn', page: 'learn' },
  { label: 'Competitions', page: 'home' },
  { label: 'Contact', page: 'contact' },
]

export default function Header({ lang, setLang, setPage }: HeaderProps) {
  const t = dict[lang]

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#1d1c18',
        minHeight: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 20,
        borderBottom: '1px solid #3a382f',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => setPage('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <img
          src={logoCircle}
          alt="Zanzibar BJJ"
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span
            style={{
              color: '#fff',
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            Zanzibar BJJ
          </span>
          <span
            style={{
              color: '#8d897e',
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 400,
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            Roan Jucao Association
          </span>
        </div>
      </button>

      {/* Desktop Nav */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flex: 1,
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => setPage(item.page)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#cfccc3',
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '6px 10px',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cfccc3')}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Lang toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #3a382f',
            borderRadius: 999,
            padding: '2px 3px',
            gap: 2,
          }}
        >
          {(['en', 'sw'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              style={{
                background: lang === l ? '#FCD116' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: lang === l ? '#1d1c18' : '#8d897e',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: 999,
                transition: 'all 0.15s',
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sign In */}
        <button
          onClick={() => setPage('login')}
          style={{
            background: 'none',
            border: '1px solid #3a382f',
            cursor: 'pointer',
            color: '#cfccc3',
            fontFamily: 'Archivo, sans-serif',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: 4,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#00A3DD'
            e.currentTarget.style.color = '#00A3DD'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#3a382f'
            e.currentTarget.style.color = '#cfccc3'
          }}
        >
          {t.signIn}
        </button>

        {/* Free Class CTA */}
        <button
          onClick={() => setPage('contact')}
          style={{
            background: '#FCD116',
            border: 'none',
            cursor: 'pointer',
            color: '#1d1c18',
            fontFamily: 'Archivo, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#ffe04d')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#FCD116')}
        >
          {t.navFree}
        </button>
      </div>
    </header>
  )
}
