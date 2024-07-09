import { ENTRYPOINT_ADDRESS_V06, createSmartAccountClient } from "permissionless"
import { signerToSafeSmartAccount } from "permissionless/accounts"
import { createPimlicoBundlerClient,createPimlicoPaymasterClient,} from "permissionless/clients/pimlico"
import { createPublicClient, getContract, http, parseEther } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { pimlicoBundlerClient } from "../pimlicoBundlerClient"
import { gnosis } from "viem/chains"


export const publicClient = createPublicClient({
	transport: http("https://gnosis.drpc.org"),
})
 
export const paymasterClient = createPimlicoPaymasterClient({
	transport: http("https://api.pimlico.io/v2/gnosis/rpc?apikey=API_KEY"),
	entryPoint: ENTRYPOINT_ADDRESS_V06,
})

const signer = privateKeyToAccount("0xPRIVATE_KEY")


const safeAccount = await signerToSafeSmartAccount(publicClient, {
	entryPoint: ENTRYPOINT_ADDRESS_V06,
	signer: signer,
	saltNonce: 0n, // optional
	safeVersion: "1.4.1",
	address: "0x...", // optional, only if you are using an already created account
})


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

export const bundlerClient = createPimlicoBundlerClient({
	transport: http("https://api.pimlico.io/v1/sepolia/rpc?apikey=API_KEY"),
	entryPoint: ENTRYPOINT_ADDRESS_V06,
})
 
const gasPrices = await bundlerClient.getUserOperationGasPrice()

const txHash = await smartAccountClient.sendTransaction({
	to: destinationAddress,
	value: parseEther("0.1"),
	maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
	maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
})
