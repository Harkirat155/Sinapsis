import { proxyRequest } from '../_proxy.js'

const CORE_TARGET = process.env.SYNAPSE_CORE_API_URL || 'http://13.233.255.95:8000'

export default async function handler(req, res) {
  return proxyRequest(req, res, CORE_TARGET, req.query.path, '/api/core')
}
