import { http, HttpResponse } from 'msw'

// ── In-memory store ───────────────────────────────────────────────────────────

type Row = Record<string, unknown>

const store: Record<string, Row[]> = {
  profiles: [],
  members: [],
  payments: [],
  bookings: [],
  beach_signups: [],
  alert_rules: [],
  curriculum: [],
  schedule: [],
  attendance: [],
}

export function getStore() {
  return store
}

export function resetStore() {
  for (const key of Object.keys(store)) {
    store[key] = []
  }
}

export function seedStore(table: string, rows: Row[]) {
  store[table] = [...rows]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = 'http://localhost:54321'

function parseFilters(url: URL): Record<string, string> {
  const filters: Record<string, string> = {}
  url.searchParams.forEach((value, key) => {
    // Supabase sends filters as ?column=eq.value
    if (key !== 'select' && key !== 'order' && key !== 'limit') {
      filters[key] = value
    }
  })
  return filters
}

function applyFilters(rows: Row[], filters: Record<string, string>): Row[] {
  return rows.filter((row) => {
    for (const [col, rawVal] of Object.entries(filters)) {
      // e.g. eq.active, neq.value
      const match = rawVal.match(/^(eq|neq|lt|lte|gt|gte)\.(.*)$/)
      if (!match) continue
      const [, op, val] = match
      const rowVal = String(row[col] ?? '')
      if (op === 'eq'  && rowVal !== val)  return false
      if (op === 'neq' && rowVal === val)  return false
      if (op === 'lt'  && !(rowVal < val)) return false
      if (op === 'gt'  && !(rowVal > val)) return false
    }
    return true
  })
}

// ── Handlers ──────────────────────────────────────────────────────────────────

function tableHandlers(table: string) {
  return [
    // GET /rest/v1/{table}
    http.get(`${SUPABASE_URL}/rest/v1/${table}`, ({ request }) => {
      const url = new URL(request.url)
      const filters = parseFilters(url)
      const rows = applyFilters(store[table] ?? [], filters)
      return HttpResponse.json(rows)
    }),

    // POST /rest/v1/{table} — insert
    http.post(`${SUPABASE_URL}/rest/v1/${table}`, async ({ request }) => {
      const body = await request.json() as Row | Row[]
      const rows = Array.isArray(body) ? body : [body]

      // Validate required fields for bookings
      if (table === 'bookings') {
        for (const row of rows) {
          if (!row['name'] || !row['phone']) {
            return HttpResponse.json(
              { message: 'Missing required fields: name, phone', code: '23502' },
              { status: 400 }
            )
          }
        }
      }

      const inserted = rows.map((r) => ({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...r,
      }))
      store[table] = [...(store[table] ?? []), ...inserted]
      return HttpResponse.json(inserted, { status: 201 })
    }),

    // PATCH /rest/v1/{table} — update
    http.patch(`${SUPABASE_URL}/rest/v1/${table}`, async ({ request }) => {
      const url = new URL(request.url)
      const filters = parseFilters(url)
      const patch = await request.json() as Row

      const updated: Row[] = []
      store[table] = (store[table] ?? []).map((row) => {
        const matches = applyFilters([row], filters).length > 0
        if (matches) {
          const newRow = { ...row, ...patch }
          updated.push(newRow)
          return newRow
        }
        return row
      })
      return HttpResponse.json(updated)
    }),
  ]
}

const tables = [
  'profiles', 'members', 'payments', 'bookings',
  'beach_signups', 'alert_rules', 'curriculum', 'schedule', 'attendance',
]

export const handlers = tables.flatMap(tableHandlers)
