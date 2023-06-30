import { chainID, genesisBlock } from '@/constants'
import { apiErrorJSON, apiSuccess, apiSuccessJSON } from '@/responses'
import { IEnv } from '@/types'

const handleChainIdRequest = async (id: number) => {
  return apiSuccessJSON(chainID, id)
}

const handleSimple = async (id: number) => {
  return apiSuccessJSON('0x0', id)
}

const handleGetBlock = async (id: number) => {
  return apiSuccessJSON(genesisBlock, id)
}

export async function handle(request: Request, env: IEnv, ctx: any, data: Record<string, any>) {
  const { method } = request

  if (method === 'GET') {
    return apiSuccess()
  }

  if (method === 'POST') {
    const payload: { id: number; method: string; params: any[] } = await request.json()

    switch (payload.method) {
      case 'eth_chainId':
        return handleChainIdRequest(payload.id)
      case 'eth_blockNumber':
        return handleSimple(payload.id)
      case 'eth_gasPrice':
        return handleSimple(payload.id)
      case 'eth_getBalance':
        return handleSimple(payload.id)
      case 'net_version':
        return handleChainIdRequest(payload.id)
      case 'eth_getBlockByNumber':
        return handleGetBlock(payload.id)
      default:
        console.log(payload, payload.params)

        return apiErrorJSON('unknown method', payload.id)
    }
  }

  return {}
}
