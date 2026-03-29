function requireEnv(key) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`[ENV] Missing required environment variable: ${key}`)
  }
  return value
}

function optionalEnv(key, fallback) {
  return process.env[key] ?? fallback
}

export const env = {
  PORT:      optionalEnv('PORT', '4000'),

  DATABASE_URL: requireEnv("postgresql://postgres:naveen@localhost:5432/expense_db"),

  JWT_SECRET:         requireEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
  JWT_EXPIRES_IN:     optionalEnv('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: optionalEnv('JWT_REFRESH_EXPIRES_IN', '7d'),

  COOKIE_SECRET: requireEnv('COOKIE_SECRET'),

  FRONTEND_URL: optionalEnv('FRONTEND_URL', 'http://localhost:3000'),

  EXCHANGE_RATE_API_BASE: optionalEnv(
    'EXCHANGE_RATE_API_BASE',
    'https://api.exchangerate-api.com/v4/latest'
  ),
  COUNTRIES_API_BASE: optionalEnv(
    'COUNTRIES_API_BASE',
    'https://restcountries.com/v3.1'
  ),

  
} 