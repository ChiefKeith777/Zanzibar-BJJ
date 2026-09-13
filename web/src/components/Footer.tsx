// Footer component
import { dict, type Lang } from '../../../shared/content/translations'
import { WA_HREF, VENUES } from '../../../shared/content/data'
import logoCircle from '../assets/logo-circle.png'

interface FooterProps {
  lang: Lang
  setPage: (p: string) => void
}

export default function Footer({ lang, setPage }: FooterProps) {
  const t = dict[lang]

  const DARK  = '#1d1c18'
  const GOLD  = '#FCD116'
  const MUTED = '#8d897e'
  const LIGHT = '#cfccc3'

  return (
    <>
      <footer
        style={{
          background: DARK,
          borderTop: '1px solid #3a382f',
          padding: '56px 60px 0',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
              gap: 48,
              paddingBottom: 48,
              borderBottom: '1px solid #3a382f',
            }}
          >
            {/* Brand column */}
            <div>
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
                  marginBottom: 16,
                }}
              >
                <img
                  src={logoCircle}
                  alt="Zanzibar BJJ"
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
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
                      fontSize: 9,
                      color: MUTED,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                    }}
                  >
                    Roan Jucao Association
                  </div>
                </div>
              </button>
              <p
                style={{
                  color: MUTED,
                  fontSize: 13,
                  lineHeight: 1.7,
                  maxWidth: 280,
                  marginBottom: 16,
                }}
              >
                World-class Brazilian Jiu Jitsu for locals, visitors and kids across four locations in Zanzibar, Tanzania.
              </p>
              <p style={{ color: '#55524a', fontSize: 11, marginBottom: 16 }}>{t.lineage}</p>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#25D366',
                  color: '#fff',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '9px 16px',
                  borderRadius: 4,
                  textDecoration: 'none',
                }}
              >
                <span>💬</span>
                <span>{t.ctaWa}</span>
              </a>
            </div>

            {/* Contact column */}
            <div>
              <h4
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: LIGHT,
                  margin: '0 0 18px 0',
                }}
              >
                {t.footContact}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: MUTED,
                    fontSize: 13,
                    textDecoration: 'none',
                    fontFamily: 'Archivo, sans-serif',
                    lineHeight: 1.5,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                >
                  +255 628 031 317
                </a>
                <a
                  href="mailto:info@zanzibarbjj.com"
                  style={{
                    color: MUTED,
                    fontSize: 13,
                    textDecoration: 'none',
                    fontFamily: 'Archivo, sans-serif',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                >
                  info@zanzibarbjj.com
                </a>
                <span style={{ color: MUTED, fontSize: 13, fontFamily: 'Archivo, sans-serif' }}>
                  Zanzibar, Tanzania
                </span>
              </div>
            </div>

            {/* Locations column */}
            <div>
              <h4
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: LIGHT,
                  margin: '0 0 18px 0',
                }}
              >
                {t.footLocations}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {VENUES.map((v) => (
                  <a
                    key={v.id}
                    href={v.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: MUTED,
                      fontSize: 13,
                      textDecoration: 'none',
                      fontFamily: 'Archivo, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                  >
                    {v.name}
                    {v.isNew && (
                      <span
                        style={{
                          background: GOLD,
                          color: '#1d1c18',
                          fontFamily: 'Archivo, sans-serif',
                          fontWeight: 700,
                          fontSize: 9,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '1px 5px',
                          borderRadius: 2,
                        }}
                      >
                        New
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Club / Trust column */}
            <div>
              <h4
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: LIGHT,
                  margin: '0 0 18px 0',
                }}
              >
                {t.footTrust}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: t.privacy, href: '#' },
                  { label: t.terms, href: '#' },
                  { label: t.safeguarding, href: '#' },
                  { label: t.coachLogin, page: 'coach' },
                  { label: t.adminLogin, href: '#' },
                ].map((item) => (
                  item.page ? (
                    <button
                      key={item.label}
                      onClick={() => setPage(item.page!)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: MUTED,
                        fontFamily: 'Archivo, sans-serif',
                        fontSize: 13,
                        textAlign: 'left',
                        padding: 0,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      style={{
                        color: MUTED,
                        fontSize: 13,
                        textDecoration: 'none',
                        fontFamily: 'Archivo, sans-serif',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                    >
                      {item.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 0',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <p
              style={{
                color: '#55524a',
                fontSize: 12,
                fontFamily: 'Archivo, sans-serif',
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} Zanzibar BJJ · Roan Jucao Association
            </p>
            <p
              style={{
                color: MUTED,
                fontSize: 12,
                fontFamily: 'Archivo, sans-serif',
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              {t.footTag}
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp sticky bubble */}
      <a
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 22,
          right: 22,
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          zIndex: 999,
          textDecoration: 'none',
          fontSize: 26,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'
        }}
        title="WhatsApp us"
      >
        💬
      </a>
    </>
  )
}
