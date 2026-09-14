import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../components/Header'

// Mock auth so supabase is never initialized in tests
vi.mock('../lib/auth', () => ({
  useAuth: vi.fn().mockReturnValue({
    user: null,
    profile: null,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    signInWithGoogle: vi.fn(),
    signInWithMicrosoft: vi.fn(),
    signUp: vi.fn(),
    refreshProfile: vi.fn(),
  }),
}))

// Mock the shared translations
vi.mock('../../../shared/content/translations', () => ({
  dict: {
    en: {
      navFree: 'FREE CLASS',
      signIn: 'Sign in',
      myAccount: 'My account',
    },
    sw: {
      navFree: 'DARASA BURE',
      signIn: 'Ingia',
      myAccount: 'Akaunti yangu',
    },
  },
}))

// Mock the logo import
vi.mock('../assets/logo-circle.png', () => ({ default: 'logo-circle.png' }))

function makeProps(overrides: Partial<Parameters<typeof Header>[0]> = {}) {
  return {
    lang: 'en' as const,
    setLang: vi.fn(),
    setPage: vi.fn(),
    page: 'home' as const,
    isLoggedIn: false,
    userRole: null,
    ...overrides,
  }
}

describe('Header', () => {
  it('renders the "ZANZIBAR BJJ" brand text', () => {
    render(<Header {...makeProps()} />)
    expect(screen.getByText('Zanzibar BJJ')).toBeInTheDocument()
  })

  it('renders the FREE CLASS button', () => {
    render(<Header {...makeProps()} />)
    expect(screen.getByText('FREE CLASS')).toBeInTheDocument()
  })

  it('clicking the FREE CLASS button calls setPage with "contact"', () => {
    const setPage = vi.fn()
    render(<Header {...makeProps({ setPage })} />)

    fireEvent.click(screen.getByText('FREE CLASS'))

    expect(setPage).toHaveBeenCalledWith('contact')
  })

  it('EN/SW toggle calls setLang when SW is clicked', () => {
    const setLang = vi.fn()
    render(<Header {...makeProps({ setLang })} />)

    // Both EN and SW buttons are rendered
    const swButton = screen.getByText('SW')
    fireEvent.click(swButton)

    expect(setLang).toHaveBeenCalledWith('sw')
  })

  it('EN/SW toggle calls setLang when EN is clicked', () => {
    const setLang = vi.fn()
    render(<Header {...makeProps({ lang: 'sw', setLang })} />)

    const enButton = screen.getByText('EN')
    fireEvent.click(enButton)

    expect(setLang).toHaveBeenCalledWith('en')
  })

  it('shows "Sign in" button when isLoggedIn is false', () => {
    render(<Header {...makeProps({ isLoggedIn: false })} />)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('shows "My Account" button when isLoggedIn is true', () => {
    render(<Header {...makeProps({ isLoggedIn: true })} />)
    expect(screen.getByText('My Account')).toBeInTheDocument()
  })

  it('does not show "Sign in" button when isLoggedIn is true', () => {
    render(<Header {...makeProps({ isLoggedIn: true })} />)
    expect(screen.queryByText('Sign in')).not.toBeInTheDocument()
  })

  it('shows Admin badge when userRole is admin', () => {
    render(<Header {...makeProps({ isLoggedIn: true, userRole: 'admin' })} />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('does not show Admin badge for a regular member', () => {
    render(<Header {...makeProps({ isLoggedIn: true, userRole: 'member' })} />)
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })

  it('clicking the logo calls setPage with "home"', () => {
    const setPage = vi.fn()
    render(<Header {...makeProps({ setPage })} />)

    // The logo button wraps the "Zanzibar BJJ" text
    const logoButton = screen.getByRole('button', { name: /zanzibar bjj/i })
    fireEvent.click(logoButton)

    expect(setPage).toHaveBeenCalledWith('home')
  })
})
