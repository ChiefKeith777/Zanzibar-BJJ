import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Contact from '../pages/Contact'

// Mock submitBooking so tests run without a real DB
vi.mock('../lib/api', () => ({
  submitBooking: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

// Mock the shared content modules so they resolve in jsdom
vi.mock('../../../shared/content/translations', () => ({
  dict: {
    en: {
      navFree: 'FREE CLASS',
      heroKicker: 'Brazilian Jiu Jitsu · Zanzibar, Tanzania',
      heroA: 'Jiu Jitsu for',
      heroB: 'Zanzibar.',
      heroSub: 'First class is free.',
      ctaFree: 'Book Free First Class',
      signIn: 'Sign in',
      contactKick: 'Get started',
      funnelTitle: 'Your first class is free.',
      funnelSub: 'Fill in the form and we will confirm your spot.',
      bene1: 'No experience needed', bene2: 'Gis to borrow', bene3: 'Kids and adults',
      fName: 'Your name', fPhone: 'Phone (WhatsApp)', fLoc: 'Choose a location', fProg: 'Choose a program',
      progAdults: 'Adults', progK47: 'Little Champs (4–7)', progK812: 'Kids (8–12)', progT1316: 'Teens (13–16)',
      fSubmit: 'Book my free class',
      formErr: 'Please enter your name and phone number.',
      waInstead: 'Prefer WhatsApp? Message us directly →',
      successTitle: 'Asante! Request received.',
      successBody: 'Your request goes straight to the ZanFit office.',
      confirmWa: 'Confirm on WhatsApp',
      another: 'Submit another request',
      kidsFieldsTitle: 'About your child',
      fKidName: "Child's name", fKidAge: "Child's age", fKidExp: 'Any previous experience?',
      expNone: 'Complete beginner', expSome: 'Tried it a few times', expLots: 'Trains already',
      newsOptIn: 'Notify me about beach training and events on WhatsApp',
    },
  },
}))

vi.mock('../../../shared/content/data', () => ({
  VENUES: [
    { id: 'stone', name: 'Stone Town' },
    { id: 'kiwengwa', name: 'Kiwengwa' },
    { id: 'jambiani', name: 'Jambiani' },
    { id: 'fumba', name: 'Fumba Town' },
  ],
  WA_HREF: 'https://wa.me/255628031317',
}))

const defaultProps = {
  lang: 'en' as const,
  setPage: vi.fn(),
}

describe('Contact form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders name, phone, location and program inputs', () => {
    render(<Contact {...defaultProps} />)

    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('+255 000 000 000')).toBeInTheDocument()
    expect(screen.getAllByText('Choose a location')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Choose a program')[0]).toBeInTheDocument()
  })

  it('shows error when submitting without a name', async () => {
    render(<Contact {...defaultProps} />)

    fireEvent.click(screen.getByText('Book my free class'))

    await waitFor(() => {
      expect(screen.getByText('Please enter your name and phone number.')).toBeInTheDocument()
    })
  })

  it('shows error when submitting without a phone number', async () => {
    render(<Contact {...defaultProps} />)

    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'Amina Hassan' },
    })
    fireEvent.click(screen.getByText('Book my free class'))

    await waitFor(() => {
      expect(screen.getByText('Please enter your name and phone number.')).toBeInTheDocument()
    })
  })

  it('submits and shows success when name and phone are filled', async () => {
    render(<Contact {...defaultProps} />)

    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'Amina Hassan' },
    })
    fireEvent.change(screen.getByPlaceholderText('+255 000 000 000'), {
      target: { value: '+255628000001' },
    })

    // Select location
    const locationSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(locationSelect, { target: { value: 'Stone Town' } })

    // Select program
    const programSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(programSelect, { target: { value: 'Adults' } })

    fireEvent.click(screen.getByText('Book my free class'))

    await waitFor(() => {
      expect(screen.getByText('Asante! Request received.')).toBeInTheDocument()
    })
  })

  it('shows success heading after valid submission', async () => {
    render(<Contact {...defaultProps} />)

    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'Omar Said' },
    })
    fireEvent.change(screen.getByPlaceholderText('+255 000 000 000'), {
      target: { value: '+255628000002' },
    })

    fireEvent.click(screen.getByText('Book my free class'))

    await waitFor(() => {
      expect(screen.getByText('Asante! Request received.')).toBeInTheDocument()
    })
  })

  it('reveals child fields when a kids program is selected', async () => {
    render(<Contact {...defaultProps} />)

    const programSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(programSelect, { target: { value: 'Little Champs (4–7)' } })

    await waitFor(() => {
      expect(screen.getByText('About your child')).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Child's name")).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Age')).toBeInTheDocument()
    })
  })

  it('shows the WhatsApp prefer link', () => {
    render(<Contact {...defaultProps} />)
    expect(screen.getByText('Prefer WhatsApp? Message us directly →')).toBeInTheDocument()
  })
})
