import { createWalletClient, custom, createPublicClient, http } from 'viem';
import { gnosisChiado } from 'viem/chains';

export const initializeWalletClient = async (wallets: string | any[]) => {
  if (wallets.length > 0) {
    const wallet = wallets[0];
    const provider = await wallet.getEthereumProvider();

    const walletClient = createWalletClient({
      chain: gnosisChiado,
      transport: custom(provider),
    });

    const publicClient = createPublicClient({
      chain: gnosisChiado,
      transport: http(),
    });

    const [account] = await walletClient.getAddresses();
    
    return {
      walletClient,
      publicClient,
      account,
    };
  } else {
    console.log('No wallets found.');
    throw new Error('No wallets found.');
  }
};

export const waitForTransactionReceipt = async (publicClient: any, transactionHash: string) => {
  return await publicClient.waitForTransactionReceipt({ hash: transactionHash });
};
