import { env } from "../config/env"


const cache = new Map()
let cachePopulated = false

async function populateCache() {
  if (cachePopulated) return

  const url = `${env.COUNTRIES_API_BASE}/all?fields=name,currencies`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(
      `[CountriesClient] Failed to fetch countries: ${res.status} ${res.statusText}`
    )
  }

  const countries = await res.json()

  for (const country of countries) {
    if (!country.currencies) continue

    const [code, details] = Object.entries(country.currencies)[0]

    const entry = {
      currencyCode: code,
      currencySymbol: details.symbol || code,
      currencyName: details.name || code,
    }

    cache.set(country.name.common.toLowerCase(), entry)
    cache.set(country.name.official.toLowerCase(), entry)
  }

  cachePopulated = true
}


/**
 Returns currency info for a given country name
 { currencyCode: 'INR', currencySymbol: '₹', currencyName: 'Indian rupee' }
 */
export async function getCurrencyByCountry(
  countryName
) {
  await populateCache()

  const result = cache.get(countryName.toLowerCase())

  if (!result) {
    throw new Error(
      `[CountriesClient] No currency found for country: "${countryName}". ` +
      `Please use the exact country name as returned by the countries API.`
    )
  }

  return result
}

/*Returns all available country names (for validation / dropdown)*/
export async function getAllCountryNames() {
  await populateCache()

  const url = `${env.COUNTRIES_API_BASE}/all?fields=name`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`[CountriesClient] Failed to fetch country names`)
  }

  const countries = await res.json()
  return countries.map((c) => c.name.common).sort()
}