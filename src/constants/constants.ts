export const chainID = '0x5a2'

export const mockReceipt = (blockHash: string, blockNumber: string, transactionHash: string) => ({
  blockHash,
  blockNumber,
  byzantium: true,
  confirmations: 1,
  contractAddress: null,
  cumulativeGasUsed: 0,
  from: '0x0000000000000000000000000000000000000000',
  gasUsed: 0,
  logs: [],
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009000002000000000000000000000000000000000000000000000000000000000000000',
  root: '0x0000000000000000000000000000000000000000000000000000000000000000',
  status: 1,
  to: '0x0000000000000000000000000000000000000000',
  transactionHash,
  transactionIndex: 0,
})

export const chainEndpoint = 'https://rpc.public.zkevm-test.net'
