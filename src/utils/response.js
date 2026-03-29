export function ok(res, data, message) {
  const body = { success: true, data }
  if (message) body.message = message
  return res.status(200).json(body)
}

export function created(res, data, message) {
  const body = { success: true, data }
  if (message) body.message = message
  return res.status(201).json(body)
}

export function noContent(res) {
  return res.status(204).send()
}


export function badRequest(
  res,
  error,
  details,
  code
) {
  const body = { success: false, error }
  if (code) body.code = code
  if (details) body.details = details
  return res.status(400).json(body)
}

export function unauthorized(
  res,
  error = 'Unauthorized',
  code
) {
  const body = { success: false, error }
  if (code) body.code = code
  return res.status(401).json(body)
}

export function forbidden(
  res,
  error = 'Forbidden',
  code
) {
  const body = { success: false, error }
  if (code) body.code = code
  return res.status(403).json(body)
}

export function notFound(
  res,
  error = 'Resource not found',
  code
) {
  const body = { success: false, error }
  if (code) body.code = code
  return res.status(404).json(body)
}

export function conflict(
  res,
  error,
  code
) {
  const body = { success: false, error }
  if (code) body.code = code
  return res.status(409).json(body)
}

export function unprocessable(
  res,
  error,
  code
) {
  const body = { success: false, error }
  if (code) body.code = code
  return res.status(422).json(body)
}

export function tooManyRequests(
  res,
  error = 'Too many requests. Please try again later.'
) {
  return res.status(429).json({ success: false, error })
}

export function serverError(
  res,
  error = 'Something went wrong. Please try again.',
  code
) {
  const body = { success: false, error }
  if (code) body.code = code
  return res.status(500).json(body)
}

export function paginated(
  res,
  data,
  total,
  page,
  limit
) {
  const totalPages = Math.ceil(total / limit)
  const body = {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
  return res.status(200).json(body)
}