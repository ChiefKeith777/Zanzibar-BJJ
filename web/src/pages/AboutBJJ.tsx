import { dict, type Lang } from '../../../shared/content/translations'
import { ABOUT_PARAS, BENEFITS } from '../../../shared/content/data'
import bjj1 from '../assets/bjj-1.jpg'
import bjj2 from '../assets/bjj-2.jpg'
import bjj3 from '../assets/bjj-3.jpg'

interface AboutBJJProps {
  lang: Lang
  setPage: (p: string) => void
}

export default function AboutBJJ({ lang, setPage }: AboutBJJProps) {
  const t = dict[lang]

  const DARK  = '#1d1c18'
  const GOLD  = '#FCD116'
  const BLU   = '#00A3DD'
  const MUTED = '#8d897e'

  return (
    <main>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          height: 360,
          backgroundImage: `url(${bjj1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(29,28,24,0.92) 40%, rgba(29,28,24,0.4) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '0 60px 48px',
          }}
        >
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
            {t.aboutKick}
          </p>
          <h1
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1.0,
              margin: '0 0 16px 0',
              maxWidth: 620,
            }}
          >
            {t.aboutTitle}
          </h1>
          <p style={{ color: '#cfccc3', fontSize: 17, lineHeight: 1.6, maxWidth: 540 }}>
            {t.aboutLede}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding: '72px 60px', background: '#f4f1ea' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: 60,
            alignItems: 'start',
          }}
        >
          {/* Left — text */}
          <div>
            {ABOUT_PARAS.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: '#22211d',
                  margin: '0 0 20px 0',
                }}
              >
                {para}
              </p>
            ))}

            {/* Why people train */}
            <h2
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 900,
                fontSize: 28,
                color: DARK,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                margin: '36px 0 20px 0',
              }}
            >
              {t.whyTitle}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 40,
              }}
            >
              {BENEFITS.map((b) => (
                <div
                  key={b.h}
                  style={{
                    background: '#fff',
                    border: '1px solid #e6e2d8',
                    borderRadius: 6,
                    padding: 18,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 14,
                      color: DARK,
                      marginBottom: 6,
                    }}
                  >
                    {b.h}
                  </div>
                  <div style={{ color: MUTED, fontSize: 13, lineHeight: 1.5 }}>{b.b}</div>
                </div>
              ))}
            </div>

            {/* Safety card */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e6e2d8',
                borderRadius: 8,
                padding: 24,
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 17,
                  color: DARK,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  margin: '0 0 10px 0',
                }}
              >
                {t.safeTitle}
              </h3>
              <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                {t.safeBody}
              </p>
              {[t.safe1, t.safe2, t.safe3].map((s) => (
                <div key={s} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ color: '#16a34a', fontSize: 15, marginTop: 1 }}>✓</span>
                  <span style={{ color: '#22211d', fontSize: 14, lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>

            {/* Federation card */}
            <div
              style={{
                background: DARK,
                borderRadius: 8,
                padding: 24,
                marginBottom: 36,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 17,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  margin: '0 0 10px 0',
                }}
              >
                {t.federationTitle}
              </h3>
              <p style={{ color: '#cfccc3', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                {t.federationBody}
              </p>
              <a
                href="https://www.tanzaniasportsalliance.or.tz"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: GOLD,
                  border: 'none',
                  cursor: 'pointer',
                  color: DARK,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '10px 18px',
                  borderRadius: 4,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                {t.federationBtn} ↗
              </a>
            </div>

            {/* CTA */}
            <div
              style={{
                background: BLU,
                borderRadius: 8,
                padding: 28,
              }}
            >
              <p style={{ color: '#fff', fontSize: 16, lineHeight: 1.6, margin: '0 0 20px 0' }}>
                {t.aboutCta}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setPage('contact')}
                  style={{
                    background: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    color: DARK,
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '12px 22px',
                    borderRadius: 4,
                  }}
                >
                  {t.ctaFree}
                </button>
                <button
                  onClick={() => setPage('home')}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    color: '#fff',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '12px 22px',
                    borderRadius: 4,
                  }}
                >
                  {t.whatIsLink}
                </button>
              </div>
            </div>
          </div>

          {/* Right — images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 }}>
            <img
              src={bjj3}
              alt="BJJ training"
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
            <img
              src={bjj2}
              alt="BJJ technique"
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
