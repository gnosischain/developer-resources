# How to use Pimlico Paymaster with Safe4337Module

Safe has adopted a modular and flexible approach to integrating the ERC-4337, allowing users to turn their Safe account into an ERC-4337 smart account.

### 1. Install Safe4337 Pack

```npm install @safe-global/relay-kit```

###2. Import Safe4337Pack
Safe4337 Pack exposed via the Relay Kit from the Safe{Core} SDK.

```jsx
import { Safe4337Pack } from '@safe-global/relay-kit'
```

###3. Create a Signer for Safe Account

```jsx
const SIGNER_ADDRESS = // ...
const SIGNER_PRIVATE_KEY = // ...
const RPC_URL = 'https://gnosis.drpc.org'
```

###4. Initialize the Safe4337 Pack

- For a new Safe Account, we require to pass owner which is your signer address and threshold value of the number of signer you are adding.

```jsx
const safe4337Pack = await Safe4337Pack.init({
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_KEY,
  bundlerUrl: `https://api.pimlico.io/v1/sepolia/rpc?apikey=${PIMLICO_API_KEY}`,
  options: {
    owners: [SIGNER_ADDRESS],
    threshold: 1
  },
  // ...
})
```

- For an existing Safe Account, you can just pass SafeAddress in options object.

```jsx
const safe4337Pack = await Safe4337Pack.init({
  provider: RPC_URL,
  signer: SIGNER_PRIVATE_KEY,
  bundlerUrl: `https://api.pimlico.io/v1/gnosis/rpc?apikey=${PIMLICO_API_KEY}`,
  options: {
    safeAddress: '0x...'
  },
  // ...
})
```

###5. Setup Pimlico Paymaster
```jsx
const safe4337Pack = await Safe4337Pack.init({
  // ...
  paymasterOptions: {
    isSponsored: true,
    paymasterUrl: `https://api.pimlico.io/v2/gnosis/rpc?apikey=${PIMLICO_API_KEY}`,
    paymasterAddress: '0x...',
    paymasterTokenAddress: '0x...',
    sponsorshipPolicyId // Optional value to set the sponsorship policy id from Pimlico
  }
})
```
###6. Create a User Operation

To create a Safe user operation, use the createTransaction() method, which takes the array of transactions to execute and returns a SafeOperation object.

```jsx
// Define the transactions to execute
const transaction1 = { to, data, value }
const transaction2 = { to, data, value }

// Build the transaction array for batched transactions
const transactions = [transaction1, transaction2]

// Create the SafeOperation with all the transactions
const safeOperation = await safe4337Pack.createTransaction({ transactions })
```
###7. Signing and submitting user-operations 


```jsx
const signedSafeOperation = await safe4337Pack.signSafeOperation(safeOperation)

const userOperationHash = await safe4337Pack.executeTransaction({
  executable: signedSafeOperation
})
// This method returns the hash of the user operation. You can check transaction status using a block explorer or the bundler's API.
```

###8. Check transaction status
You can utilise ```getUserOperationReceipt``` which will return transaction receipt.

```jsx
let userOperationReceipt = null

while (!userOperationReceipt) {
  // Wait 2 seconds before checking the status again
  await new Promise((resolve) => setTimeout(resolve, 2000))
  userOperationReceipt = await safe4337Pack.getUserOperationReceipt(
    userOperationHash
  )
}
```

----
### Check out supporting documentation here :

1. [Safe4337 Pack](https://docs.safe.global/home/4337-guides/safe-sdk)
2. [Safe4337 Module](https://github.com/safe-global/safe-modules/tree/main/modules/4337)

