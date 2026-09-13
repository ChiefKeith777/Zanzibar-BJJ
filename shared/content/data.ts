export const WA_NUMBER = '+255628031317'
export const WA_HREF = `https://wa.me/${WA_NUMBER.replace(/\s+/g, '')}`
export const WA_PRIVATE_HREF = `${WA_HREF}?text=${encodeURIComponent('Hi, I am interested in a private beach BJJ session.')}`

export const HERO_IMAGES = [
  'hero-1.jpg','hero-2.jpg','hero-3.jpg',
  'hero-4.jpg','hero-5.jpg','hero-6.jpg',
]

export const LOC_CHIPS = ['Stone Town', 'Kiwengwa', 'Jambiani', 'Fumba Town']

export const MARQUEE_ITEMS = [
  'Brazilian Jiu Jitsu',
  'Zanzibar',
  'Stone Town',
  'Kiwengwa',
  'Jambiani',
  'Fumba Town',
]

export const VENUES = [
  {
    id: 'stone',
    name: 'Stone Town',
    img: 'loc-stone.jpg',
    isNew: false,
    badge: '',
    places: [{ name: 'House of Muscle', url: 'https://maps.google.com/?q=House+of+Muscle+Stone+Town+Zanzibar' }],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Stone+Town+Zanzibar',
    hasClasses: true,
    gymNote: '',
    lines: [
      { who: 'Adults', when: 'Mon / Wed / Fri · 18:00', color: '#a5dcf3', bg: '#e3f4fb' },
      { who: 'Kids', when: 'Sat · 09:00', color: '#f2dd7a', bg: '#fdf6d8' },
    ],
  },
  {
    id: 'kiwengwa',
    name: 'Kiwengwa',
    img: 'loc-kiwengwa.jpg',
    isNew: false,
    badge: '',
    places: [{ name: 'Kiwengwa Gym', url: 'https://maps.google.com/?q=Kiwengwa+Zanzibar' }],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kiwengwa+Zanzibar',
    hasClasses: true,
    gymNote: '',
    lines: [
      { who: 'Adults', when: 'Tue / Thu · 18:00', color: '#a5dcf3', bg: '#e3f4fb' },
      { who: 'Family', when: 'Sun · 10:00', color: '#a7d9bd', bg: '#e8f6ee' },
    ],
  },
  {
    id: 'jambiani',
    name: 'Jambiani',
    img: 'loc-jambiani.jpg',
    isNew: false,
    badge: '',
    places: [{ name: 'Jambiani Beach Club', url: 'https://maps.google.com/?q=Jambiani+Zanzibar' }],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jambiani+Zanzibar',
    hasClasses: true,
    gymNote: '',
    lines: [
      { who: 'Adults', when: 'Mon / Wed · 17:30', color: '#a5dcf3', bg: '#e3f4fb' },
    ],
  },
  {
    id: 'fumba',
    name: 'Fumba Town',
    img: 'loc-fumba.jpg',
    isNew: true,
    badge: 'New',
    places: [{ name: 'Fumba Town Complex', url: 'https://maps.google.com/?q=Fumba+Town+Zanzibar' }],
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Fumba+Town+Zanzibar',
    hasClasses: false,
    gymNote: '',
    lines: [],
  },
]

export const PROGRAMS = [
  {
    id: 'adults',
    name: 'Adults BJJ',
    tag: 'All levels · 16 and over',
    icon: '🥋',
    img: 'prog-bjj.jpg',
    isEvent: false,
    descEn: 'Our main programme — structured technique, drilling and live rolling. Classes suit complete beginners and experienced practitioners. The curriculum covers guard work, passing, takedowns and submissions following the Roan Jucao grading syllabus.',
    descSw: 'Mpango wetu mkuu — mbinu zilizopangwa, mazoezi ya kuchimba na rolling ya moja kwa moja.',
    ctaLabelEn: 'Book free first class', ctaLabelSw: 'Weka darasa la kwanza bure',
    altLabelEn: 'View schedule', altLabelSw: 'Tazama ratiba',
  },
  {
    id: 'kids',
    name: 'Kids Program',
    tag: 'Ages 4–16 · Three groups',
    icon: '⭐',
    img: 'prog-kids.jpg',
    isEvent: false,
    descEn: 'Age-split classes for Little Champs (4–7), Juniors (8–12) and Teens (13–16). Each group trains technique appropriate for their stage, with a strong emphasis on safety, respect and fun.',
    descSw: 'Madarasa ya umri mgawanyiko kwa Mabingwa Wadogo (4–7), Vijunior (8–12) na Vijana (13–16).',
    ctaLabelEn: 'Book a kids trial', ctaLabelSw: 'Weka jaribio la watoto',
    altLabelEn: 'View schedule', altLabelSw: 'Tazama ratiba',
  },
  {
    id: 'beach',
    name: 'Beach Sessions',
    tag: 'Announced events · All welcome',
    icon: '🌊',
    img: 'prog-beach.jpg',
    isEvent: true,
    descEn: 'Open-air Jiu Jitsu on the sand — the most memorable way to start. Sessions are announced in advance on WhatsApp. Free for first-timers, drop-in rate for returning practitioners.',
    descSw: 'Jiu Jitsu ya nje kwenye mchanga — njia ya kukumbukwa zaidi ya kuanza.',
    ctaLabelEn: 'Get notified', ctaLabelSw: 'Pata taarifa',
    altLabelEn: 'WhatsApp us', altLabelSw: 'Tuandikie WhatsApp',
  },
  {
    id: 'comp',
    name: 'Competition',
    tag: 'Zanzibar Open 2026',
    icon: '🏆',
    img: 'prog-comp.jpg',
    isEvent: true,
    descEn: 'The Zanzibar Open is the island\'s premier BJJ competition. Open to all students who have trained for a minimum of three months. Talk to your coach to register.',
    descSw: 'Zanzibar Open ni mashindano makuu ya BJJ ya kisiwa hiki.',
    ctaLabelEn: 'Register interest', ctaLabelSw: 'Jisajili kwa nia',
    altLabelEn: 'Download rules', altLabelSw: 'Pakua sheria',
  },
]

export interface CalClass {
  title: string
  loc: string
  time: string
  color: string
  bg: string
  border: string
}

export interface CalDay {
  name: string
  classes: CalClass[]
}

export const SCHEDULE_ALL: CalDay[] = [
  {
    name: 'MON',
    classes: [
      { title: 'Adults', loc: 'Stone Town', time: '18:00', bg: '#e3f4fb', border: '#a5dcf3', color: '#1d4d6b' },
      { title: 'Adults', loc: 'Jambiani', time: '17:30', bg: '#e3f4fb', border: '#a5dcf3', color: '#1d4d6b' },
    ],
  },
  {
    name: 'TUE',
    classes: [
      { title: 'Adults', loc: 'Kiwengwa', time: '18:00', bg: '#e3f4fb', border: '#a5dcf3', color: '#1d4d6b' },
    ],
  },
  {
    name: 'WED',
    classes: [
      { title: 'Adults', loc: 'Stone Town', time: '18:00', bg: '#e3f4fb', border: '#a5dcf3', color: '#1d4d6b' },
      { title: 'Adults', loc: 'Jambiani', time: '17:30', bg: '#e3f4fb', border: '#a5dcf3', color: '#1d4d6b' },
    ],
  },
  {
    name: 'THU',
    classes: [
      { title: 'Adults', loc: 'Kiwengwa', time: '18:00', bg: '#e3f4fb', border: '#a5dcf3', color: '#1d4d6b' },
    ],
  },
  {
    name: 'FRI',
    classes: [
      { title: 'Adults', loc: 'Stone Town', time: '18:00', bg: '#e3f4fb', border: '#a5dcf3', color: '#1d4d6b' },
    ],
  },
  {
    name: 'SAT',
    classes: [
      { title: 'Kids', loc: 'Stone Town', time: '09:00', bg: '#fdf6d8', border: '#f2dd7a', color: '#6f5a14' },
    ],
  },
  {
    name: 'SUN',
    classes: [
      { title: 'Family', loc: 'Kiwengwa', time: '10:00', bg: '#e8f6ee', border: '#a7d9bd', color: '#1a5c38' },
    ],
  },
]

export const GYM_PERKS = [
  { loc: 'Stone Town', perk: 'House of Muscle gym access included with all memberships' },
  { loc: 'Kiwengwa', perk: 'Gym access with training membership — ask coach for details' },
  { loc: 'Jambiani', perk: 'Outdoor training area included — gym partnership in progress' },
]

export const MENTORS = [
  {
    id: 1,
    name: 'Prof. Renzo Gracie',
    role: 'Head Mentor · 6th Degree Black Belt',
    initials: 'RG',
    color: '#FCD116',
    bg: '#33322a',
    icon: '🥋',
    teaser: 'One of the most influential figures in Brazilian Jiu Jitsu worldwide, supporting Zanzibar BJJ through the Roan Jucao lineage.',
    paras: [
      'Prof. Renzo Gracie is one of the most celebrated and respected figures in the history of Brazilian Jiu Jitsu. A 6th degree black belt and member of the Gracie family, he has dedicated his life to sharing the art of Jiu Jitsu globally.',
      'Through the Roan Jucao Brazilian Jiu Jitsu Association, he has extended his lineage to Zanzibar, supporting the development of the sport in East Africa and Tanzania.',
      'His teachings form the foundation of every class we run on the island.',
    ],
  },
  {
    id: 2,
    name: 'American Top Team Atlanta',
    role: 'Technical Partner · USA',
    initials: 'AT',
    color: '#00A3DD',
    bg: '#1a2633',
    icon: '🇺🇸',
    teaser: 'Our technical partner and grading authority in the USA, providing curriculum, belt examinations and coaching support to Zanzibar BJJ.',
    paras: [
      'American Top Team Atlanta is one of the premier BJJ and MMA academies in the United States, affiliated with the world-famous American Top Team organisation.',
      'They provide the grading syllabus used in all Zanzibar BJJ classes, conduct belt examinations for our students, and visit the island for masterclasses and workshops.',
      'Students who train with Zanzibar BJJ earn belts that are recognised internationally through the ATT lineage.',
    ],
  },
]

export const TEAM = [
  { name: 'Coach Ali', role: 'Head Coach · Stone Town', initials: 'CA', tbc: false, photo: '' },
  { name: 'Coach Mwana', role: 'Instructor · Kiwengwa', initials: 'CM', tbc: false, photo: 'coach-ally.jpg' },
  { name: 'Coach Hamid', role: 'Instructor · Jambiani', initials: 'CH', tbc: false, photo: '' },
  { name: 'Kids Coach', role: 'Kids Program Lead', initials: 'KC', tbc: true, photo: '' },
  { name: 'Fumba Coach', role: 'Instructor · Fumba Town', initials: 'FC', tbc: true, photo: '' },
]

export const LEARN_VIDEOS = [
  { id: 1, title: 'Armbar from Guard', cat: 'submissions', dur: '3:24', thumb: 'prog-bjj.jpg' },
  { id: 2, title: 'Guard Pass — Torreando', cat: 'passing', dur: '4:10', thumb: 'bjj-3.jpg' },
  { id: 3, title: 'Hip Escape (Shrimping)', cat: 'fundamentals', dur: '2:55', thumb: 'bjj-2.jpg' },
  { id: 4, title: 'Triangle Choke Setup', cat: 'submissions', dur: '5:01', thumb: 'bjj-4.jpg' },
  { id: 5, title: 'Double Leg Takedown', cat: 'takedowns', dur: '3:40', thumb: 'prog-beach.jpg' },
  { id: 6, title: 'Side Control Escape', cat: 'fundamentals', dur: '3:15', thumb: 'strip-1.jpg' },
]

export const ABOUT_PARAS = [
  'Brazilian Jiu Jitsu (BJJ) is a grappling martial art that teaches practitioners to control and submit opponents using leverage, technique and body positioning — not strength. It was developed in Brazil from Japanese Judo and has become one of the world\'s fastest-growing sports.',
  'Unlike striking arts, BJJ has no punching or kicking. Matches are won by taking an opponent to the ground and applying a submission — a joint lock or choke — that causes them to tap out. The absence of strikes makes it one of the safest full-contact sports you can train.',
  'A white belt with six months of consistent training can usually neutralise a larger, stronger untrained attacker. That reality — that technique genuinely beats size — is what draws people to Jiu Jitsu and keeps them training for years.',
  'In Zanzibar, we teach Jiu Jitsu to locals, tourists and children using the Roan Jucao curriculum. Whether you are here for a week or live on the island, you are welcome on the mats.',
]

export const BENEFITS = [
  { h: 'Self-defence that works', b: 'Leverage and technique that function regardless of size or strength difference.' },
  { h: 'Physical fitness', b: 'Full-body conditioning through live sparring and drilling.' },
  { h: 'Mental resilience', b: 'Problem-solving under pressure — the mat is an honest teacher.' },
  { h: 'Community', b: 'A tight-knit group of local and visiting practitioners.' },
  { h: 'Safe for children', b: 'No strikes. Age-matched groups. Structured curriculum.' },
  { h: 'Any fitness level', b: 'Beginners are always welcome. No experience needed to start.' },
]

export const CURRICULUM_WEEKS = {
  fund: [
    { wk: 1, theme: 'Positional Awareness', pts: ['Mount and guard — basic positions', 'How to fall safely', 'Posture in closed guard'] },
    { wk: 2, theme: 'Guard Work', pts: ['Closed guard attacks: armbar, triangle setup', 'Hip escape (shrimp)', 'Basic guard retention'] },
    { wk: 3, theme: 'Passing the Guard', pts: ['Torreando pass', 'Knee slice', 'Dealing with grips'] },
    { wk: 4, theme: 'Side Control & Mount', pts: ['Side control to mount transition', 'Americana and Kimura from mount', 'Upa escape'] },
    { wk: 5, theme: 'Back Control', pts: ['Taking the back', 'Rear naked choke finish', 'Defending the back take'] },
    { wk: 6, theme: 'Takedowns', pts: ['Double leg', 'Single leg', 'Clinch work'] },
    { wk: 7, theme: 'Leg Locks (beginner)', pts: ['Straight ankle lock', 'Defending the ankle lock', 'Heel hook awareness'] },
    { wk: 8, theme: 'Review & Assessment', pts: ['Positional sparring review', 'Drilling test', 'Open mat Q&A'] },
  ],
  kids: [
    { wk: 1, theme: 'Mat Rules & Safety', pts: ['Falling safely', 'Tap out protocol', 'Partner respect'] },
    { wk: 2, theme: 'Movement Games', pts: ['Shrimping race', 'Bear crawl', 'Break-fall fun'] },
    { wk: 3, theme: 'Guard & Mount', pts: ['What is guard?', 'Mount position', 'Simple escape'] },
    { wk: 4, theme: 'Submissions (safe)', pts: ['Armbar from guard (slow drill)', 'Triangle awareness', 'Tap early lesson'] },
  ],
  comp: [
    { wk: 1, theme: 'Competition Rules & Format', pts: ['Points system', 'Advantages', 'Prohibited techniques by belt'] },
    { wk: 2, theme: 'Guard Retention Under Pressure', pts: ['Framing against passes', 'Hip movement drills', 'Lasso and spider guard basics'] },
    { wk: 3, theme: 'Submission Chains', pts: ['Arm triangle to back take', 'Kimura trap series', 'Ankle lock entry from leg drag'] },
    { wk: 4, theme: 'Competition Preparation', pts: ['Match simulation', 'Weight management tips', 'Mental prep and warm-up routine'] },
  ],
}

export const DEMO_MEMBER = {
  name: 'Amina Rashid',
  initial: 'A',
  plan: 'Monthly local · 30,000 TZS',
  loc: 'Stone Town',
  status: 'active' as const,
  fee: '30,000',
  dueLine: 'Due 15 Oct 2026',
  daysLeft: 2,
  sessionsMonth: 8,
  belt: 'White Belt',
  stripes: '2 stripes',
  beltPct: 40,
  gymPerk: 'House of Muscle gym access included with your membership.',
  attendanceNote: 'Great consistency — 8 sessions this month.',
  beltNote: 'Keep training. Your coach will recommend you for stripe 3 when ready.',
  payHref: 'https://wa.me/255628031317?text=I+would+like+to+pay+my+membership',
  details: [
    { k: 'Member since', v: 'March 2026' },
    { k: 'Location', v: 'Stone Town' },
    { k: 'Program', v: 'Adults BJJ' },
    { k: 'Plan', v: 'Monthly local' },
    { k: 'Status', v: 'Active' },
  ],
  weeks: [
    { label: 'W1', pct: 75 }, { label: 'W2', pct: 50 }, { label: 'W3', pct: 100 },
    { label: 'W4', pct: 87 }, { label: 'W5', pct: 62 }, { label: 'W6', pct: 100 },
    { label: 'W7', pct: 75 }, { label: 'W8', pct: 50 },
  ],
  upcoming: [
    { day: 'Mon 14 Oct', time: '18:00', what: 'Adults BJJ · Stone Town' },
    { day: 'Wed 16 Oct', time: '18:00', what: 'Adults BJJ · Stone Town' },
    { day: 'Fri 18 Oct', time: '18:00', what: 'Adults BJJ · Stone Town' },
  ],
  history: [
    { date: '01 Sep 2026', amount: '30,000', method: 'M-Pesa', status: 'Paid' },
    { date: '01 Aug 2026', amount: '30,000', method: 'M-Pesa', status: 'Paid' },
    { date: '01 Jul 2026', amount: '30,000', method: 'Cash', status: 'Paid' },
    { date: '01 Jun 2026', amount: '30,000', method: 'M-Pesa', status: 'Paid' },
    { date: '01 May 2026', amount: '30,000', method: 'Cash', status: 'Paid' },
  ],
}
