import { useState, useEffect, useCallback, useRef } from 'react'
import { getSiteContent, upsertSiteContent, getSchedule, upsertScheduleRow } from '../../../lib/api'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../lib/auth'

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


const VIDEO_KEYS = Array.from({ length: 8 }, (_, i) => `video_${i + 1}`)
const HERO_KEYS  = Array.from({ length: 6 }, (_, i) => `hero_${i + 1}`)

function Skeleton({ h = 32 }: { h?: number }) {
  return (
    <div style={{
      width: '100%', height: h, borderRadius: 6,
      background: 'linear-gradient(90deg, #2e2c24 25%, #3a382f 50%, #2e2c24 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  )
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: ok ? '#1f8a5b' : '#c0392b', color: '#fff', borderRadius: 8, padding: '12px 20px',
      fontFamily: 'Archivo, sans-serif', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(0,0,0,.3)',
    }}>
      {msg}
    </div>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.text, marginBottom: 18 }}>
      {children}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: BRAND.dark, borderRadius: 10, padding: 24, marginBottom: 24 }}>
      {children}
    </div>
  )
}

export default function Content() {
  const { user } = useAuth()
  const [siteContent, setSiteContent] = useState<Record<string, string>>({})
  const [schedule, setSchedule] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Local edit state
  const [banner, setBanner] = useState('')
  const [videos, setVideos] = useState<Record<string, string>>({})
  const [heroUploading, setHeroUploading] = useState<Record<string, boolean>>({})

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const [contRes, schedRes] = await Promise.all([getSiteContent(), getSchedule()])
      if (contRes.error) throw contRes.error
      if (schedRes.error) throw schedRes.error

      const map: Record<string, string> = {}
      for (const row of (contRes.data ?? []) as Array<{ key: string; value: string | null }>) {
        map[row.key] = row.value ?? ''
      }
      setSiteContent(map)
      setBanner(map['banner'] ?? '')
      const vid: Record<string, string> = {}
      VIDEO_KEYS.forEach(k => { vid[k] = map[k] ?? '' })
      setVideos(vid)
      setSchedule(schedRes.data ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function saveBanner() {
    if (!user) return
    const { error: e } = await upsertSiteContent('banner', banner, user.id)
    if (e) { showToast('Failed to save banner', false); return }
    showToast('Banner published')
  }

  async function saveVideos() {
    if (!user) return
    const results = await Promise.all(
      VIDEO_KEYS.filter(k => videos[k]).map(k => upsertSiteContent(k, videos[k], user.id))
    )
    const hasErr = results.some((r: any) => r.error)
    if (hasErr) { showToast('Some video links failed to save', false); return }
    showToast('Video links saved')
  }

  async function handleHeroUpload(slot: string, file: File) {
    setHeroUploading(prev => ({ ...prev, [slot]: true }))
    try {
      const path = `${slot}/${Date.now()}-${file.name}`
      const { error: uploadErr } = await supabase.storage.from('hero-photos').upload(path, file, { upsert: true })
      if (uploadErr) {
        if (uploadErr.message?.includes('not found') || uploadErr.message?.includes('bucket')) {
          showToast('Storage bucket "hero-photos" not configured yet', false)
        } else {
          showToast(uploadErr.message, false)
        }
        return
      }
      const { data: urlData } = supabase.storage.from('hero-photos').getPublicUrl(path)
      const publicUrl = urlData.publicUrl
      if (!user) return
      await upsertSiteContent(slot, publicUrl, user.id)
      setSiteContent(prev => ({ ...prev, [slot]: publicUrl }))
      showToast(`${slot} photo updated`)
    } catch (e: any) {
      showToast(e?.message ?? 'Upload failed', false)
    } finally {
      setHeroUploading(prev => ({ ...prev, [slot]: false }))
    }
  }

  // Schedule editing
  const [scheduleEdits, setScheduleEdits] = useState<Record<string, any>>({})

  function getSchedField(id: string, field: string, row: any) {
    return scheduleEdits[id]?.[field] ?? row[field] ?? ''
  }

  function setSchedField(id: string, field: string, val: string) {
    setScheduleEdits(prev => ({ ...prev, [id]: { ...(prev[id] ?? {}), [field]: val } }))
  }

  async function saveScheduleRow(row: any) {
    const edits = scheduleEdits[row.id] ?? {}
    const updated = { ...row, ...edits }
    const { error: e } = await upsertScheduleRow({
      location: updated.location,
      day: updated.day,
      time: updated.time,
      class_type: updated.class_type,
      program: updated.program,
    })
    if (e) { showToast('Schedule save failed', false); return }
    showToast('Schedule row saved')
    load()
  }

  return (
    <div style={{ padding: '28px 32px', minHeight: 'calc(100vh - 62px)', background: BRAND.bg }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 26, letterSpacing: '.03em', textTransform: 'uppercase', color: BRAND.dark }}>
          Site Content
        </h2>
        <p style={{ margin: '6px 0 0', fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted }}>
          Manage what appears on the public website.
        </p>
      </div>

      {error && (
        <div style={{ background: '#fce8e6', border: '1.5px solid #e57373', borderRadius: 8, padding: '12px 18px', marginBottom: 16, color: '#c0392b', fontFamily: 'Archivo, sans-serif', fontSize: 14 }}>
          {error}
          <button onClick={load} style={{ marginLeft: 12, background: 'none', border: 'none', color: BRAND.blue, cursor: 'pointer', fontWeight: 600 }}>Retry</button>
        </div>
      )}

      {/* A. Announcement banner */}
      <Card>
        <SectionHeader>A. Announcement Banner</SectionHeader>
        {loading ? <Skeleton h={80} /> : (
          <>
            <textarea
              value={banner}
              onChange={e => setBanner(e.target.value)}
              placeholder="Enter announcement text (leave blank to hide the banner)…"
              rows={3}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${BRAND.border}`, background: BRAND.mid, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 13, outline: 'none', resize: 'vertical', marginBottom: 14, boxSizing: 'border-box' }}
            />
            <button
              onClick={saveBanner}
              style={{ padding: '9px 22px', borderRadius: 7, background: BRAND.blue, color: '#fff', border: 'none', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              Publish banner
            </button>
          </>
        )}
      </Card>

      {/* B. Hero photos */}
      <Card>
        <SectionHeader>B. Hero Photos</SectionHeader>
        {loading ? <Skeleton h={140} /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {HERO_KEYS.map(slot => {
              const currentUrl = siteContent[slot]
              const uploading = heroUploading[slot]
              return (
                <div key={slot} style={{ background: BRAND.mid, borderRadius: 8, overflow: 'hidden', border: `1.5px solid ${BRAND.border}` }}>
                  {currentUrl ? (
                    <img src={currentUrl} alt={slot} style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.muted, fontFamily: 'Archivo, sans-serif', fontSize: 12 }}>
                      No image
                    </div>
                  )}
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, color: BRAND.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      {slot.replace('_', ' ')}
                    </div>
                    <label style={{ display: 'block', padding: '6px 14px', borderRadius: 6, background: uploading ? BRAND.border : BRAND.blue, color: '#fff', fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', textAlign: 'center' }}>
                      {uploading ? 'Uploading…' : 'Replace'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading}
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleHeroUpload(slot, f) }}
                      />
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* C. Class times & prices (schedule) */}
      <Card>
        <SectionHeader>C. Class Times &amp; Prices</SectionHeader>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array(4).fill(null).map((_, i) => <Skeleton key={i} h={36} />)}
          </div>
        ) : schedule.length === 0 ? (
          <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13, color: BRAND.muted, margin: 0 }}>No schedule rows. Add rows via Supabase or add functionality here.</p>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 4 }}>
              <thead>
                <tr>
                  {['Location', 'Day', 'Time', 'Class Type', 'Program', ''].map(h => (
                    <th key={h} style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: BRAND.muted, textAlign: 'left', padding: '0 10px 10px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map(row => (
                  <tr key={row.id}>
                    {(['location', 'day', 'time', 'class_type', 'program'] as const).map(field => (
                      <td key={field} style={{ padding: '8px 10px 8px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                        <input
                          value={getSchedField(row.id, field, row)}
                          onChange={e => setSchedField(row.id, field, e.target.value)}
                          style={{ padding: '5px 8px', borderRadius: 5, border: `1.5px solid ${BRAND.border}`, background: BRAND.mid, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box' }}
                        />
                      </td>
                    ))}
                    <td style={{ padding: '8px 0', borderBottom: `1px solid ${BRAND.border}` }}>
                      <button
                        onClick={() => saveScheduleRow(row)}
                        style={{ padding: '5px 12px', borderRadius: 5, background: BRAND.blue, color: '#fff', border: 'none', fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </Card>

      {/* D. Video links */}
      <Card>
        <SectionHeader>D. Video Links (Learn Library)</SectionHeader>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array(4).fill(null).map((_, i) => <Skeleton key={i} h={36} />)}
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {VIDEO_KEYS.map((key, i) => (
                <div key={key}>
                  <label style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.muted, display: 'block', marginBottom: 4 }}>
                    Video {i + 1}
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videos[key] ?? ''}
                    onChange={e => setVideos(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 7, border: `1.5px solid ${BRAND.border}`, background: BRAND.mid, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={saveVideos}
              style={{ padding: '9px 22px', borderRadius: 7, background: BRAND.blue, color: '#fff', border: 'none', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
            >
              Save video links
            </button>
          </>
        )}
      </Card>

      {/* E. Team / coaches */}
      <Card>
        <SectionHeader>E. Team &amp; Coaches</SectionHeader>
        <TeamEditor
          siteContent={siteContent}
          userId={user?.id ?? ''}
          showToast={showToast}
          loading={loading}
        />
      </Card>
    </div>
  )
}

// Team editor sub-component
interface TeamEditorProps {
  siteContent: Record<string, string>
  userId: string
  showToast: (msg: string, ok?: boolean) => void
  loading: boolean
}

const DEFAULT_TEAM = [
  { key: 'team_1', name: 'Chief Keith', role: 'Head Coach & Founder', location: 'Stone Town' },
  { key: 'team_2', name: 'Ally', role: 'Kids Coach', location: 'Stone Town' },
  { key: 'team_3', name: 'Mohammed', role: 'Coach', location: 'Kiwengwa' },
]

function TeamEditor({ siteContent, userId, showToast, loading }: TeamEditorProps) {
  const [members, setMembers] = useState(
    DEFAULT_TEAM.map(m => ({
      ...m,
      name: siteContent[`${m.key}_name`] ?? m.name,
      role: siteContent[`${m.key}_role`] ?? m.role,
    }))
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setMembers(prev => prev.map(m => ({
      ...m,
      name: siteContent[`${m.key}_name`] ?? m.name,
      role: siteContent[`${m.key}_role`] ?? m.role,
    })))
  }, [siteContent])

  async function save() {
    if (!userId) return
    setSaving(true)
    const ops = members.flatMap(m => [
      upsertSiteContent(`${m.key}_name`, m.name, userId),
      upsertSiteContent(`${m.key}_role`, m.role, userId),
    ])
    const results = await Promise.all(ops)
    const hasErr = results.some((r: any) => r.error)
    setSaving(false)
    if (hasErr) { showToast('Some fields failed to save', false); return }
    showToast('Team saved')
  }

  if (loading) return <Skeleton h={120} />

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
        {members.map((m, idx) => (
          <div key={m.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: '14px', background: BRAND.mid, borderRadius: 8 }}>
            {[
              { label: 'Name', field: 'name' as const },
              { label: 'Role', field: 'role' as const },
              { label: 'Location', field: 'location' as const },
            ].map(f => (
              <div key={f.field}>
                <label style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: BRAND.muted, display: 'block', marginBottom: 4 }}>
                  {f.label}
                </label>
                <input
                  value={m[f.field]}
                  onChange={e => setMembers(prev => prev.map((p, i) => i === idx ? { ...p, [f.field]: e.target.value } : p))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: `1.5px solid ${BRAND.border}`, background: BRAND.dark, color: BRAND.text, fontFamily: 'Archivo, sans-serif', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={save}
        disabled={saving}
        style={{ padding: '9px 22px', borderRadius: 7, background: BRAND.blue, color: '#fff', border: 'none', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .6 : 1 }}
      >
        {saving ? 'Saving…' : 'Save team'}
      </button>
    </>
  )
}
