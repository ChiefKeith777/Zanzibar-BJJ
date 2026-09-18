// ── Pure helper functions extracted from component files ──────────────────────

// ── From MemberPortal.tsx ─────────────────────────────────────────────────────

export function getBeltColor(belt: string): string {
  const b = belt.toLowerCase()
  if (b.includes('white'))  return '#e5e7eb'
  if (b.includes('blue'))   return '#3b82f6'
  if (b.includes('purple')) return '#9333ea'
  if (b.includes('brown'))  return '#92400e'
  if (b.includes('black'))  return '#111827'
  return '#FCD116' // default gold
}

export function beltStripePercent(stripes: number): number {
  const normalised = Math.min(Math.max(stripes, 0), 4)
  return Math.round((normalised / 4) * 100)
}

export function statusColors(
  status: 'active' | 'due' | 'overdue' | 'suspended'
): { bg: string; color: string } {
  if (status === 'active')    return { bg: '#dcfce7', color: '#166534' }
  if (status === 'due')       return { bg: '#fef3c7', color: '#92400e' }
  if (status === 'overdue')   return { bg: '#fee2e2', color: '#991b1b' }
  if (status === 'suspended') return { bg: '#f3f4f6', color: '#374151' }
  return { bg: '#f4f1ea', color: '#8d897e' }
}

export function daysUntil(dateStr: string | null): number {
  if (!dateStr) return 0
  const due = new Date(dateStr)
  const now = new Date()
  return Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function buildWeekBars(
  records: { class_date: string }[]
): { label: string; count: number; pct: number }[] {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth()

  const weeks: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }

  records.forEach((r) => {
    const d = new Date(r.class_date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      const wk  = Math.min(Math.ceil(day / 7), 4)
      weeks[wk] = (weeks[wk] ?? 0) + 1
    }
  })

  const max = Math.max(...Object.values(weeks), 1)
  return [1, 2, 3, 4].map((wk) => ({
    label: `W${wk}`,
    count: weeks[wk],
    pct: Math.round((weeks[wk] / max) * 100),
  }))
}

export function sessionsThisMonth(records: { class_date: string }[]): number {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth()
  return records.filter((r) => {
    const d = new Date(r.class_date)
    return d.getFullYear() === year && d.getMonth() === month
  }).length
}

// ── From Header.tsx ───────────────────────────────────────────────────────────

export function getInitial(name: string | null | undefined): string {
  if (!name) return '?'
  const trimmed = name.trim()
  if (!trimmed) return '?'
  return trimmed.charAt(0).toUpperCase()
}

export function roleToPortal(role: string | null): 'admin' | 'coach' | 'member' {
  if (role === 'admin') return 'admin'
  if (role === 'coach') return 'coach'
  return 'member'
}

// ── From Contact.tsx ──────────────────────────────────────────────────────────

/** Returns true when the given program string is a kids or teens program. */
export function isKidsProgram(program: string): boolean {
  if (!program) return false
  const p = program.toLowerCase()
  return (
    p.includes('little champs') ||
    p.includes('kids') ||
    p.includes('teen')
  )
}

// ── From api.ts ───────────────────────────────────────────────────────────────

export function computeOverview(
  profiles: { id: string; role: string; location: string | null }[],
  members: { id: string; status: string; fee_amount: number }[],
  location?: string
): { total: number; active: number; due: number; overdue: number; revenue: number } {
  const memberProfiles = profiles.filter(p => p.role === 'member')
  const filtered = location && location !== 'all'
    ? memberProfiles.filter(p => p.location === location)
    : memberProfiles

  const ids = new Set(filtered.map(p => p.id))
  const filteredMembers = members.filter(m => ids.has(m.id))

  const active  = filteredMembers.filter(m => m.status === 'active').length
  const due     = filteredMembers.filter(m => m.status === 'due').length
  const overdue = filteredMembers.filter(m => m.status === 'overdue').length
  const revenue = filteredMembers
    .filter(m => m.status === 'active')
    .reduce((s, m) => s + m.fee_amount, 0)

  return { total: filteredMembers.length, active, due, overdue, revenue }
}
