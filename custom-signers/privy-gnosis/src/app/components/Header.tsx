'use client';
import { usePrivy } from "@privy-io/react-auth";
import { Button } from 'antd'; 
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const { user, login, logout } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.wallet?.address) {
      const wallet = user.wallet.address;
      const formattedWalletAddress = wallet.startsWith('0x') ? wallet : `0x${wallet}`;
      setWalletAddress(formattedWalletAddress);
    }
    return () => {
      setWalletAddress(null);
    };
  }, [user]);

  return (
    <header style={{ backgroundColor: '#1a1a1a', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src="https://cdn.prod.website-files.com/662931fe35e0c191d1733ab9/662931fe35e0c191d1733b0f_owl-forest.png"
          alt="Logo"
          width={50} 
          height={50} 
          style={{ marginRight: '15px' }}
        />
        <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>Gnosis</span>
      </div>

      <div style={{ color: 'white', fontSize: '1.2rem' }}>
        {user && <h3 style={{ margin: 0 }}>Wallet: {walletAddress}</h3>}
      </div>

      <div>
        {user ? (
          <Button
            size="large"
            onClick={() => logout()}
            type="primary"
            danger
            style={{
              backgroundColor: '#ff4d4f',
              borderColor: '#ff4d4f',
              color: 'white',
              borderRadius: '8px',
              padding: '10px 20px',
              boxShadow: '0 2px 8px rgba(255, 77, 79, 0.4)',
            }}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            size="large"
            onClick={() => login()}
            type="default"
            style={{
              backgroundColor: '#2610A7',
              color: 'white',
              borderRadius: '8px',
              padding: '10px 20px',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
            }}
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
