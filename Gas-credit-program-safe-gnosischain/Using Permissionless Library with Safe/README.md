# How to use Permissionless Library with Safe


### 1. Install permissionless library :
```npm install permissionless```

Permissionless.js is a TypeScript library built on viem for building with ERC-4337 smart accounts, bundlers, paymasters, and user operations. The core focuses are avoiding provider lock-in, having no dependencies, maximum viem compatibility, and a small bundle size. permissionless.js also provides high-level support for the major ERC-4337 smart accounts, including Safe.

### 2. Import necessary packages :

```jsx
import { ENTRYPOINT_ADDRESS_V06, createSmartAccountClient } from "permissionless"
import { signerToSafeSmartAccount } from "permissionless/accounts"
import {
	createPimlicoBundlerClient,
	createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico"
import { createPublicClient, getContract, http, parseEther } from "viem"
import { gnosis } from "viem/chains"
```

### 3. Create ```publicClient``` and ```PimlicoPaymasterClient``` :

```jsx
export const publicClient = createPublicClient({
	transport: http("https://gnosis.drpc.org"),
})
 
export const paymasterClient = createPimlicoPaymasterClient({
	transport: http("https://api.pimlico.io/v2/gnosis/rpc?apikey=API_KEY"),
	entryPoint: ENTRYPOINT_ADDRESS_V06,
})
```

### 4. Create a Signer 
Now, you would need to create a signer which will be signing the transactions or let's say user operations. You can utilise any signer that is compatible with Permissionless, here are the [list](https://docs.pimlico.io/permissionless/how-to/signers).

Let's see how we can utilise the private key of the user to create a signer :

```jsx
import { privateKeyToAccount } from "viem/accounts"
import { pimlicoBundlerClient } from "../pimlicoBundlerClient"
const signer = privateKeyToAccount("0xPRIVATE_KEY")
```

### 5. Create a Safe Account :

```jsx
const safeAccount = await signerToSafeSmartAccount(publicClient, {
	entryPoint: ENTRYPOINT_ADDRESS_V06,
	signer: signer,
	saltNonce: 0n, // optional
	safeVersion: "1.4.1",
	address: "0x...", // optional, only if you are using an already created account
})
```
You can also check out the reference documentation of [creating a safe account](https://docs.pimlico.io/permissionless/reference/accounts/signerToSafeSmartAccount)


### 6. Create Smart Account client :

Now, for this step we require to get API from [Pimlico Dashboard](https://dashboard.pimlico.io/). Once you have successfully logged in, here is what you will see. You can utilise the Verifying Paymaster or ERC-20 Paymaster. Here is the [full-fledged documentation](https://docs.pimlico.io/infra/paymaster) for the same

![Pimlico Dashboard](./../Using%20Permissionless%20Library%20with%20Safe/dashboard.png).


```jsx
const smartAccountClient = createSmartAccountClient({
	account: safeAccount,
	entryPoint: ENTRYPOINT_ADDRESS_V06,
	chain: gnosis,
	bundlerTransport: http("https://api.pimlico.io/v1/gnosis/rpc?apikey=API_KEY"),
	middleware: {
		gasPrice: async () => (await pimlicoBundlerClient.getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices
		sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
	},
})
```

### 7. Fetch the gas prices

If you're using Pimlico as your bundler, fetch the required gas price to use beforehand and pass it in as the maxFeePerGas and maxPriorityFeePerGas parameters. Other providers might have different requirements for fetching the gas price.

```jsx
export const bundlerClient = createPimlicoBundlerClient({
	transport: http("https://api.pimlico.io/v1/sepolia/rpc?apikey=API_KEY"),
	entryPoint: ENTRYPOINT_ADDRESS_V06,
})
 
const gasPrices = await bundlerClient.getUserOperationGasPrice()
```


### 8. Send a transaction
Transactions using permissionless.js simply wrap around user operations. This means you can switch to permissionless.js from your existing viem EOA codebase with minimal-to-no changes.

```jsx
const txHash = await smartAccountClient.sendTransaction({
	to: destinationAddress,
	value: parseEther("0.1"),
	maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
	maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
})
```