import { env } from '../config/env'
import { CURRENCY } from '../config/constants'

const rateCache = new Map()

async function fetchRates(baseCurrency) {
  const url = `${env.EXCHANGE_RATE_API_BASE}/${baseCurrency.toUpperCase()}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(
      `[CurrencyClient] Failed to fetch rates for base "${baseCurrency}": ` +
      `${res.status} ${res.statusText}`
    )
  }

  const data = await res.json()
  if (!data.rates) {
    throw new Error(
      `[CurrencyClient] Unexpected response shape from exchange rate API`
    )
  }

  return {
    base:      baseCurrency.toUpperCase(),
    rates:     data.rates,
    fetchedAt: Date.now(),
  }
}

async function getRates(baseCurrency) {
  const cacheKey = baseCurrency.toUpperCase()
  const cached   = rateCache.get(cacheKey)

  const isFresh =
    cached &&
    Date.now() - cached.fetchedAt < CURRENCY.EXCHANGE_RATE_CACHE_TTL_MS

  if (isFresh) return cached

  const fresh = await fetchRates(cacheKey)
  rateCache.set(cacheKey, fresh)
  return fresh
}

/*Converts an amount from one currency to another
{ fromAmount: 8500, fromCurrency: 'INR', toAmount: 102.3, toCurrency: 'USD', rate: 0.01203 }
 */
export async function convert(
  amount,
  fromCurrency,
  toCurrency
) {
  const from = fromCurrency.toUpperCase()
  const to   = toCurrency.toUpperCase()

  if (from === to) {
    return {
      fromAmount:       amount,
      fromCurrency:     from,
      toAmount:         amount,
      toCurrency:       to,
      rate:             1,
      rateSnapshotTime: new Date(),
    }
  }

  const { rates, fetchedAt } = await getRates(from)

  const rate = rates[to]
  if (!rate) {
    throw new Error(
      `[CurrencyClient] No rate found for "${to}" in base "${from}" rates. ` +
      `Currency code may be invalid.`
    )
  }

  const toAmount = parseFloat((amount * rate).toFixed(2))

  return {
    fromAmount:       amount,
    fromCurrency:     from,
    toAmount,
    toCurrency:       to,
    rate,
    rateSnapshotTime: new Date(fetchedAt),
  }
}

/*Returns the raw exchange rate from one currency to another*/
export async function getRate(
  fromCurrency,
  toCurrency
) {
  const from = fromCurrency.toUpperCase()
  const to   = toCurrency.toUpperCase()

  if (from === to) return 1

  const { rates } = await getRates(from)
  const rate = rates[to]

  if (!rate) {
    throw new Error(
      `[CurrencyClient] No rate found for "${to}" in base "${from}"`
    )
  }

  return rate
}

export async function getAvailableCurrencies(
  baseCurrency
) {
  const { rates } = await getRates(baseCurrency)
  return Object.keys(rates).sort()
}

export function invalidateCache(baseCurrency) {
  if (baseCurrency) {
    rateCache.delete(baseCurrency.toUpperCase())
  } else {
    rateCache.clear()
  }
}