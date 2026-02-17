import { proxyRequest } from '../_proxy.js'

const INTENT_TARGET = process.env.SYNAPSE_INTENT_API_URL || 'http://13.233.255.95:8001'

export default async function handler(req, res) {
  return proxyRequest(req, res, INTENT_TARGET, req.query.path, '/api/intent')
}
