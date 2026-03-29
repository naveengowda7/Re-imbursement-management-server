/**
 * "29 Mar 2026"
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(new Date(date))
}

/**
 * "29 Mar 2026, 14:35"
 */
export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date))
}

export function toISODate(date) {
  return new Date(date).toISOString().split('T')[0]
}

export function timeAgo(date) {
  const rtf    = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diff   = new Date(date).getTime() - Date.now() // negative = past
  const absDiff = Math.abs(diff)

  const MINUTE = 60 * 1000
  const HOUR   = 60 * MINUTE
  const DAY    = 24 * HOUR
  const WEEK   = 7  * DAY
  const MONTH  = 30 * DAY
  const YEAR   = 365 * DAY

  if (absDiff < MINUTE)  return 'just now'
  if (absDiff < HOUR)    return rtf.format(-Math.floor(absDiff / MINUTE),  'minute')
  if (absDiff < DAY)     return rtf.format(-Math.floor(absDiff / HOUR),    'hour')
  if (absDiff < WEEK)    return rtf.format(-Math.floor(absDiff / DAY),     'day')
  if (absDiff < MONTH)   return rtf.format(-Math.floor(absDiff / WEEK),    'week')
  if (absDiff < YEAR)    return rtf.format(-Math.floor(absDiff / MONTH),   'month')
  return rtf.format(-Math.floor(absDiff / YEAR), 'year')
}

export function daysFromNow(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

export function minutesFromNow(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000)
}

export function isPast(date) {
  return new Date(date).getTime() < Date.now()
}

export function isFuture(date) {
  return new Date(date).getTime() > Date.now()
}

export function startOfDay(date){
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}