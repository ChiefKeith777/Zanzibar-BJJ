import { useState } from 'react'
import { dict, type Lang } from '../../../shared/content/translations'
import { LEARN_VIDEOS } from '../../../shared/content/data'
import progBjj from '../assets/prog-bjj.jpg'
import bjj2 from '../assets/bjj-2.jpg'
import bjj3 from '../assets/bjj-3.jpg'
import bjj4 from '../assets/bjj-4.jpg'
import progBeach from '../assets/prog-beach.jpg'
import strip1 from '../assets/strip-1.jpg'

const THUMB_MAP: Record<string, string> = {
  'prog-bjj.jpg': progBjj,
  'bjj-2.jpg': bjj2,
  'bjj-3.jpg': bjj3,
  'bjj-4.jpg': bjj4,
  'prog-beach.jpg': progBeach,
  'strip-1.jpg': strip1,
}

interface LearnProps {
  lang: Lang
  setPage?: (p: string) => void
}

const CATEGORIES = ['all', 'submissions', 'passing', 'fundamentals', 'takedowns']

export default function Learn({ lang }: LearnProps) {
  const t = dict[lang]
  const [cat, setCat] = useState('all')

  const DARK  = '#1d1c18'
  const GOLD  = '#FCD116'
  const MUTED = '#8d897e'

  const filtered = cat === 'all' ? LEARN_VIDEOS : LEARN_VIDEOS.filter((v) => v.cat === cat)

  return (
    <main style={{ background: '#f4f1ea', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div
        style={{
          background: DARK,
          padding: '56px 60px 40px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            {t.learnKick}
          </p>
          <h1
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 48,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              margin: '0 0 10px 0',
            }}
          >
            {t.learnTitle}
          </h1>
          <p style={{ color: '#8d897e', fontSize: 16, maxWidth: 520 }}>{t.learnSub}</p>
        </div>
      </div>

      {/* Filter chips */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e6e2d8',
          padding: '16px 60px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                background: cat === c ? DARK : '#fff',
                border: `1px solid ${cat === c ? DARK : '#e6e2d8'}`,
                cursor: 'pointer',
                color: cat === c ? '#fff' : DARK,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '7px 16px',
                borderRadius: 999,
              }}
            >
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Video grid */}
      <div style={{ padding: '40px 60px' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {filtered.map((vid) => (
            <div
              key={vid.id}
              style={{
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid #e6e2d8',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
                <img
                  src={THUMB_MAP[vid.thumb] || progBjj}
                  alt={vid.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.92)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ color: DARK, fontSize: 18, marginLeft: 4 }}>▶</span>
                  </div>
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.75)',
                    color: '#fff',
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '2px 6px',
                    borderRadius: 2,
                  }}
                >
                  {vid.dur}
                </span>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 14,
                    color: DARK,
                    marginBottom: 5,
                  }}
                >
                  {vid.title}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    background: '#f4f1ea',
                    color: MUTED,
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: 2,
                  }}
                >
                  {vid.cat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
