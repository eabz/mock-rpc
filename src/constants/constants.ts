import { IEnv } from '@/types'

export enum Chain {
  TESTNET,
  MAINNET,
}

const chainID = {
  [Chain.TESTNET]: '0x5a2',
  [Chain.MAINNET]: '0x44d',
}

const rpcEndpoint = {
  [Chain.TESTNET]: 'https://rpc.public.zkevm-test.net',
  [Chain.MAINNET]: 'https://zkevm-rpc.com',
}

export const getChainID = (env: IEnv): string => {
  return env.TESTNET ? chainID[Chain.TESTNET] : chainID[Chain.MAINNET]
}

export const getRPC = (env: IEnv): string => {
  return env.TESTNET ? rpcEndpoint[Chain.TESTNET] : rpcEndpoint[Chain.MAINNET]
}
