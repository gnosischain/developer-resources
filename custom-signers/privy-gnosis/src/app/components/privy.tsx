'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import {gnosisChiado, gnosis} from 'viem/chains';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId="<ADD APP ID HERE>"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#676FFF',
          logo: 'https://cdn.prod.website-files.com/662931fe35e0c191d1733ab9/662931fe35e0c191d1733b0f_owl-forest.png',
        },
        defaultChain: gnosisChiado,
        supportedChains: [gnosisChiado,gnosis], 

        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}