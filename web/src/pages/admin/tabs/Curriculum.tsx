import { useState, useEffect, useCallback, useRef } from 'react'
import { getCurriculum, upsertCurriculumWeek, deleteCurriculumWeek } from '../../../lib/api'
import { useAuth } from '../../../lib/auth'
import type { Curriculum as CurriculumType } from '../../../lib/database.types'

const BRAND = {
  bg: '#f4f1ea',
  dark: '#1d1c18',
  mid: '#26251f',
  border: '#3a382f',
  blue: '#00A3DD',
  gold: '#FCD116',
  text: '#f0ede4',
  muted: '#9c9a8e',
}

type Program = 'fundamentals' | 'kids' | 'competition'
const PROGRAMS: { key: Program; label: string }[] = [
  { key: 'fundamentals', label: 'Fundamentals' },
  { key: 'kids', label: 'Kids' },
  { key: 'competition', label: 'Competition' },
]

function Skeleton({ h = 32 }: { h?: number }) {
  return (
    <div style={{
      width: '100%', height: h, borderRadius: 6,
      background: 'linear-gradient(90deg, #2e2c24 25%, #3a382f 50%, #2e2c24 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  )
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: ok ? '#1f8a5b' : '#c0392b',
      color: '#fff', borderRadius: 8, padding: '12px 20px',
      fontFamily: 'Archivo, sans-serif', fontSize: 14, fontWeight: 600,
      boxShadow: '0 4px 24px rgba(0,0,0,.3)',
    }}>
      {msg}
    </div>
  )
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(iso).toLocaleDateString()
}

interface WeekCardProps {
  week: CurriculumType
  onSave: (w: CurriculumType) => void
  onDelete: (id: string, weekNum: number) => void
}

function WeekCard({ week, onSave, onDelete }: WeekCardProps) {
  const [theme, setTheme] = useState(week.theme)
  const [points, setPoints] = useState<string[]>(week.points ?? [])
  const [videoUrl, setVideoUrl] = useState(week.video_url ?? '')
  const [editingTheme, setEditingTheme] = useState(false)
  const [editingPoint, setEditingPoint] = useState<number | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)

  function markDirty() { setDirty(true) }

  async function save() {
    setSaving(true)
    await onSave({ ...week, theme, points, video_url: videoUrl || null })
    setSaving(false)
    setDirty(false)
  }

  function updatePoint(idx: number, val: string) {
    const next = [...points]; next[idx] = val; setPoints(next); markDirty()
  }

  function addPoint() { setPoints([...points, '']); setEditingPoint(points.length); markDirty() }

  function removePoint(idx: number) {
    setPoints(points.filter((_, i) => i !== idx)); markDirty()
  }

  return (
    <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
        {/* Week badge */}
        <div style={{ minWidth: 68, height: 40, borderRadius: 8, background: BRAND.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 15, color: BRAND.dark, letterSpacing: '.04em' }}>
            Wk {week.week}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Theme */}
          {editingTheme ? (
            <input
              autoFocus
              value={theme}
              onChange={e => { setTheme(e.target.value); markDirty() }}
              onBlur={() => setEditingTheme(false)}
              onKeyDown={e => { if (e.key === 'Enter') setEditingTheme(false) }}
              style={{ width: '100%', background: BRAND.mid, border: `1.5px solid ${BRAND.blue}`, borderRadius: 6, padding: '6px 10px', fontFamily: 'Archivo, sans-serif', fontSize: 15, fontWeight: 700, color: BRAND.text, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
            />
          ) : (
            <div
              style={{ fontFamily: 'Archivo, sans-serif', fontSize: 15, fontWeight: 700, color: BRAND.text, marginBottom: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => setEditingTheme(true)}
            >
              {theme || <span style={{ color: BRAND.muted }}>Click to add theme…</span>}
              <span style={{ fontSize: 12, color: BRAND.muted }}>✏️</span>
            </div>
          )}

          {/* Points */}
          <ul style={{ margin: '0 0 14px', padding: '0 0 0 18px' }}>
            {points.map((pt, idx) => (
              <li key={idx} style={{ marginBottom: 6, color: BRAND.text }}>
                {editingPoint === idx ? (
                  <input
                    autoFocus
                    value={pt}
                    onChange={e => updatePoint(idx, e.target.value)}
                    onBlur={() => setEditingPoint(null)}
                    onKeyDown={e => { if (e.key === 'Enter') setEditingPoint(null) }}
                    style={{ background: BRAND.mid, border: `1.5px solid ${BRAND.blue}`, borderRadius: 5, padding: '4px 8px', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text, outline: 'none', width: '80%' }}
                  />
                ) : (
                  <span
                    style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, cursor: 'pointer' }}
                    onClick={() => setEditingPoint(idx)}
                  >
                    {pt || <span style={{ color: BRAND.muted }}>Empty point</span>}
                    <span style={{ marginLeft: 8, fontSize: 11, color: BRAND.muted, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setEditingPoint(idx) }}>✏️</span>
                    <span style={{ marginLeft: 6, fontSize: 11, color: '#c0392b', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); removePoint(idx) }}>✕</span>
                  </span>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={addPoint}
            style={{ background: 'none', border: `1.5px dashed ${BRAND.border}`, color: BRAND.muted, borderRadius: 6, padding: '4px 12px', fontFamily: 'Archivo, sans-serif', fontSize: 12, cursor: 'pointer', marginBottom: 14 }}
          >
            + Add point
          </button>

          {/* YouTube URL */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.muted, display: 'block', marginBottom: 4 }}>
              YouTube URL (optional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={e => { setVideoUrl(e.target.value); markDirty() }}
              placeholder="https://youtube.com/watch?v=..."
              style={{ width: '100%', background: BRAND.mid, border: `1.5px solid ${BRAND.border}`, borderRadius: 6, padding: '7px 10px', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.text, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Meta */}
          {week.updated_by && (
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: BRAND.muted, marginBottom: 12 }}>
              Updated {timeAgo(week.updated_at)}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={save}
              disabled={saving || !dirty}
              style={{
                padding: '8px 20px', borderRadius: 7, background: dirty ? BRAND.blue : BRAND.border,
                color: '#fff', border: 'none', fontFamily: 'Archivo, sans-serif', fontWeight: 700,
                fontSize: 13, cursor: dirty ? 'pointer' : 'default', opacity: saving ? .6 : 1, transition: 'background .2s',
              }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => onDelete(week.id, week.week)}
              style={{ padding: '8px 14px', borderRadius: 7, background: 'transparent', color: '#c0392b', border: '1.5px solid #c0392b', fontFamily: 'Archivo, sans-serif', fontSize: 13, cursor: 'pointer' }}
            >
              Delete week
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Curriculum() {
  const { profile } = useAuth()
  const [activeProgram, setActiveProgram] = useState<Program>('fundamentals')
  const [weeks, setWeeks] = useState<Record<Program, CurriculumType[]>>({
    fundamentals: [], kids: [], competition: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [fund, kids, comp] = await Promise.all([
        getCurriculum('fundamentals'),
        getCurriculum('kids'),
        getCurriculum('competition'),
      ])
      if (fund.error) throw fund.error
      if (kids.error) throw kids.error
      if (comp.error) throw comp.error
      setWeeks({
        fundamentals: fund.data ?? [],
        kids: kids.data ?? [],
        competition: comp.data ?? [],
      })
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load curriculum')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(week: CurriculumType) {
    const { error: e } = await upsertCurriculumWeek({
      program: week.program,
      week: week.week,
      theme: week.theme,
      points: week.points,
      video_url: week.video_url,
      updated_by: profile?.id ?? null,
    })
    if (e) { showToast('Save failed', false); return }
    showToast(`Week ${week.week} saved`)
    load()
  }

  async function handleDelete(id: string, weekNum: number) {
    if (!confirm(`Delete Week ${weekNum}? This cannot be undone.`)) return
    const { error: e } = await deleteCurriculumWeek(id)
    if (e) { showToast('Delete failed', false); return }
    showToast(`Week ${weekNum} deleted`)
    load()
  }

  async function handleAddWeek() {
    const current = weeks[activeProgram]
    const nextWeek = current.length > 0 ? Math.max(...current.map(w => w.week)) + 1 : 1
    const { error: e } = await upsertCurriculumWeek({
      program: activeProgram,
      week: nextWeek,
      theme: 'New week',
      points: [],
      video_url: null,
      updated_by: profile?.id ?? null,
    })
    if (e) { showToast('Failed to add week', false); return }
    showToast(`Week ${nextWeek} added`)
    load()
  }

  const currentWeeks = weeks[activeProgram]

  return (
    <div style={{ padding: '28px 32px', minHeight: 'calc(100vh - 62px)', background: BRAND.bg }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 26, letterSpacing: '.03em', textTransform: 'uppercase', color: BRAND.dark }}>
          Curriculum Builder
        </h2>
        <p style={{ margin: '6px 0 0', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted }}>
          Build the weekly lesson plans. Coaches see these when they log in.
        </p>
      </div>

      {error && (
        <div style={{ background: '#fce8e6', border: '1.5px solid #e57373', borderRadius: 8, padding: '12px 18px', marginBottom: 16, color: '#c0392b', fontFamily: 'Archivo, sans-serif', fontSize: 14 }}>
          {error}
          <button onClick={load} style={{ marginLeft: 12, background: 'none', border: 'none', color: BRAND.blue, cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
      )}

      {/* Program tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: `2px solid ${BRAND.border}`, paddingBottom: 0 }}>
        {PROGRAMS.map(prog => (
          <button
            key={prog.key}
            onClick={() => setActiveProgram(prog.key)}
            style={{
              padding: '10px 24px', borderRadius: '7px 7px 0 0',
              border: 'none', background: activeProgram === prog.key ? BRAND.dark : 'transparent',
              color: activeProgram === prog.key ? BRAND.text : BRAND.muted,
              fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13,
              letterSpacing: '.04em', textTransform: 'uppercase', cursor: 'pointer',
              borderBottom: activeProgram === prog.key ? `2px solid ${BRAND.gold}` : '2px solid transparent',
              marginBottom: -2,
            }}
          >
            {prog.label}
            <span style={{ marginLeft: 8, background: BRAND.border, borderRadius: 10, padding: '1px 7px', fontSize: 11, color: BRAND.muted }}>
              {weeks[prog.key].length}
            </span>
          </button>
        ))}
      </div>

      {/* Weeks list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Array(3).fill(null).map((_, i) => (
            <div key={i} style={{ background: BRAND.dark, borderRadius: 10, padding: 24 }}>
              <Skeleton h={20} />
              <div style={{ marginTop: 12 }}><Skeleton h={14} /></div>
              <div style={{ marginTop: 8 }}><Skeleton h={14} /></div>
            </div>
          ))}
        </div>
      ) : currentWeeks.length === 0 ? (
        <div style={{ background: BRAND.dark, borderRadius: 10, padding: '40px 24px', textAlign: 'center', marginBottom: 16 }}>
          <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 15, color: BRAND.muted, margin: 0 }}>
            No weeks yet for {activeProgram}.
          </p>
        </div>
      ) : (
        currentWeeks.map(week => (
          <WeekCard
            key={week.id}
            week={week}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))
      )}

      <button
        onClick={handleAddWeek}
        style={{
          width: '100%', padding: '14px', borderRadius: 10,
          border: `2px dashed ${BRAND.border}`, background: 'transparent',
          color: BRAND.muted, fontFamily: 'Archivo, sans-serif', fontWeight: 700,
          fontSize: 14, cursor: 'pointer', letterSpacing: '.04em', marginTop: 4,
          transition: 'border-color .2s, color .2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BRAND.gold; (e.currentTarget as HTMLButtonElement).style.color = BRAND.gold }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BRAND.border; (e.currentTarget as HTMLButtonElement).style.color = BRAND.muted }}
      >
        + Add week
      </button>
    </div>
  )
}
