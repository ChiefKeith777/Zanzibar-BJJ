import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Supabase mock ────────────────────────────────────────────────────────────
let fromCallCount = 0

// Each call to supabase.from() returns a fresh query builder
vi.mock('../lib/supabase', () => {
  const makeBuilder = () => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    upsert: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
  })

  return {
    supabase: {
      from: vi.fn().mockImplementation(() => {
        fromCallCount++
        return makeBuilder()
      }),
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
      },
    },
  }
})

import { supabase } from '../lib/supabase'
import {
  submitBooking,
  submitBeachSignup,
  markMemberPaid,
  getAdminOverview,
} from '../lib/api'

beforeEach(() => {
  vi.clearAllMocks()
  fromCallCount = 0
})

// ── submitBooking ─────────────────────────────────────────────────────────────
describe('submitBooking', () => {
  it('inserts into the bookings table with the correct data', async () => {
    const insertMock = vi.fn().mockResolvedValue({ data: null, error: null })
    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: insertMock,
    } as any)

    const payload = {
      name: 'Amina Hassan',
      phone: '+255628000001',
      location: 'Stone Town',
      program: 'Adults',
      news_opt_in: true,
    }

    await submitBooking(payload)

    expect(supabase.from).toHaveBeenCalledWith('bookings')
    expect(insertMock).toHaveBeenCalledWith(payload)
  })

  it('passes optional kid fields when provided', async () => {
    const insertMock = vi.fn().mockResolvedValue({ data: null, error: null })
    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: insertMock,
    } as any)

    const payload = {
      name: 'Fatuma Said',
      phone: '+255628000002',
      location: 'Kiwengwa',
      program: 'Little Champs (4–7)',
      kid_name: 'Zaid',
      kid_age: '5',
      kid_exp: 'none',
      news_opt_in: false,
    }

    await submitBooking(payload)

    expect(supabase.from).toHaveBeenCalledWith('bookings')
    expect(insertMock).toHaveBeenCalledWith(payload)
  })
})

// ── submitBeachSignup ─────────────────────────────────────────────────────────
describe('submitBeachSignup', () => {
  it('inserts name and phone into beach_signups table', async () => {
    const insertMock = vi.fn().mockResolvedValue({ data: null, error: null })
    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: insertMock,
    } as any)

    await submitBeachSignup('Omar Ali', '+255628000003')

    expect(supabase.from).toHaveBeenCalledWith('beach_signups')
    expect(insertMock).toHaveBeenCalledWith({ name: 'Omar Ali', phone: '+255628000003' })
  })
})

// ── markMemberPaid ────────────────────────────────────────────────────────────
describe('markMemberPaid', () => {
  it('updates member status to active', async () => {
    const updateMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    })
    const insertMock = vi.fn().mockResolvedValue({ data: null, error: null })

    // First call: members table update; second call: payments table insert
    vi.mocked(supabase.from)
      .mockReturnValueOnce({ update: updateMock } as any)
      .mockReturnValueOnce({ insert: insertMock } as any)

    await markMemberPaid('member-1', 50000, 'M-Pesa')

    expect(supabase.from).toHaveBeenCalledWith('members')
    const updateArg = updateMock.mock.calls[0][0]
    expect(updateArg.status).toBe('active')
  })

  it('inserts a payment row with the correct amount and method', async () => {
    const updateMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    })
    const insertMock = vi.fn().mockResolvedValue({ data: null, error: null })

    vi.mocked(supabase.from)
      .mockReturnValueOnce({ update: updateMock } as any)
      .mockReturnValueOnce({ insert: insertMock } as any)

    await markMemberPaid('member-2', 75000, 'cash')

    expect(supabase.from).toHaveBeenCalledWith('payments')
    const paymentArg = insertMock.mock.calls[0][0]
    expect(paymentArg.amount).toBe(75000)
    expect(paymentArg.method).toBe('cash')
    expect(paymentArg.status).toBe('paid')
    expect(paymentArg.member_id).toBe('member-2')
  })
})

// ── getAdminOverview ──────────────────────────────────────────────────────────
describe('getAdminOverview', () => {
  function makeProfilesAndMembers(memberData: Array<{ id: string; status: string; fee_amount: number }>) {
    const profiles = memberData.map((m) => ({
      id: m.id,
      name: `Member ${m.id}`,
      location: 'Stone Town',
      role: 'member',
    }))
    return { profiles, members: memberData.map((m) => ({ ...m, due_date: '2026-10-01', sessions_this_month: 4 })) }
  }

  it('returns correct active, due and overdue counts', async () => {
    const { profiles, members } = makeProfilesAndMembers([
      { id: 'a', status: 'active', fee_amount: 50000 },
      { id: 'b', status: 'active', fee_amount: 50000 },
      { id: 'c', status: 'due', fee_amount: 50000 },
      { id: 'd', status: 'overdue', fee_amount: 50000 },
    ])

    vi.mocked(supabase.from)
      .mockReturnValueOnce({
        select: vi.fn().mockResolvedValue({ data: profiles, error: null }),
      } as any)
      .mockReturnValueOnce({
        select: vi.fn().mockResolvedValue({ data: members, error: null }),
      } as any)

    const result = await getAdminOverview()

    expect(result.active).toBe(2)
    expect(result.due).toBe(1)
    expect(result.overdue).toBe(1)
    expect(result.total).toBe(4)
  })

  it('returns zero counts when there are no members', async () => {
    vi.mocked(supabase.from)
      .mockReturnValueOnce({
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any)
      .mockReturnValueOnce({
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any)

    const result = await getAdminOverview()

    expect(result.active).toBe(0)
    expect(result.due).toBe(0)
    expect(result.overdue).toBe(0)
    expect(result.total).toBe(0)
  })

  it('filters by location when provided', async () => {
    const profiles = [
      { id: 'x', name: 'X', location: 'Stone Town', role: 'member' },
      { id: 'y', name: 'Y', location: 'Kiwengwa', role: 'member' },
    ]
    const members = [
      { id: 'x', status: 'active', fee_amount: 50000, due_date: '2026-10-01', sessions_this_month: 2 },
      { id: 'y', status: 'active', fee_amount: 50000, due_date: '2026-10-01', sessions_this_month: 2 },
    ]

    vi.mocked(supabase.from)
      .mockReturnValueOnce({
        select: vi.fn().mockResolvedValue({ data: profiles, error: null }),
      } as any)
      .mockReturnValueOnce({
        select: vi.fn().mockResolvedValue({ data: members, error: null }),
      } as any)

    const result = await getAdminOverview('Stone Town')

    // Only the Stone Town member should be counted
    expect(result.total).toBe(1)
    expect(result.active).toBe(1)
  })
})
