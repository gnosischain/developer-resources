'use client';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import { initializeWalletClient, waitForTransactionReceipt } from './components/wallets';
import { useWallets } from '@privy-io/react-auth';
import {
  Button,
  Input,
  Form,
  message as antdMessage,
  Card,
  Modal,
  Spin,
  Typography,
} from 'antd';
import { parseEther } from 'viem';
import TransactionHistory from './components/TransactionHistory';

const { Title } = Typography;

export default function HomePage() {
  const { wallets } = useWallets();
  const [walletClient, setWalletClient] = useState<any | null>(null);
  const [publicClient, setPublicClient] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const [recipient, setRecipient] = useState<string>('');
  const [tokenId, setTokenId] = useState<number>(0);
  const [amount, setAmount] = useState<number>(1);
  const mintPrice = 0.008; 

  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [mintedTokens, setMintedTokens] = useState<any[]>([]);

  const contractAddress = '0x2C7C9e55FA51F025B0F3F9975cf2f4a2DB6A0E97';
  const contractABI = [
    {
      type: 'function',
      name: 'mintTo',
      inputs: [
        { name: 'recipient', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'amount', type: 'uint256' },
      ],
      outputs: [],
      payable: true,
      stateMutability: 'payable',
    },
  ];

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        if (wallets && wallets.length > 0) {
          const { walletClient, publicClient, account } = await initializeWalletClient(wallets);
          setWalletClient(walletClient);
          setPublicClient(publicClient);
          setAccount(account);
        } else {
          console.log('No wallets found.');
        }
      } catch (error) {
        console.error('Error initializing wallet:', error);
        antdMessage.error('Failed to initialize wallet.');
      }
    };

    fetchWalletData();
  }, [wallets]);

  const handleMint = async () => {
    setIsMinting(true);
    try {
      if (walletClient && publicClient && account) {
        const totalCost = parseEther((mintPrice * amount).toString());

        const transactionHash = await walletClient.writeContract({
          address: contractAddress,
          abi: contractABI,
          functionName: 'mintTo',
          args: [recipient, tokenId, amount],
          value: totalCost,
          account,
        });

        setIsModalVisible(false);

        const receipt = await waitForTransactionReceipt(publicClient, transactionHash);

        setMintedTokens((prev) => [
          ...prev,
          {
            recipient,
            tokenId,
            amount,
            txHash: receipt.transactionHash,
          },
        ]);

        antdMessage.success('Tokens minted successfully!');
      } else {
        antdMessage.error('Wallet client or account is not available.');
      }
    } catch (error) {
      console.error('Error minting tokens:', error);
      antdMessage.error('Failed to mint tokens.');
    } finally {
      setIsMinting(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Header />

      <main style={{ padding: '20px', textAlign: 'center' }}>
        <Card
          title={<Title level={3} style={{ color: '#333' }}>Mint ERC-1155 Tokens</Title>}
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Form
            layout="vertical"
            onFinish={showModal}
            initialValues={{ amount: 1 }}
          >
            <Form.Item
              label="Recipient Address"
              name="recipient"
              rules={[{ required: true, message: 'Please enter the recipient address' }]}
            >
              <Input
                placeholder="Enter recipient address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Token ID"
              name="tokenId"
              rules={[{ required: true, message: 'Please enter the token ID' }]}
            >
              <Input
                type="number"
                placeholder="Enter token ID"
                value={tokenId}
                onChange={(e) => setTokenId(Number(e.target.value))}
              />
            </Form.Item>

            <Form.Item
              label="Amount"
              name="amount"
            >
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                min={1}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  width: '100%',
                  borderRadius: '5px',
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                }}
                disabled={!walletClient || isMinting}
              >
                {isMinting ? <Spin /> : 'Mint Tokens'}
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {!walletClient && (
          <div style={{ marginTop: '20px', color: 'red' }}>
            Please connect your wallet to enable minting.
          </div>
        )}

        <Modal
          title="Confirm Minting"
          open={isModalVisible}
          onOk={handleMint}
          onCancel={handleCancel}
          okButtonProps={{ disabled: isMinting }}
          okText={isMinting ? <Spin /> : 'Confirm'}
          cancelText="Cancel"
        >
          <p>
            <strong>Recipient Address:</strong> {recipient}
          </p>
          <p>
            <strong>Token ID:</strong> {tokenId}
          </p>
          <p>
            <strong>Amount:</strong> {amount}
          </p>
          <p>
            <strong>Total Cost:</strong> {mintPrice * amount} xDAI
          </p>
        </Modal>

        {mintedTokens.length > 0 && (
          <TransactionHistory mintedTokens={mintedTokens} />
        )}
      </main>
    </div>
  );
}
