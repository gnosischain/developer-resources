# How to use Pimlico Paymaster with Safe4337Module

Safe has adopted a modular and flexible approach to integrating the ERC-4337, allowing users to turn their Safe Smart Account into an ERC-4337 smart account.

### 1. Install Safe4337 Pack

```npm install @safe-global/relay-kit```

### 2. Import Safe4337Pack

The `Safe4337Pack` class is exposed via the Relay Kit from the Safe{Core} SDK.

```jsx
import { Safe4337Pack } from '@safe-global/relay-kit'
```

### 3. Create a Signer for the Safe Smart Account

```jsx
const SIGNER_ADDRESS = // ...
const SIGNER_PRIVATE_KEY = // ...
const RPC_URL = 'https://gnosis.drpc.org'
```

### 4. Initialize the Safe4337Pack

- To create a new Safe Smart Account, we need to pass the configuration of the Safe inside the `options` object. Here we pass an array of `owners` with our signer address, and a `threshold`, which specifies the minimum number of signatures that must be collected for every transaction.

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

- To use an existing Safe Smart Account, you can just pass the `safeAddress` property in the `options` object.

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

### 5. Setup Pimlico Paymaster

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
### 6. Create a User Operation

To create a Safe user operation, use the `createTransaction()` method, which takes an array of transactions to execute and returns a `SafeOperation` object.

```jsx
// Define the transactions to execute
const transaction1 = { to, data, value }
const transaction2 = { to, data, value }

// Build the transaction array for batched transactions
const transactions = [transaction1, transaction2]

// Create the SafeOperation with all the transactions
const safeOperation = await safe4337Pack.createTransaction({ transactions })
```
### 7. Signing and submitting user operations 

```jsx
const signedSafeOperation = await safe4337Pack.signSafeOperation(safeOperation)

const userOperationHash = await safe4337Pack.executeTransaction({
  executable: signedSafeOperation
})
```

The `executeTransaction()` method returns the hash of the user operation. You can check transaction status using a block explorer or the bundler's API.

### 8. Check transaction status

You can utilise `getUserOperationReceipt()` method, which will return the transaction receipt.

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

### Check out supporting documentation here:

1. [Safe4337 Pack](https://docs.safe.global/home/4337-guides/safe-sdk)
2. [Safe4337 Module](https://github.com/safe-global/safe-modules/tree/main/modules/4337)

