"use client";

import { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Button, Typography, Space, Card } from 'antd';
import { DynamicWidgetButton } from './components/DynamicWidgetButton';

const { Title, Text } = Typography;

export default function Main() {
  const { primaryWallet } = useDynamicContext();
  const [signature, setSignature] = useState<string | null>(null);

  const getBalance = async () => {
    if (!primaryWallet) {
      console.error("No primary wallet connected");
      return null;
    }

    const provider = await primaryWallet.connector?.ethers?.getRpcProvider();
    
    if (!provider) {
      console.error("No provider available");
      return null;
    }
    try {
      const balance = await provider.getBalance(primaryWallet.address);
      console.log(balance);
      return balance;
    } catch (error) {
      console.error("Error getting balance:", error);
      return null;
    }
  };

  const signMessage = async () => {
    if (!primaryWallet) {
      console.error("No primary wallet connected");
      return;
    }

    try {
      const signedMessage = await primaryWallet.connector.signMessage('You are signing an example message');
      if (signedMessage) {
        setSignature(signedMessage);
      } else {
        setSignature(null);
      }
    } catch (error) {
      console.error("Error signing message:", error);
      setSignature(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>Gnosis X Dynamic</Title>
      <div>
        <DynamicWidgetButton />
        <Card style={{ textAlign: 'center', padding: '40px 20px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
          <Title level={3} style={{ marginBottom: '20px' }}>Sign a Message</Title>
          <Text style={{ display: 'block', marginBottom: '20px' }}>
            Click the button below to sign a message with your connected wallet.
          </Text>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: '#fff' }} onClick={signMessage}>
              Sign message
            </Button>
            {signature && (
              <div style={{ marginTop: '20px', textAlign: 'left', wordBreak: 'break-all' }}>
                <Text><strong>Signature:</strong></Text>
                <Text>{signature}</Text>
              </div>
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
}
