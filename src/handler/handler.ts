import { chainEndpoint, chainID, mockReceipt } from '@/constants'
import { apiErrorJSON, apiSuccess, apiSuccessJSON } from '@/responses'
import { IEnv } from '@/types'

const txs = {}

export interface IRequest {
  id: number
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

  // TODO: get hash and decode transaction
  const hash = ''
  const tx = {}

  txs[hash] = tx

  return apiSuccessJSON(hash, request.id)
}

const handleGetRawTransactionByHash = async (request: IRequest) => {
  const { params } = request
  if (!params) {
    return apiErrorJSON('no hash found', request.id)
  }

  const transaction = txs[params[0]]
  if (!transaction) {
    return apiErrorJSON('no tx found', request.id)
  }

  delete txs[params[0]]

  return apiSuccessJSON(transaction, request.id)
}

const handleGetTransactionReceipt = async (request: IRequest) => {
  const { params } = request
  if (!params) {
    return apiErrorJSON('no hash found', request.id)
  }
  const transactionReceipt = mockReceipt(params[0])

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
      case 'eth_blockNumber':
        return relayRequest(payload)
      case 'eth_gasPrice':
        return relayRequest(payload)
      case 'eth_estimateGas':
        return relayRequest(payload)
      case 'eth_getBalance':
        return relayRequest(payload)
      case 'net_version':
        return handleChainIdRequest(payload.id)
      case 'eth_getBlockByNumber':
        return relayRequest(payload)
      case 'eth_getTransactionCount':
        return relayRequest(payload)
      case 'eth_call':
        return relayRequest(payload)
      case 'eth_getCode':
        return relayRequest(payload)
      case 'eth_sendRawTransaction':
        return handleSendRawTransaction(payload)
      case 'eth_getRawTransactionByHash':
        return handleGetRawTransactionByHash(payload)
      case 'eth_getTransactionReceipt':
        return handleGetTransactionReceipt(payload)
      default:
        return apiErrorJSON('unknown method', payload.id)
    }
  }

  return {}
}
