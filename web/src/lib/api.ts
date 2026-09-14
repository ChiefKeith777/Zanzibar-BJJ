import { supabase } from './supabase'
import type {
  Profile, Member, Curriculum,
  Schedule, Booking, AlertRule,
} from './database.types'

// ── Profiles ────────────────────────────────────────────────
export async function getProfile(id: string) {
  return supabase.from('profiles').select('*').eq('id', id).single()
}

export async function updateProfile(id: string, data: Partial<Profile>) {
  return supabase.from('profiles').update(data).eq('id', id)
}

export async function getAllProfiles() {
  return supabase.from('profiles').select('*, members(*)').order('name')
}

export async function updateProfileRole(id: string, role: Profile['role']) {
  return supabase.from('profiles').update({ role }).eq('id', id)
}

// ── Members ─────────────────────────────────────────────────
export async function getMember(id: string) {
  return supabase.from('members').select('*').eq('id', id).single()
}

export async function upsertMember(data: Partial<Member> & { id: string }) {
  return supabase.from('members').upsert(data)
}

export async function updateMemberStatus(id: string, status: Member['status']) {
  return supabase.from('members').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
}

export async function markMemberPaid(id: string, amount: number, method: string) {
  const dueDate = new Date()
  dueDate.setMonth(dueDate.getMonth() + 1)

  await supabase.from('members').update({
    status: 'active',
    due_date: dueDate.toISOString().split('T')[0],
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  return supabase.from('payments').insert({
    member_id: id,
    amount,
    method,
    paid_date: new Date().toISOString().split('T')[0],
    status: 'paid',
  })
}

// ── Payments ─────────────────────────────────────────────────
export async function getMemberPayments(memberId: string) {
  return supabase
    .from('payments')
    .select('*')
    .eq('member_id', memberId)
    .order('paid_date', { ascending: false })
    .limit(20)
}

export async function getAllPayments(month?: string) {
  let q = supabase.from('payments').select('*, profiles(name, location)')
  if (month) {
    const start = `${month}-01`
    const end   = `${month}-31`
    q = q.gte('paid_date', start).lte('paid_date', end)
  }
  return q.order('paid_date', { ascending: false })
}

// ── Attendance ───────────────────────────────────────────────
export async function getMemberAttendance(memberId: string) {
  return supabase
    .from('attendance')
    .select('*')
    .eq('member_id', memberId)
    .order('class_date', { ascending: false })
    .limit(60)
}

export async function logAttendance(memberId: string, location: string, classType: string) {
  return supabase.from('attendance').insert({
    member_id: memberId,
    class_date: new Date().toISOString().split('T')[0],
    location,
    class_type: classType,
  })
}

// ── Curriculum ───────────────────────────────────────────────
export async function getCurriculum(program: Curriculum['program']) {
  return supabase
    .from('curriculum')
    .select('*')
    .eq('program', program)
    .order('week')
}

export async function upsertCurriculumWeek(data: Omit<Curriculum, 'id' | 'updated_at'>) {
  return supabase.from('curriculum').upsert(data, { onConflict: 'program,week' })
}

export async function deleteCurriculumWeek(id: string) {
  return supabase.from('curriculum').delete().eq('id', id)
}

// ── Site content ─────────────────────────────────────────────
export async function getSiteContent() {
  return supabase.from('site_content').select('*')
}

export async function upsertSiteContent(key: string, value: string, updatedBy: string) {
  return supabase.from('site_content').upsert(
    { key, value, updated_at: new Date().toISOString(), updated_by: updatedBy },
    { onConflict: 'key' }
  )
}

// ── Schedule ─────────────────────────────────────────────────
export async function getSchedule() {
  return supabase.from('schedule').select('*').order('location').order('day')
}

export async function upsertScheduleRow(data: Omit<Schedule, 'id' | 'updated_at'>) {
  return supabase.from('schedule').upsert(data)
}

export async function deleteScheduleRow(id: string) {
  return supabase.from('schedule').delete().eq('id', id)
}

// ── Bookings ─────────────────────────────────────────────────
export async function submitBooking(data: {
  name: string; phone: string; location: string; program: string
  kid_name?: string; kid_age?: string; kid_exp?: string; news_opt_in: boolean
}) {
  return supabase.from('bookings').insert(data)
}

export async function getBookings(status?: Booking['status']) {
  let q = supabase.from('bookings').select('*')
  if (status) q = q.eq('status', status)
  return q.order('created_at', { ascending: false })
}

export async function updateBookingStatus(id: string, status: Booking['status'], notes?: string) {
  return supabase.from('bookings').update({ status, notes }).eq('id', id)
}

// ── Beach signups ─────────────────────────────────────────────
export async function submitBeachSignup(name: string, phone: string) {
  return supabase.from('beach_signups').insert({ name, phone })
}

export async function getBeachSignups() {
  return supabase.from('beach_signups').select('*').order('created_at', { ascending: false })
}

// ── Alert rules ───────────────────────────────────────────────
export async function getAlertRules() {
  return supabase.from('alert_rules').select('*').order('trigger_key')
}

export async function updateAlertRule(id: string, data: Partial<AlertRule>) {
  return supabase.from('alert_rules').update(data).eq('id', id)
}

// ── Notification log ──────────────────────────────────────────
export async function getNotificationLog(limit = 50) {
  return supabase
    .from('notification_log')
    .select('*, profiles(name)')
    .order('sent_at', { ascending: false })
    .limit(limit)
}

// ── Admin overview stats ──────────────────────────────────────
export async function getAdminOverview(location?: string) {
  const profilesQ = supabase.from('profiles').select('id, name, location, role')
  const membersQ  = supabase.from('members').select('id, status, fee_amount, due_date, sessions_this_month')

  const [{ data: profiles }, { data: members }] = await Promise.all([
    profilesQ,
    membersQ,
  ])

  const memberProfiles = (profiles ?? []).filter(p => p.role === 'member')
  const filtered = location && location !== 'all'
    ? memberProfiles.filter(p => p.location === location)
    : memberProfiles

  const ids = new Set(filtered.map(p => p.id))
  const filteredMembers = (members ?? []).filter(m => ids.has(m.id))

  const active   = filteredMembers.filter(m => m.status === 'active').length
  const due      = filteredMembers.filter(m => m.status === 'due').length
  const overdue  = filteredMembers.filter(m => m.status === 'overdue').length
  const revenue  = filteredMembers.filter(m => m.status === 'active').reduce((s, m) => s + m.fee_amount, 0)

  return { total: filteredMembers.length, active, due, overdue, revenue }
}
