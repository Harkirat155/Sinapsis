import { proxyRequest } from '../_proxy.js'

const RAPID_TARGET = process.env.SYNAPSE_RAPID_API_URL || 'http://13.233.255.95:8002'

export default async function handler(req, res) {
  return proxyRequest(req, res, RAPID_TARGET, req.query.path)
}
