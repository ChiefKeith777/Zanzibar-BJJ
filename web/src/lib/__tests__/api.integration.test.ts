/**
 * Integration tests for api.ts functions using MSW to intercept Supabase REST calls.
 *
 * We use vi.mock with a factory to create a fresh Supabase client pointing at
 * our local MSW intercept URL (http://localhost:54321) before any api imports.
 */
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { vi } from 'vitest'

const TEST_URL = 'http://localhost:54321'
const TEST_KEY = 'test-key'

// vi.mock is hoisted — the factory must be self-contained (no outer variables)
// Path is relative to THIS file: src/lib/__tests__/ → ../supabase = src/lib/supabase
vi.mock('../supabase', async () => {
  const { createClient } = await import('@supabase/supabase-js')
  return {
    supabase: createClient('http://localhost:54321', 'test-key'),
  }
})

import { server } from '../../test/msw/server'
import { resetStore, seedStore, getStore } from '../../test/msw/handlers'
import {
  submitBooking,
  submitBeachSignup,
  markMemberPaid,
  getAdminOverview,
  approveMember,
  getPendingMembers,
} from '../api'

// ── MSW lifecycle ─────────────────────────────────────────────────────────────
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => {
  server.resetHandlers()
  resetStore()
})
afterAll(() => server.close())

// ── submitBooking ─────────────────────────────────────────────────────────────
describe('submitBooking (integration)', () => {
  it('success: inserts booking row into store', async () => {
    const { error } = await submitBooking({
      name: 'Amina Hassan',
      phone: '+255628000001',
      location: 'Stone Town',
      program: 'Adults',
      news_opt_in: true,
    })

    expect(error).toBeNull()
    const bookings = getStore()['bookings']
    expect(bookings).toHaveLength(1)
    expect(bookings[0]['name']).toBe('Amina Hassan')
    expect(bookings[0]['phone']).toBe('+255628000001')
  })

  it('missing name → handler returns 400-like error', async () => {
    const response = await fetch(`${TEST_URL}/rest/v1/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: TEST_KEY },
      body: JSON.stringify({
        phone: '+255628000001',
        location: 'Stone Town',
        program: 'Adults',
        news_opt_in: true,
      }),
    })
    expect(response.status).toBe(400)
    const body = await response.json() as { message: string }
    expect(body.message).toMatch(/Missing required fields/)
  })
})

// ── submitBeachSignup ─────────────────────────────────────────────────────────
describe('submitBeachSignup (integration)', () => {
  it('inserts name and phone into beach_signups', async () => {
    const { error } = await submitBeachSignup('Omar Ali', '+255628000003')
    expect(error).toBeNull()
    const signups = getStore()['beach_signups']
    expect(signups).toHaveLength(1)
    expect(signups[0]['name']).toBe('Omar Ali')
    expect(signups[0]['phone']).toBe('+255628000003')
  })
})

// ── markMemberPaid ────────────────────────────────────────────────────────────
describe('markMemberPaid (integration)', () => {
  it('updates member status to active', async () => {
    seedStore('members', [{
      id: 'member-1',
      status: 'due',
      fee_amount: 50000,
      belt: 'White Belt',
      stripes: 0,
      sessions_this_month: 2,
      due_date: '2026-09-01',
      updated_at: new Date().toISOString(),
    }])

    await markMemberPaid('member-1', 50000, 'M-Pesa')
    const members = getStore()['members']
    const member = members.find((m) => m['id'] === 'member-1')
    expect(member?.['status']).toBe('active')
  })

  it('inserts a payment row with correct amount, method and status', async () => {
    seedStore('members', [{
      id: 'member-1',
      status: 'due',
      fee_amount: 50000,
      belt: 'White Belt',
      stripes: 0,
      sessions_this_month: 2,
      due_date: '2026-09-01',
      updated_at: new Date().toISOString(),
    }])

    await markMemberPaid('member-1', 75000, 'cash')
    const payments = getStore()['payments']
    const payment = payments.find(
      (p) => p['member_id'] === 'member-1' && p['amount'] === 75000
    )
    expect(payment).toBeDefined()
    expect(payment?.['method']).toBe('cash')
    expect(payment?.['status']).toBe('paid')
  })
})

// ── getAdminOverview ──────────────────────────────────────────────────────────
describe('getAdminOverview (integration)', () => {
  it('returns correct counts from real HTTP calls', async () => {
    seedStore('profiles', [
      { id: 'a', name: 'Alice', role: 'member', location: 'Stone Town', email: 'a@test.com', phone: null, program: null, emergency: null, joined_date: null, created_at: new Date().toISOString() },
      { id: 'b', name: 'Bob', role: 'member', location: 'Stone Town', email: 'b@test.com', phone: null, program: null, emergency: null, joined_date: null, created_at: new Date().toISOString() },
      { id: 'c', name: 'Carol', role: 'member', location: 'Stone Town', email: 'c@test.com', phone: null, program: null, emergency: null, joined_date: null, created_at: new Date().toISOString() },
    ])
    seedStore('members', [
      { id: 'a', status: 'active', fee_amount: 30000 },
      { id: 'b', status: 'due', fee_amount: 30000 },
      { id: 'c', status: 'overdue', fee_amount: 30000 },
    ])

    const result = await getAdminOverview()
    expect(result.total).toBe(3)
    expect(result.active).toBe(1)
    expect(result.due).toBe(1)
    expect(result.overdue).toBe(1)
    expect(result.revenue).toBe(30000)
  })

  it('location filter returns only matching members', async () => {
    seedStore('profiles', [
      { id: 'x', name: 'Xavier', role: 'member', location: 'Stone Town', email: 'x@test.com', phone: null, program: null, emergency: null, joined_date: null, created_at: new Date().toISOString() },
      { id: 'y', name: 'Yara', role: 'member', location: 'Kiwengwa', email: 'y@test.com', phone: null, program: null, emergency: null, joined_date: null, created_at: new Date().toISOString() },
    ])
    seedStore('members', [
      { id: 'x', status: 'active', fee_amount: 30000 },
      { id: 'y', status: 'active', fee_amount: 30000 },
    ])

    const result = await getAdminOverview('Stone Town')
    expect(result.total).toBe(1)
    expect(result.active).toBe(1)
  })
})

// ── approveMember ─────────────────────────────────────────────────────────────
describe('approveMember (integration)', () => {
  it('updates profile role to member and creates members row', async () => {
    seedStore('profiles', [{
      id: 'pending-1',
      name: 'New Member',
      role: 'pending',
      location: 'Stone Town',
      email: 'new@test.com',
      phone: null,
      program: null,
      emergency: null,
      joined_date: null,
      created_at: new Date().toISOString(),
    }])

    await approveMember('pending-1', 30000)

    const profiles = getStore()['profiles']
    const profile = profiles.find((p) => p['id'] === 'pending-1')
    expect(profile?.['role']).toBe('member')

    const members = getStore()['members']
    const member = members.find((m) => m['id'] === 'pending-1')
    expect(member).toBeDefined()
  })
})

// ── getPendingMembers ─────────────────────────────────────────────────────────
describe('getPendingMembers (integration)', () => {
  it('returns only profiles with role=pending', async () => {
    seedStore('profiles', [
      { id: 'p1', name: 'Pending One', role: 'pending', location: null, email: 'p1@test.com', phone: null, program: null, emergency: null, joined_date: null, created_at: new Date().toISOString() },
      { id: 'p2', name: 'Active Member', role: 'member', location: null, email: 'p2@test.com', phone: null, program: null, emergency: null, joined_date: null, created_at: new Date().toISOString() },
    ])

    const { data, error } = await getPendingMembers()
    expect(error).toBeNull()
    expect(data).toHaveLength(1)
    expect(data?.[0]?.role).toBe('pending')
  })
})
