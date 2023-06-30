import { Buffer } from 'node:buffer'

import { chainEndpoint, chainID } from '@/constants'
import { apiErrorJSON, apiSuccess, apiSuccessJSON } from '@/responses'
import { IEnv } from '@/types'

const txs = {}

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

const handleSendRawTransaction = async (request: IRequest) => {
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

  txs[hash] = tx

  return apiSuccessJSON(hash, request.id)
}

const handleGetTransactionByHash = async (request: IRequest) => {
  const { params } = request
  if (!params) {
    return apiErrorJSON('no hash found', request.id)
  }

  const hash = params[0]

  const transaction = txs[hash]

  if (!transaction) {
    return apiErrorJSON('no tx found', request.id)
  }

  delete txs[hash]

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
        return handleSendRawTransaction(payload)
      case 'eth_getTransactionByHash':
        return handleGetTransactionByHash(payload)
      default:
        return relayRequest(payload)
    }
  }
}
