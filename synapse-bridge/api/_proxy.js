function getSearch(req) {
  const idx = req.url.indexOf('?')
  return idx >= 0 ? req.url.slice(idx) : ''
}

function normalizePath(pathParam) {
  if (!pathParam) return ''
  if (Array.isArray(pathParam)) return pathParam.join('/')
  return String(pathParam)
}

export async function proxyRequest(req, res, targetBase, pathParam) {
  const path = normalizePath(pathParam)
  const targetUrl = `${targetBase}${path ? `/${path}` : ''}${getSearch(req)}`

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
