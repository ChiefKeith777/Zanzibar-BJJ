import React, { useState, useEffect } from 'react'
import { dict, type Lang } from '../../../shared/content/translations'
import {
  VENUES, PROGRAMS, SCHEDULE_ALL, MARQUEE_ITEMS, LOC_CHIPS,
  MENTORS, TEAM, LEARN_VIDEOS, WA_HREF, WA_PRIVATE_HREF,
} from '../../../shared/content/data'

import hero1 from '../assets/hero-1.jpg'
import hero2 from '../assets/hero-2.jpg'
import hero3 from '../assets/hero-3.jpg'
import hero4 from '../assets/hero-4.jpg'
import hero5 from '../assets/hero-5.jpg'
import hero6 from '../assets/hero-6.jpg'
import logoCircle from '../assets/logo-circle.png'
import locStone from '../assets/loc-stone.jpg'
import locKiwengwa from '../assets/loc-kiwengwa.jpg'
import locJambiani from '../assets/loc-jambiani.jpg'
import locFumba from '../assets/loc-fumba.jpg'
import progBjj from '../assets/prog-bjj.jpg'
import progKids from '../assets/prog-kids.jpg'
import progBeach from '../assets/prog-beach.jpg'
import progComp from '../assets/prog-comp.jpg'
import kids47 from '../assets/kids-47.jpg'
import kids812 from '../assets/kids-812.jpg'
import kids1316 from '../assets/kids-1316.jpg'
import eventBeach from '../assets/event-beach.jpg'
import strip1 from '../assets/strip-1.jpg'
import strip2 from '../assets/strip-2.jpg'
import strip3 from '../assets/strip-3.jpg'
import strip4 from '../assets/strip-4.jpg'
import bjj2 from '../assets/bjj-2.jpg'
import bjj3 from '../assets/bjj-3.jpg'
import coachAlly from '../assets/coach-ally.jpg'

const HERO_IMGS = [hero1, hero2, hero3, hero4, hero5, hero6]

const LOC_IMGS: Record<string, string> = {
  stone: locStone, kiwengwa: locKiwengwa, jambiani: locJambiani, fumba: locFumba,
}
const PROG_IMGS: Record<string, string> = {
  adults: progBjj, kids: progKids, beach: progBeach, comp: progComp,
}
const KIDS_IMGS = [kids47, kids812, kids1316]

interface HomeProps {
  lang: Lang
  setPage: (p: string) => void
}

export default function Home({ lang, setPage }: HomeProps) {
  const t = dict[lang]

  // ── Hero slideshow ──────────────────────────────────────────────
  const [heroIdx, setHeroIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMGS.length), 5200)
    return () => clearInterval(id)
  }, [])

  // ── Programs accordion ──────────────────────────────────────────
  const [openProg, setOpenProg] = useState<string | null>(null)

  // ── Schedule filter ─────────────────────────────────────────────
  const [schedFilter, setSchedFilter] = useState('All')

  const filteredSchedule = SCHEDULE_ALL.map((day) => ({
    ...day,
    classes: schedFilter === 'All'
      ? day.classes
      : day.classes.filter((c) => c.loc === schedFilter),
  }))

  // ── Instructors accordion ────────────────────────────────────────
  const [openMentor, setOpenMentor] = useState<number | null>(null)

  // ── Beach event form ─────────────────────────────────────────────
  const [beachName, setBeachName] = useState('')
  const [beachPhone, setBeachPhone] = useState('')
  const [beachDone, setBeachDone] = useState(false)

  // ── Funnel CTA form ──────────────────────────────────────────────
  const [funnelName, setFunnelName] = useState('')
  const [funnelPhone, setFunnelPhone] = useState('')
  const [funnelDone, setFunnelDone] = useState(false)
  const [funnelErr, setFunnelErr] = useState(false)

  const handleFunnelSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!funnelName.trim() || !funnelPhone.trim()) { setFunnelErr(true); return }
    setFunnelErr(false)
    setFunnelDone(true)
  }

  const BLU = '#00A3DD'
  const GOLD = '#FCD116'
  const DARK = '#1d1c18'
  const MID = '#26251f'
  const MUTED = '#8d897e'

  return (
    <main>
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: 600,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* slideshow bg */}
        {HERO_IMGS.map((img, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === heroIdx ? 1 : 0,
              transition: 'opacity 1.2s ease',
              zIndex: 0,
            }}
          />
        ))}
        {/* gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(29,28,24,0.88) 50%, rgba(29,28,24,0.3) 100%)',
            zIndex: 1,
          }}
        />

        {/* floating logo */}
        <img
          src={logoCircle}
          alt=""
          style={{
            position: 'absolute',
            right: '8%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 260,
            height: 260,
            borderRadius: '50%',
            objectFit: 'cover',
            opacity: 0.18,
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            padding: '0 60px',
            maxWidth: 720,
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
              marginBottom: 16,
              margin: '0 0 16px 0',
            }}
          >
            {t.heroKicker}
          </p>
          <h1
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(52px, 8vw, 96px)',
              lineHeight: 0.95,
              color: '#fff',
              margin: '0 0 24px 0',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            {t.heroA}
            <br />
            <span style={{ color: BLU }}>{t.heroB}</span>
          </h1>
          <p
            style={{
              color: '#cfccc3',
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 400,
              fontSize: 17,
              lineHeight: 1.6,
              maxWidth: 500,
              margin: '0 0 32px 0',
            }}
          >
            {t.heroSub}
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
            <button
              onClick={() => setPage('contact')}
              style={{
                background: GOLD,
                border: 'none',
                cursor: 'pointer',
                color: DARK,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '14px 28px',
                borderRadius: 4,
              }}
            >
              {t.ctaFree}
            </button>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                color: '#fff',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '14px 28px',
                borderRadius: 4,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              {t.ctaWa}
            </a>
          </div>

          {/* Location chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LOC_CHIPS.map((loc) => (
              <span
                key={loc}
                style={{
                  border: `1px solid ${GOLD}`,
                  color: GOLD,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 500,
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '5px 12px',
                  borderRadius: 999,
                }}
              >
                {loc}
              </span>
            ))}
          </div>
        </div>

        {/* Hero dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            zIndex: 3,
          }}
        >
          {HERO_IMGS.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              style={{
                width: i === heroIdx ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: i === heroIdx ? GOLD : 'rgba(255,255,255,0.3)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <section
        style={{
          background: GOLD,
          padding: '14px 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            animation: 'zbj-marquee 30s linear infinite',
            willChange: 'transform',
          }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: DARK,
                paddingRight: 48,
              }}
            >
              {item}
              <span style={{ paddingLeft: 48, opacity: 0.5 }}>·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════ LOCATIONS ═══════════════ */}
      <section style={{ padding: '80px 60px', background: '#f4f1ea' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p
            style={{
              color: BLU,
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {t.locKick}
          </p>
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 40,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 8px 0',
            }}
          >
            {t.locTitle}
          </h2>
          <p style={{ color: MUTED, fontSize: 15, marginBottom: 48, maxWidth: 560 }}>
            {t.locSub}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 24,
            }}
          >
            {VENUES.map((v) => (
              <div
                key={v.id}
                style={{
                  background: '#fff',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #e6e2d8',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', height: 180 }}>
                  <img
                    src={LOC_IMGS[v.id]}
                    alt={v.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {v.isNew && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: GOLD,
                        color: DARK,
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 700,
                        fontSize: 10,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: 3,
                      }}
                    >
                      {v.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 18,
                      color: DARK,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {v.name}
                  </h3>
                  {v.hasClasses ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {v.lines.map((line, i) => (
                        <div
                          key={i}
                          style={{
                            background: line.bg,
                            borderLeft: `3px solid ${line.color}`,
                            borderRadius: 3,
                            padding: '6px 10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Archivo, sans-serif',
                              fontWeight: 700,
                              fontSize: 11,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              color: DARK,
                            }}
                          >
                            {line.who}
                          </span>
                          <span
                            style={{
                              fontFamily: 'Archivo, sans-serif',
                              fontWeight: 400,
                              fontSize: 12,
                              color: '#55524a',
                            }}
                          >
                            {line.when}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>{t.comingSoon}</p>
                  )}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 8, paddingTop: 8 }}>
                    <button
                      onClick={() => setPage('contact')}
                      style={{
                        flex: 1,
                        background: BLU,
                        border: 'none',
                        cursor: 'pointer',
                        color: '#fff',
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '8px 0',
                        borderRadius: 4,
                      }}
                    >
                      {t.bookHere}
                    </button>
                    <a
                      href={v.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        border: '1px solid #e6e2d8',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: DARK,
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '8px 0',
                        borderRadius: 4,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {t.mapBtn}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PROGRAMS ACCORDION ═══════════════ */}
      <section style={{ background: DARK, padding: '80px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            {t.progKick2}
          </p>
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 40,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 40px 0',
            }}
          >
            {t.progTitle2}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {PROGRAMS.map((prog) => {
              const isOpen = openProg === prog.id
              return (
                <div
                  key={prog.id}
                  style={{
                    borderRadius: 6,
                    overflow: 'hidden',
                    border: '1px solid #3a382f',
                  }}
                >
                  <button
                    onClick={() => setOpenProg(isOpen ? null : prog.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '20px 24px',
                      background: isOpen ? MID : '#26251f',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{prog.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'Archivo, sans-serif',
                          fontWeight: 700,
                          fontSize: 16,
                          color: '#fff',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {prog.name}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Archivo, sans-serif',
                          fontWeight: 400,
                          fontSize: 12,
                          color: MUTED,
                          marginTop: 2,
                        }}
                      >
                        {prog.tag}
                      </div>
                    </div>
                    <span
                      style={{
                        color: MUTED,
                        fontSize: 20,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      ▾
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      style={{
                        background: `linear-gradient(rgba(29,28,24,0.85), rgba(29,28,24,0.97)), url(${PROG_IMGS[prog.id]}) center/cover`,
                        padding: '28px 24px',
                        borderTop: '1px solid #3a382f',
                      }}
                    >
                      <p
                        style={{
                          color: '#cfccc3',
                          fontFamily: 'Archivo, sans-serif',
                          fontSize: 15,
                          lineHeight: 1.7,
                          margin: '0 0 24px 0',
                          maxWidth: 620,
                        }}
                      >
                        {lang === 'en' ? prog.descEn : prog.descSw}
                      </p>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setPage('contact')}
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
                            padding: '10px 20px',
                            borderRadius: 4,
                          }}
                        >
                          {lang === 'en' ? prog.ctaLabelEn : prog.ctaLabelSw}
                        </button>
                        <button
                          onClick={() => {}}
                          style={{
                            background: 'transparent',
                            border: '1px solid #3a382f',
                            cursor: 'pointer',
                            color: '#cfccc3',
                            fontFamily: 'Archivo, sans-serif',
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '10px 20px',
                            borderRadius: 4,
                          }}
                        >
                          {lang === 'en' ? prog.altLabelEn : prog.altLabelSw}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ SCHEDULE ═══════════════ */}
      <section style={{ padding: '80px 60px', background: '#f4f1ea' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p
            style={{
              color: BLU,
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {t.schedKick}
          </p>
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 40,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 8px 0',
            }}
          >
            {t.schedTitle}
          </h2>
          <p style={{ color: MUTED, fontSize: 15, maxWidth: 560, marginBottom: 32 }}>
            {t.schedSub}
          </p>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {['All', ...LOC_CHIPS].map((loc) => (
              <button
                key={loc}
                onClick={() => setSchedFilter(loc)}
                style={{
                  background: schedFilter === loc ? DARK : '#fff',
                  border: `1px solid ${schedFilter === loc ? DARK : '#e6e2d8'}`,
                  cursor: 'pointer',
                  color: schedFilter === loc ? '#fff' : DARK,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '7px 16px',
                  borderRadius: 999,
                }}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* 7-day grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
            }}
          >
            {filteredSchedule.map((day) => (
              <div
                key={day.name}
                style={{
                  background: '#fff',
                  borderRadius: 6,
                  border: '1px solid #e6e2d8',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: DARK,
                    color: '#fff',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '8px 0',
                    textAlign: 'center',
                  }}
                >
                  {day.name}
                </div>
                <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 80 }}>
                  {day.classes.length === 0 ? (
                    <p
                      style={{
                        color: '#cfccc3',
                        fontSize: 11,
                        textAlign: 'center',
                        marginTop: 12,
                        fontFamily: 'Archivo, sans-serif',
                      }}
                    >
                      {t.restDay}
                    </p>
                  ) : (
                    day.classes.map((cls, i) => (
                      <div
                        key={i}
                        style={{
                          background: cls.bg,
                          border: `1px solid ${cls.border}`,
                          borderRadius: 4,
                          padding: '6px 8px',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'Archivo, sans-serif',
                            fontWeight: 700,
                            fontSize: 11,
                            color: cls.color,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {cls.title}
                        </div>
                        <div
                          style={{
                            fontFamily: 'Archivo, sans-serif',
                            fontWeight: 400,
                            fontSize: 10,
                            color: '#55524a',
                          }}
                        >
                          {cls.loc}
                        </div>
                        <div
                          style={{
                            fontFamily: 'Archivo, sans-serif',
                            fontWeight: 500,
                            fontSize: 11,
                            color: cls.color,
                            marginTop: 2,
                          }}
                        >
                          {cls.time}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 20, marginTop: 16, alignItems: 'center' }}>
            {[
              { label: t.legendAdults, bg: '#e3f4fb', border: '#a5dcf3' },
              { label: t.legendKids, bg: '#fdf6d8', border: '#f2dd7a' },
              { label: t.legendFamily, bg: '#e8f6ee', border: '#a7d9bd' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontSize: 11,
                    color: MUTED,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section style={{ padding: '80px 60px', background: DARK }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            {t.priceKick}
          </p>
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 40,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 40px 0',
            }}
          >
            {t.priceTitle}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              alignItems: 'start',
            }}
          >
            {/* Locals */}
            <div
              style={{
                border: `2px solid ${BLU}`,
                borderRadius: 8,
                background: MID,
                padding: 28,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: -13,
                  left: 24,
                  background: GOLD,
                  color: DARK,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: 3,
                }}
              >
                {t.freeFlag}
              </span>
              <h3
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 900,
                  fontSize: 22,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  margin: '0 0 20px 0',
                }}
              >
                {t.localTitle}
              </h3>
              {[
                { label: t.firstClass, price: t.freeWord, per: '' },
                { label: t.dropIn, price: '5,000 TZS', per: '' },
                { label: t.oneWeek, price: '15,000 TZS', per: '' },
                { label: t.twoWeeks, price: '25,000 TZS', per: '' },
                { label: t.oneMonth, price: '30,000 TZS', per: '' },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid #3a382f',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 500,
                      fontSize: 14,
                      color: '#cfccc3',
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      color: row.price === t.freeWord ? GOLD : '#fff',
                    }}
                  >
                    {row.price}
                  </span>
                </div>
              ))}
              <p
                style={{
                  color: MUTED,
                  fontSize: 12,
                  lineHeight: 1.6,
                  margin: '16px 0 20px 0',
                }}
              >
                {t.localNote}
              </p>
              <button
                onClick={() => setPage('contact')}
                style={{
                  width: '100%',
                  background: BLU,
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '13px 0',
                  borderRadius: 4,
                }}
              >
                {t.startFree}
              </button>
            </div>

            {/* Visitors */}
            <div
              style={{
                border: '1px solid #3a382f',
                borderRadius: 8,
                background: MID,
                padding: 28,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 900,
                  fontSize: 22,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  margin: '0 0 20px 0',
                }}
              >
                {t.visitorTitle}
              </h3>
              {[
                { label: t.firstClass, price: t.freeWord },
                { label: t.dropIn, price: '$15 USD' },
                { label: t.oneWeek, price: '$60 USD' },
                { label: t.twoWeeks, price: '$100 USD' },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid #3a382f',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 500,
                      fontSize: 14,
                      color: '#cfccc3',
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      color: row.price === t.freeWord ? GOLD : '#fff',
                    }}
                  >
                    {row.price}
                  </span>
                </div>
              ))}
              <p style={{ color: MUTED, fontSize: 12, lineHeight: 1.6, margin: '16px 0 20px 0' }}>
                {t.visitorNote}
              </p>
              <button
                onClick={() => setPage('contact')}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: `1px solid ${BLU}`,
                  cursor: 'pointer',
                  color: BLU,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '13px 0',
                  borderRadius: 4,
                }}
              >
                {t.bookDropIn}
              </button>
            </div>

            {/* Kids */}
            <div
              style={{
                border: '1px solid #3a382f',
                borderRadius: 8,
                background: MID,
                padding: 28,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 900,
                  fontSize: 22,
                  color: GOLD,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  margin: '0 0 20px 0',
                }}
              >
                {t.kidsPriceTitle}
              </h3>
              {[
                { label: t.firstClass, price: t.freeWord },
                { label: t.dropIn, price: '3,000 TZS' },
                { label: t.oneMonth, price: '20,000 TZS' },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid #3a382f',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 500,
                      fontSize: 14,
                      color: '#cfccc3',
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      color: row.price === t.freeWord ? GOLD : '#fff',
                    }}
                  >
                    {row.price}
                  </span>
                </div>
              ))}
              <p style={{ color: MUTED, fontSize: 12, lineHeight: 1.6, margin: '16px 0 20px 0' }}>
                {t.kidsPriceNote}
              </p>
              <button
                onClick={() => setPage('contact')}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: `1px solid ${GOLD}`,
                  cursor: 'pointer',
                  color: GOLD,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '13px 0',
                  borderRadius: 4,
                }}
              >
                {t.kidsTrial}
              </button>
            </div>
          </div>

          {/* Gym banner */}
          <div
            style={{
              marginTop: 28,
              background: '#26251f',
              border: '1px solid #3a382f',
              borderRadius: 8,
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span style={{ fontSize: 28 }}>🏋️</span>
            <div>
              <div
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                {t.gymBannerTitle}
              </div>
              <div style={{ color: MUTED, fontSize: 13, marginTop: 2 }}>{t.gymFootnote}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ KIDS PROGRAM ═══════════════ */}
      <section style={{ padding: '80px 60px', background: '#f4f1ea' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            {t.kidsKick}
          </p>
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 40,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 8px 0',
            }}
          >
            {t.kidsTitle}
          </h2>
          <p style={{ color: MUTED, fontSize: 15, maxWidth: 520, marginBottom: 40 }}>
            {t.kidsSub}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {[
              {
                img: KIDS_IMGS[0],
                badge: '4–7',
                name: 'Little Champs',
                desc: t.kidsDesc47,
              },
              {
                img: KIDS_IMGS[1],
                badge: '8–12',
                name: t.kidsName812,
                desc: t.kidsDesc812,
              },
              {
                img: KIDS_IMGS[2],
                badge: '13–16',
                name: t.kidsName1316,
                desc: t.kidsDesc1316,
              },
            ].map((card) => (
              <div
                key={card.badge}
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #e6e2d8',
                  background: '#fff',
                }}
              >
                <div style={{ position: 'relative', height: 200 }}>
                  <img
                    src={card.img}
                    alt={card.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: GOLD,
                      color: DARK,
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: '0.06em',
                      padding: '4px 10px',
                      borderRadius: 3,
                    }}
                  >
                    Ages {card.badge}
                  </span>
                </div>
                <div style={{ padding: 20 }}>
                  <h3
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 17,
                      color: DARK,
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {card.name}
                  </h3>
                  <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              color: MUTED,
              fontSize: 13,
              marginTop: 20,
              fontStyle: 'italic',
            }}
          >
            {t.kidsSupervision}
          </p>
        </div>
      </section>

      {/* ═══════════════ BEACH EVENTS ═══════════════ */}
      <section
        style={{
          position: 'relative',
          background: DARK,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${eventBeach})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.25,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0,
            maxWidth: 1200,
            margin: '0 auto',
            padding: '80px 60px',
          }}
        >
          {/* Left info */}
          <div style={{ paddingRight: 60 }}>
            <span
              style={{
                background: BLU,
                color: '#fff',
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 3,
                display: 'inline-block',
                marginBottom: 16,
              }}
            >
              {t.eventBadge}
            </span>
            <h2
              style={{
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 900,
                fontSize: 32,
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                margin: '0 0 16px 0',
                lineHeight: 1.1,
              }}
            >
              {t.eventTitle}
            </h2>
            <p
              style={{
                color: '#cfccc3',
                fontSize: 15,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              {t.eventBody}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[t.eventB1, t.eventB2, t.eventB3].map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: GOLD, fontSize: 16, marginTop: 1 }}>✓</span>
                  <span style={{ color: '#cfccc3', fontSize: 14, lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: 32,
              backdropFilter: 'blur(8px)',
            }}
          >
            {beachDone ? (
              <div>
                <div
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 22,
                    color: GOLD,
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  {t.alertsDone}
                </div>
                <p style={{ color: '#cfccc3', fontSize: 15, lineHeight: 1.6 }}>{t.alertsDoneBody}</p>
                <a
                  href={WA_PRIVATE_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: BLU,
                    fontSize: 13,
                    marginTop: 16,
                    display: 'inline-block',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {t.privateBeach}
                </a>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#fff',
                    textTransform: 'uppercase',
                    margin: '0 0 8px 0',
                    letterSpacing: '0.02em',
                  }}
                >
                  {t.alertsTitle}
                </h3>
                <p style={{ color: '#cfccc3', fontSize: 14, marginBottom: 20 }}>{t.alertsBody}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="text"
                    placeholder={t.fName}
                    value={beachName}
                    onChange={(e) => setBeachName(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 4,
                      padding: '11px 14px',
                      color: '#fff',
                      fontFamily: 'Archivo, sans-serif',
                      fontSize: 14,
                      outline: 'none',
                      width: '100%',
                    }}
                  />
                  <input
                    type="tel"
                    placeholder={t.fPhone}
                    value={beachPhone}
                    onChange={(e) => setBeachPhone(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 4,
                      padding: '11px 14px',
                      color: '#fff',
                      fontFamily: 'Archivo, sans-serif',
                      fontSize: 14,
                      outline: 'none',
                      width: '100%',
                    }}
                  />
                  <button
                    onClick={() => {
                      if (beachName.trim() && beachPhone.trim()) setBeachDone(true)
                    }}
                    style={{
                      background: GOLD,
                      border: 'none',
                      cursor: 'pointer',
                      color: DARK,
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '13px 0',
                      borderRadius: 4,
                      width: '100%',
                    }}
                  >
                    {t.alertsBtn}
                  </button>
                </div>
                <a
                  href={WA_PRIVATE_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: MUTED,
                    fontSize: 12,
                    marginTop: 12,
                    display: 'inline-block',
                    textDecoration: 'none',
                    fontFamily: 'Archivo, sans-serif',
                  }}
                >
                  {t.privateBeach}
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ PHOTO STRIP ═══════════════ */}
      <section style={{ padding: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
          }}
        >
          {[strip4, strip1, strip3, strip2].map((img, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden' }}>
              <img
                src={img}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            background: DARK,
            padding: '12px 60px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: MUTED,
              fontFamily: 'Archivo, sans-serif',
              fontSize: 12,
              letterSpacing: '0.06em',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {t.stripCaption}
          </p>
        </div>
      </section>

      {/* ═══════════════ LEARN PREVIEW ═══════════════ */}
      <section style={{ padding: '80px 60px', background: '#f4f1ea' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 36,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <p
                style={{
                  color: BLU,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                {t.learnKick}
              </p>
              <h2
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 900,
                  fontSize: 40,
                  color: DARK,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                {t.learnTitle}
              </h2>
            </div>
            <button
              onClick={() => setPage('learn')}
              style={{
                background: 'transparent',
                border: `1px solid ${DARK}`,
                cursor: 'pointer',
                color: DARK,
                fontFamily: 'Archivo, sans-serif',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '10px 20px',
                borderRadius: 4,
              }}
            >
              {t.viewLibrary}
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}
          >
            {LEARN_VIDEOS.slice(0, 3).map((vid) => (
              <div
                key={vid.id}
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #e6e2d8',
                  background: '#fff',
                  cursor: 'pointer',
                }}
                onClick={() => setPage('learn')}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    background: DARK,
                  }}
                >
                  <img
                    src={
                      vid.thumb === 'prog-bjj.jpg' ? progBjj
                        : vid.thumb === 'bjj-3.jpg' ? bjj3
                        : vid.thumb === 'bjj-2.jpg' ? bjj2
                        : progBjj
                    }
                    alt={vid.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                  />
                  {/* Play button overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: DARK,
                          fontSize: 16,
                          marginLeft: 3,
                        }}
                      >
                        ▶
                      </span>
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
                      marginBottom: 4,
                    }}
                  >
                    {vid.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontSize: 11,
                      color: MUTED,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {vid.cat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ INSTRUCTORS ═══════════════ */}
      <section style={{ padding: '80px 60px', background: DARK }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
            {t.instKick}
          </p>
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 32,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 8px 0',
            }}
          >
            {t.mentorTitle}
          </h2>
          <p style={{ color: MUTED, fontSize: 15, maxWidth: 560, marginBottom: 28 }}>{t.mentorSub}</p>

          {/* Mentor accordion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 48 }}>
            {MENTORS.map((mentor) => (
              <div
                key={mentor.id}
                style={{
                  border: '1px solid #3a382f',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenMentor(openMentor === mentor.id ? null : mentor.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '18px 20px',
                    background: mentor.bg,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: mentor.color,
                      color: DARK,
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {mentor.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'Archivo, sans-serif',
                        fontWeight: 700,
                        fontSize: 16,
                        color: '#fff',
                        marginBottom: 2,
                      }}
                    >
                      {mentor.name}
                    </div>
                    <div style={{ color: MUTED, fontSize: 12 }}>{mentor.role}</div>
                  </div>
                  <span
                    style={{
                      color: MUTED,
                      fontSize: 20,
                      transform: openMentor === mentor.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  >
                    ▾
                  </span>
                </button>
                {openMentor === mentor.id && (
                  <div
                    style={{
                      background: MID,
                      padding: '20px 24px',
                      borderTop: '1px solid #3a382f',
                    }}
                  >
                    <p style={{ color: '#cfccc3', fontSize: 13, margin: '0 0 8px 0', fontStyle: 'italic' }}>
                      {mentor.teaser}
                    </p>
                    {mentor.paras.map((para, i) => (
                      <p key={i} style={{ color: '#b5b1a6', fontSize: 14, lineHeight: 1.7, margin: '0 0 10px 0' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Team grid */}
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 28,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 8px 0',
            }}
          >
            {t.teamTitle}
          </h2>
          <p style={{ color: MUTED, fontSize: 15, maxWidth: 480, marginBottom: 24 }}>{t.teamSub}</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 16,
            }}
          >
            {TEAM.map((member) => (
              <div
                key={member.name}
                style={{
                  background: MID,
                  border: '1px solid #3a382f',
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center',
                  opacity: member.tbc ? 0.6 : 1,
                }}
              >
                {member.photo ? (
                  <img
                    src={coachAlly}
                    alt={member.name}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: 10,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: '#3a382f',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px',
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 18,
                      color: MUTED,
                    }}
                  >
                    {member.initials}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    marginBottom: 4,
                  }}
                >
                  {member.tbc ? t.tbc : member.name}
                </div>
                <div style={{ color: MUTED, fontSize: 11 }}>{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ COMPETITIONS ═══════════════ */}
      <section style={{ padding: '80px 60px', background: '#f4f1ea' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p
            style={{
              color: BLU,
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {t.compKick}
          </p>
          <h2
            style={{
              fontFamily: 'Archivo, sans-serif',
              fontWeight: 900,
              fontSize: 40,
              color: DARK,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              margin: '0 0 36px 0',
            }}
          >
            {t.compTitle}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
            }}
          >
            {/* Competition card */}
            <div
              style={{
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 280,
              }}
            >
              <img
                src={progComp}
                alt="Competition"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  inset: 0,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(29,28,24,0.9), rgba(29,28,24,0.4))',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  padding: 28,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <p
                  style={{
                    color: GOLD,
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  {t.nextEvent}
                </p>
                <h3
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 900,
                    fontSize: 24,
                    color: '#fff',
                    textTransform: 'uppercase',
                    margin: '0 0 12px 0',
                  }}
                >
                  Zanzibar Open 2026
                </h3>
                <p style={{ color: '#cfccc3', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  {t.compBody}
                </p>
                <button
                  onClick={() => setPage('contact')}
                  style={{
                    background: BLU,
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '11px 20px',
                    borderRadius: 4,
                    alignSelf: 'flex-start',
                  }}
                >
                  {t.registerInterest}
                </button>
              </div>
            </div>

            {/* Rules book card */}
            <div
              style={{
                borderRadius: 8,
                background: GOLD,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 36 }}>📋</span>
                <h3
                  style={{
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 900,
                    fontSize: 22,
                    color: DARK,
                    textTransform: 'uppercase',
                    margin: '12px 0 12px 0',
                    letterSpacing: '0.02em',
                  }}
                >
                  {t.rulesTitle}
                </h3>
                <p style={{ color: '#55524a', fontSize: 14, lineHeight: 1.6 }}>{t.rulesBody}</p>
              </div>
              <a
                href="/src/assets/rules-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: DARK,
                  color: '#fff',
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '12px 20px',
                  borderRadius: 4,
                  textDecoration: 'none',
                  marginTop: 20,
                  alignSelf: 'flex-start',
                }}
              >
                {t.rulesBtn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOME FUNNEL CTA ═══════════════ */}
      <section style={{ padding: '80px 60px', background: DARK }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 40,
              alignItems: 'center',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 900,
                  fontSize: 38,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  margin: '0 0 16px 0',
                  lineHeight: 1.05,
                }}
              >
                {t.funnelTitle}
              </h2>
              <p style={{ color: '#cfccc3', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                {t.funnelSub}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 0 }}>
                {[t.bene1, t.bene2, t.bene3].map((b) => (
                  <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ color: GOLD, fontSize: 15, marginTop: 2 }}>✓</span>
                    <span style={{ color: '#cfccc3', fontSize: 14 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: '#26251f',
                border: '1px solid #3a382f',
                borderRadius: 8,
                padding: 28,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#fff',
                  textTransform: 'uppercase',
                  margin: '0 0 6px 0',
                }}
              >
                {t.funnelCardTitle}
              </h3>
              <p style={{ color: MUTED, fontSize: 13, marginBottom: 20 }}>{t.funnelCardBody}</p>
              {funnelDone ? (
                <div>
                  <p
                    style={{
                      color: GOLD,
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 16,
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    {t.successTitle}
                  </p>
                  <p style={{ color: '#cfccc3', fontSize: 13, marginBottom: 16 }}>{t.successBody}</p>
                  <a
                    href={WA_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#25D366',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#fff',
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '12px 20px',
                      borderRadius: 4,
                      textDecoration: 'none',
                      display: 'inline-block',
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    {t.confirmWa}
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFunnelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {funnelErr && (
                    <p style={{ color: '#ef4444', fontSize: 12, margin: 0 }}>{t.formErr}</p>
                  )}
                  <input
                    type="text"
                    placeholder={t.fName}
                    value={funnelName}
                    onChange={(e) => setFunnelName(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid #3a382f',
                      borderRadius: 4,
                      padding: '10px 13px',
                      color: '#fff',
                      fontFamily: 'Archivo, sans-serif',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                  <input
                    type="tel"
                    placeholder={t.fPhone}
                    value={funnelPhone}
                    onChange={(e) => setFunnelPhone(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid #3a382f',
                      borderRadius: 4,
                      padding: '10px 13px',
                      color: '#fff',
                      fontFamily: 'Archivo, sans-serif',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: GOLD,
                      border: 'none',
                      cursor: 'pointer',
                      color: DARK,
                      fontFamily: 'Archivo, sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '13px 0',
                      borderRadius: 4,
                    }}
                  >
                    {t.fSubmit}
                  </button>
                  <a
                    href={WA_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: MUTED,
                      fontSize: 12,
                      textAlign: 'center',
                      marginTop: 4,
                      textDecoration: 'none',
                      fontFamily: 'Archivo, sans-serif',
                    }}
                  >
                    {t.waInstead}
                  </a>
                </form>
              )}
              <p style={{ color: '#55524a', fontSize: 11, marginTop: 12, textAlign: 'center' }}>
                {t.funnelCardNote}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
