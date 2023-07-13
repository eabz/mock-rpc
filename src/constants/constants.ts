import { IEnv } from '@/types'

export enum Chain {
  TESTNET,
  MAINNET,
}

const rpcEndpoint = {
  [Chain.TESTNET]: 'https://rpc.public.zkevm-test.net',
  [Chain.MAINNET]: 'https://zkevm-rpc.com',
}

export const getRPC = (env: IEnv): string => {
  return env.TESTNET ? rpcEndpoint[Chain.TESTNET] : rpcEndpoint[Chain.MAINNET]
}
