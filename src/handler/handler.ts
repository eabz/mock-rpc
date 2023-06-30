import { Buffer } from 'node:buffer'

import { chainEndpoint, chainID, mockReceipt } from '@/constants'
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

const getLatestBlock = async (): Promise<string> => {
  const request: IRequest = { id: 1, jsonrpc: '2.0', method: 'eth_blockNumber', params: [] }

  const response = await fetch(chainEndpoint, { body: JSON.stringify(request), method: 'POST' })

  const data: IRequest = await response.json()

  return data.result as string
}

const getBlockHash = async (block: string): Promise<{ hash: string }> => {
  const request: IRequest = { id: 1, jsonrpc: '2.0', method: 'eth_getBlockByNumber', params: [block] }

  const response = await fetch(chainEndpoint, { body: JSON.stringify(request), method: 'POST' })

  const data: IRequest = await response.json()

  return data.result as { hash: string }
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

  const transaction = txs[params[0]]
  if (!transaction) {
    return apiErrorJSON('no tx found', request.id)
  }

  delete txs[params[0]]

  return apiSuccessJSON(JSON.stringify(transaction), request.id)
}

const handleGetTransactionReceipt = async (request: IRequest) => {
  const { params } = request
  if (!params) {
    return apiErrorJSON('no hash found', request.id)
  }

  const hash = params[0]

  const block = await getLatestBlock()

  const { hash: blockHash } = await getBlockHash(block)

  const transactionReceipt = mockReceipt(hash, block, blockHash)

  return apiSuccessJSON(transactionReceipt, request.id)
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
      case 'eth_getTransactionReceipt':
        return handleGetTransactionReceipt(payload)
      default:
        return relayRequest(payload)
    }
  }

  return {}
}
