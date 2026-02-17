function normalizePath(pathParam) {
  if (!pathParam) return ''
  if (Array.isArray(pathParam)) return pathParam.join('/')
  return String(pathParam)
}

function resolveTargetParts(req, pathParam, routeBase) {
  const parsed = new URL(req.url, 'http://localhost')
  let path = normalizePath(pathParam)

  if (!path && routeBase && parsed.pathname.startsWith(`${routeBase}/`)) {
    path = parsed.pathname.slice(routeBase.length + 1)
  }
  if (!path) {
    path = parsed.searchParams.get('path') || ''
  }
  // Some runtimes (including Vercel functions) may pass req.url relative to the
  // function mountpoint (e.g. "/stats" instead of "/api/core/stats").
  if (!path) {
    const raw = parsed.pathname.replace(/^\/+/, '')
    path = raw
  }

  parsed.searchParams.delete('path')
  const query = parsed.searchParams.toString()
  return { path, search: query ? `?${query}` : '' }
}

export async function proxyRequest(req, res, targetBase, pathParam, routeBase) {
  const { path, search } = resolveTargetParts(req, pathParam, routeBase)
  const targetUrl = `${targetBase}${path ? `/${path}` : ''}${search}`

  const headers = { ...req.headers }
  delete headers.host
  delete headers['content-length']

  const options = {
    method: req.method,
    headers
  }

  if (!['GET', 'HEAD'].includes(req.method)) {
    if (typeof req.body === 'string') {
      options.body = req.body
    } else if (req.body !== undefined) {
      options.body = JSON.stringify(req.body)
      if (!options.headers['content-type']) {
        options.headers['content-type'] = 'application/json'
      }
    }
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const upstream = await fetch(targetUrl, { ...options, signal: controller.signal })
    const contentType = upstream.headers.get('content-type') || 'application/json'
    const text = await upstream.text()

    res.status(upstream.status)
    res.setHeader('content-type', contentType)
    return res.send(text)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown proxy error'
    res.status(502)
    return res.json({
      error: 'Upstream request failed',
      target: targetUrl,
      details: message
    })
  } finally {
    clearTimeout(timeout)
  }
}
