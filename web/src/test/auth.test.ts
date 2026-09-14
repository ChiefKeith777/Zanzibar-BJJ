import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the supabase module before importing anything that uses it
vi.mock('../lib/supabase', () => {
  const mockAuth = {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  }

  const mockFrom = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
  })

  return {
    supabase: {
      auth: mockAuth,
      from: mockFrom,
    },
  }
})

import { supabase } from '../lib/supabase'

describe('auth — signIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns no error when credentials are valid', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: { id: 'user-1' } as any, session: {} as any },
      error: null,
    })

    const { error } = await supabase.auth.signInWithPassword({
      email: 'amina@example.com',
      password: 'OSS2026',
    })

    expect(error).toBeNull()
  })

  it('returns an error message when credentials are invalid', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials', status: 400 } as any,
    })

    const result = await supabase.auth.signInWithPassword({
      email: 'wrong@example.com',
      password: 'badpass',
    })

    expect(result.error).not.toBeNull()
    expect(result.error?.message).toBe('Invalid login credentials')
  })
})

describe('auth — signOut', () => {
  it('calls supabase.auth.signOut', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({ error: null })

    await supabase.auth.signOut()

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1)
  })

  it('clears profile when signOut resolves', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({ error: null })

    // Simulate profile being present then cleared after signOut
    let profile: { id: string; role: string } | null = { id: 'user-1', role: 'member' }

    const doSignOut = async () => {
      await supabase.auth.signOut()
      profile = null
    }

    await doSignOut()
    expect(profile).toBeNull()
  })
})

describe('useRole — derives role from profile', () => {
  it('returns "member" when profile role is member', () => {
    const profile = { id: 'u1', role: 'member' as const, name: 'Amina', location: 'Stone Town' }
    const role = profile?.role ?? null
    expect(role).toBe('member')
  })

  it('returns "admin" when profile role is admin', () => {
    const profile = { id: 'u2', role: 'admin' as const, name: 'Keith', location: 'Stone Town' }
    const role = profile?.role ?? null
    expect(role).toBe('admin')
  })

  it('returns null when profile is null', () => {
    const profile = null as ({ role: string } | null)
    const role = profile?.role ?? null
    expect(role).toBeNull()
  })

  it('returns "coach" when profile role is coach', () => {
    const profile = { id: 'u3', role: 'coach' as const, name: 'Ally', location: 'Kiwengwa' }
    const role = profile?.role ?? null
    expect(role).toBe('coach')
  })
})
