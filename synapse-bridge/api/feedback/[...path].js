import { proxyRequest } from '../_proxy.js'

const FEEDBACK_TARGET = process.env.SYNAPSE_FEEDBACK_API_URL || 'http://13.233.255.95:8003'

export default async function handler(req, res) {
  return proxyRequest(req, res, FEEDBACK_TARGET, req.query.path, '/api/feedback')
}
