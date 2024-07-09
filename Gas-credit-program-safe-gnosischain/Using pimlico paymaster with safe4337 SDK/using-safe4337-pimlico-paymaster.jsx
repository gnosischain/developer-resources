import { Safe4337Pack } from '@safe-global/relay-kit'

const SIGNER_ADDRESS = ""
const SIGNER_PRIVATE_KEY = import.meta.env.SIGNER_PRIVATE_KEY;
const RPC_URL = 'https://gnosis.drpc.org'

const safe4337Pack = await Safe4337Pack.init({
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_KEY,
  bundlerUrl: `https://api.pimlico.io/v1/gnosis/rpc?apikey=${PIMLICO_API_KEY}`,
  options: {
    owners: [SIGNER_ADDRESS],
    threshold: 1
  },
   paymasterOptions: {
    isSponsored: true,
    paymasterUrl: `https://api.pimlico.io/v2/gnosis/rpc?apikey=${PIMLICO_API_KEY}`,
    paymasterAddress: '0x...',
    paymasterTokenAddress: '0x...',
    sponsorshipPolicyId // Optional value to set the sponsorship policy id from Pimlico
  }
  
})

// Define the transactions to execute
const transaction1 = { to, data, value }
const transaction2 = { to, data, value }

// Build the transaction array
const transactions = [transaction1, transaction2]

// Create the SafeOperation with all the transactions
const safeOperation = await safe4337Pack.createTransaction({ transactions })

const signedSafeOperation = await safe4337Pack.signSafeOperation(safeOperation)

const userOperationHash = await safe4337Pack.executeTransaction({
  executable: signedSafeOperation
})

let userOperationReceipt = null

while (!userOperationReceipt) {
  // Wait 2 seconds before checking the status again
  await new Promise((resolve) => setTimeout(resolve, 2000))
  userOperationReceipt = await safe4337Pack.getUserOperationReceipt(
    userOperationHash
  )
}

const userOperationPayload = await safe4337Pack.getUserOperationByHash(
  userOperationHash
)
