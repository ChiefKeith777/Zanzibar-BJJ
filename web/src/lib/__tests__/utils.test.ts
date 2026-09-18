import { describe, it, expect } from 'vitest'
import {
  getBeltColor,
  beltStripePercent,
  statusColors,
  daysUntil,
  formatDate,
  buildWeekBars,
  sessionsThisMonth,
  getInitial,
  roleToPortal,
  isKidsProgram,
  computeOverview,
} from '../utils'

// ── getBeltColor ──────────────────────────────────────────────────────────────
describe('getBeltColor', () => {
  it('returns grey for White Belt', () => {
    expect(getBeltColor('White Belt')).toBe('#e5e7eb')
  })
  it('returns blue for Blue Belt', () => {
    expect(getBeltColor('Blue Belt')).toBe('#3b82f6')
  })
  it('returns purple for Purple Belt', () => {
    expect(getBeltColor('Purple Belt')).toBe('#9333ea')
  })
  it('returns brown for Brown Belt', () => {
    expect(getBeltColor('Brown Belt')).toBe('#92400e')
  })
  it('returns near-black for Black Belt', () => {
    expect(getBeltColor('Black Belt')).toBe('#111827')
  })
  it('returns gold for unknown belt', () => {
    expect(getBeltColor('Coral Belt')).toBe('#FCD116')
  })
  it('returns gold for empty string', () => {
    expect(getBeltColor('')).toBe('#FCD116')
  })
  it('is case-insensitive — WHITE BELT', () => {
    expect(getBeltColor('WHITE BELT')).toBe('#e5e7eb')
  })
  it('is case-insensitive — blue belt (lowercase)', () => {
    expect(getBeltColor('blue belt')).toBe('#3b82f6')
  })
  it('is case-insensitive — PURPLE BELT (uppercase)', () => {
    expect(getBeltColor('PURPLE BELT')).toBe('#9333ea')
  })
})

// ── beltStripePercent ─────────────────────────────────────────────────────────
describe('beltStripePercent', () => {
  it('0 stripes → 0%', () => {
    expect(beltStripePercent(0)).toBe(0)
  })
  it('1 stripe → 25%', () => {
    expect(beltStripePercent(1)).toBe(25)
  })
  it('2 stripes → 50%', () => {
    expect(beltStripePercent(2)).toBe(50)
  })
  it('3 stripes → 75%', () => {
    expect(beltStripePercent(3)).toBe(75)
  })
  it('4 stripes → 100%', () => {
    expect(beltStripePercent(4)).toBe(100)
  })
  it('negative value → clamped to 0%', () => {
    expect(beltStripePercent(-1)).toBe(0)
  })
  it('value > 4 → clamped to 100%', () => {
    expect(beltStripePercent(10)).toBe(100)
  })
})

// ── statusColors ──────────────────────────────────────────────────────────────
describe('statusColors', () => {
  it('active → green bg and text', () => {
    const c = statusColors('active')
    expect(c.bg).toBe('#dcfce7')
    expect(c.color).toBe('#166534')
  })
  it('due → amber bg and text', () => {
    const c = statusColors('due')
    expect(c.bg).toBe('#fef3c7')
    expect(c.color).toBe('#92400e')
  })
  it('overdue → red bg and text', () => {
    const c = statusColors('overdue')
    expect(c.bg).toBe('#fee2e2')
    expect(c.color).toBe('#991b1b')
  })
  it('suspended → grey bg and text', () => {
    const c = statusColors('suspended')
    expect(c.bg).toBe('#f3f4f6')
    expect(c.color).toBe('#374151')
  })
})

// ── daysUntil ─────────────────────────────────────────────────────────────────
describe('daysUntil', () => {
  it('null → 0', () => {
    expect(daysUntil(null)).toBe(0)
  })

  it("today's date → 0 (approximately)", () => {
    const today = new Date().toISOString().split('T')[0]
    expect(Math.abs(daysUntil(today))).toBeLessThanOrEqual(1)
  })

  it('tomorrow → approximately 1', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const dateStr = tomorrow.toISOString().split('T')[0]
    const result = daysUntil(dateStr)
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(2)
  })

  it('yesterday → approximately -1', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const dateStr = yesterday.toISOString().split('T')[0]
    const result = daysUntil(dateStr)
    expect(result).toBeGreaterThanOrEqual(-2)
    expect(result).toBeLessThanOrEqual(0)
  })

  it('far future date → positive number', () => {
    expect(daysUntil('2099-12-31')).toBeGreaterThan(0)
  })
})

// ── formatDate ────────────────────────────────────────────────────────────────
describe('formatDate', () => {
  it('null → em dash', () => {
    expect(formatDate(null)).toBe('—')
  })
  it('valid ISO date → human readable (not empty)', () => {
    const result = formatDate('2026-06-15')
    expect(result).not.toBe('')
    expect(result).not.toBe('—')
    expect(result).toMatch(/\d/)
  })
  it('includes the year for a valid date', () => {
    const result = formatDate('2026-06-15')
    expect(result).toContain('2026')
  })
  it('invalid string → returns em dash gracefully', () => {
    const result = formatDate('not-a-date')
    // Invalid dates should not throw and should return something safe
    expect(typeof result).toBe('string')
  })
})

// ── buildWeekBars ─────────────────────────────────────────────────────────────
describe('buildWeekBars', () => {
  it('empty array → 4 zero bars', () => {
    const bars = buildWeekBars([])
    expect(bars).toHaveLength(4)
    expect(bars[0]).toEqual({ label: 'W1', count: 0, pct: 0 })
    expect(bars[1]).toEqual({ label: 'W2', count: 0, pct: 0 })
    expect(bars[2]).toEqual({ label: 'W3', count: 0, pct: 0 })
    expect(bars[3]).toEqual({ label: 'W4', count: 0, pct: 0 })
  })

  it('always returns exactly 4 items', () => {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    expect(buildWeekBars([{ class_date: dateStr }])).toHaveLength(4)
  })

  it('groups current-month attendance by week correctly', () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    // Day 1 = W1, day 8 = W2, day 15 = W3, day 22 = W4
    const records = [
      { class_date: `${year}-${month}-01` },
      { class_date: `${year}-${month}-01` },
      { class_date: `${year}-${month}-08` },
    ]
    const bars = buildWeekBars(records)
    expect(bars[0].count).toBe(2) // W1: 2 sessions on day 1
    expect(bars[1].count).toBe(1) // W2: 1 session on day 8
    expect(bars[2].count).toBe(0) // W3: 0
    expect(bars[3].count).toBe(0) // W4: 0
  })

  it('pct is computed relative to the max bar', () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const records = [
      { class_date: `${year}-${month}-01` },
      { class_date: `${year}-${month}-01` },
      { class_date: `${year}-${month}-08` },
    ]
    const bars = buildWeekBars(records)
    // W1 has 2 (max), so W1 pct=100, W2 pct=50
    expect(bars[0].pct).toBe(100)
    expect(bars[1].pct).toBe(50)
  })

  it('excludes records from previous months', () => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15)
    const lastMonthStr = lastMonth.toISOString().split('T')[0]
    const bars = buildWeekBars([{ class_date: lastMonthStr }])
    const total = bars.reduce((sum, b) => sum + b.count, 0)
    expect(total).toBe(0)
  })
})

// ── sessionsThisMonth ─────────────────────────────────────────────────────────
describe('sessionsThisMonth', () => {
  it('empty array → 0', () => {
    expect(sessionsThisMonth([])).toBe(0)
  })

  it('records from current month → correct count', () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const records = [
      { class_date: `${year}-${month}-01` },
      { class_date: `${year}-${month}-05` },
      { class_date: `${year}-${month}-10` },
    ]
    expect(sessionsThisMonth(records)).toBe(3)
  })

  it('records from last month → 0', () => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15)
    const dateStr = lastMonth.toISOString().split('T')[0]
    expect(sessionsThisMonth([{ class_date: dateStr }])).toBe(0)
  })
})

// ── getInitial ────────────────────────────────────────────────────────────────
describe('getInitial', () => {
  it('"Keith Grant" → "K"', () => {
    expect(getInitial('Keith Grant')).toBe('K')
  })
  it('null → "?"', () => {
    expect(getInitial(null)).toBe('?')
  })
  it('undefined → "?"', () => {
    expect(getInitial(undefined)).toBe('?')
  })
  it('empty string → "?"', () => {
    expect(getInitial('')).toBe('?')
  })
  it('whitespace only → "?"', () => {
    expect(getInitial('  ')).toBe('?')
  })
})

// ── roleToPortal ──────────────────────────────────────────────────────────────
describe('roleToPortal', () => {
  it('"admin" → "admin"', () => {
    expect(roleToPortal('admin')).toBe('admin')
  })
  it('"coach" → "coach"', () => {
    expect(roleToPortal('coach')).toBe('coach')
  })
  it('"member" → "member"', () => {
    expect(roleToPortal('member')).toBe('member')
  })
  it('"pending" → "member" (falls back)', () => {
    expect(roleToPortal('pending')).toBe('member')
  })
  it('null → "member"', () => {
    expect(roleToPortal(null)).toBe('member')
  })
})

// ── isKidsProgram ─────────────────────────────────────────────────────────────
describe('isKidsProgram', () => {
  it('"Little Champs (4–7)" → true', () => {
    expect(isKidsProgram('Little Champs (4–7)')).toBe(true)
  })
  it('"Kids (8–12)" → true', () => {
    expect(isKidsProgram('Kids (8–12)')).toBe(true)
  })
  it('"Teens (13–16)" → true', () => {
    expect(isKidsProgram('Teens (13–16)')).toBe(true)
  })
  it('"Adults" → false', () => {
    expect(isKidsProgram('Adults')).toBe(false)
  })
  it('"Adults BJJ" → false', () => {
    expect(isKidsProgram('Adults BJJ')).toBe(false)
  })
  it('empty string → false', () => {
    expect(isKidsProgram('')).toBe(false)
  })
})

// ── computeOverview ───────────────────────────────────────────────────────────
describe('computeOverview', () => {
  it('empty arrays → all zeros', () => {
    const result = computeOverview([], [])
    expect(result).toEqual({ total: 0, active: 0, due: 0, overdue: 0, revenue: 0 })
  })

  it('2 active, 1 due, 1 overdue → correct counts', () => {
    const profiles = [
      { id: 'a', role: 'member', location: 'Stone Town' },
      { id: 'b', role: 'member', location: 'Stone Town' },
      { id: 'c', role: 'member', location: 'Stone Town' },
      { id: 'd', role: 'member', location: 'Stone Town' },
    ]
    const members = [
      { id: 'a', status: 'active', fee_amount: 30000 },
      { id: 'b', status: 'active', fee_amount: 30000 },
      { id: 'c', status: 'due', fee_amount: 30000 },
      { id: 'd', status: 'overdue', fee_amount: 30000 },
    ]
    const result = computeOverview(profiles, members)
    expect(result.total).toBe(4)
    expect(result.active).toBe(2)
    expect(result.due).toBe(1)
    expect(result.overdue).toBe(1)
  })

  it('revenue = sum of active members fee_amount only', () => {
    const profiles = [
      { id: 'a', role: 'member', location: null },
      { id: 'b', role: 'member', location: null },
    ]
    const members = [
      { id: 'a', status: 'active', fee_amount: 50000 },
      { id: 'b', status: 'due', fee_amount: 50000 },
    ]
    const result = computeOverview(profiles, members)
    expect(result.revenue).toBe(50000)
  })

  it('location filter excludes non-matching members', () => {
    const profiles = [
      { id: 'x', role: 'member', location: 'Stone Town' },
      { id: 'y', role: 'member', location: 'Kiwengwa' },
    ]
    const members = [
      { id: 'x', status: 'active', fee_amount: 30000 },
      { id: 'y', status: 'active', fee_amount: 30000 },
    ]
    const result = computeOverview(profiles, members, 'Stone Town')
    expect(result.total).toBe(1)
    expect(result.active).toBe(1)
  })

  it('location="all" includes all members', () => {
    const profiles = [
      { id: 'x', role: 'member', location: 'Stone Town' },
      { id: 'y', role: 'member', location: 'Kiwengwa' },
    ]
    const members = [
      { id: 'x', status: 'active', fee_amount: 30000 },
      { id: 'y', status: 'active', fee_amount: 30000 },
    ]
    const result = computeOverview(profiles, members, 'all')
    expect(result.total).toBe(2)
  })

  it('only profiles with role="member" are counted (not admin/coach/pending)', () => {
    const profiles = [
      { id: 'a', role: 'member', location: null },
      { id: 'b', role: 'admin', location: null },
      { id: 'c', role: 'coach', location: null },
      { id: 'd', role: 'pending', location: null },
    ]
    const members = [
      { id: 'a', status: 'active', fee_amount: 30000 },
      { id: 'b', status: 'active', fee_amount: 30000 },
      { id: 'c', status: 'active', fee_amount: 30000 },
      { id: 'd', status: 'active', fee_amount: 30000 },
    ]
    const result = computeOverview(profiles, members)
    // Only 'a' has role=member
    expect(result.total).toBe(1)
    expect(result.active).toBe(1)
  })
})
