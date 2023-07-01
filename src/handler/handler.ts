import { Buffer } from 'node:buffer'

import { chainEndpoint, chainID } from '@/constants'
import { apiErrorJSON, apiSuccess, apiSuccessJSON } from '@/responses'
import { IEnv } from '@/types'

export interface IRequest {
  id: number
  jsonrpc: string
  method?: string
  params?: any[]
  result?: any
}

const handleChainIdRequest = async (id: number) => {
  return apiSuccessJSON(chainID, id)
}

const handleSendRawTransaction = async (request: IRequest, env: IEnv) => {
  const { params } = request
  if (!params) {
    return apiErrorJSON('no tx found', request.id)
  }

  const tx = params[0]

  const buf = Buffer.from(tx)

  const digest = await crypto.subtle.digest(
    {
      name: 'SHA-256',
    },
    buf,
  )

  const hexString = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')

  const hash = '0x' + hexString

  // @ts-ignore
  await env.STORAGE.put(hash, tx)

  return apiSuccessJSON(hash, request.id)
}

const handleGetTransactionByHash = async (request: IRequest, env: IEnv) => {
  const { params } = request
  if (!params) {
    return apiErrorJSON('no hash found', request.id)
  }

  const hash = params[0]

  // @ts-ignore
  const transaction = await env.STORAGE.get(hash)

  if (!transaction) {
    return apiErrorJSON('no tx found', request.id)
  }

  // @ts-ignore
  await env.STORAGE.delete(hash)

  return apiSuccessJSON(transaction, request.id)
}

const relayRequest = async (request: IRequest) => {
  const response = await fetch(chainEndpoint, { body: JSON.stringify(request), method: 'POST' })

  const data: IRequest = await response.json()

  return apiSuccessJSON(data.result, request.id)
}

export async function handle(request: Request, env: IEnv, ctx: any, data: Record<string, any>) {
  const { method } = request

  if (method === 'GET') {
    return apiSuccess()
  }

  if (method === 'POST') {
    const payload: IRequest = await request.json()

    switch (payload.method) {
      case 'eth_chainId':
        return handleChainIdRequest(payload.id)
      case 'net_version':
        return handleChainIdRequest(payload.id)
      case 'eth_sendRawTransaction':
        return handleSendRawTransaction(payload, env)
      case 'eth_getTransactionByHash':
        return handleGetTransactionByHash(payload, env)
      default:
        return relayRequest(payload)
    }
  }
}
