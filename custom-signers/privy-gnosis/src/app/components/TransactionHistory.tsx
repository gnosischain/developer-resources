import { Col, Card, Row, Typography, Descriptions } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface TransactionHistoryProps {
  mintedTokens: Array<{
    recipient: string;
    tokenId: number;
    amount: number;
    txHash: string;
  }>;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ mintedTokens }) => {
  return (
    <div style={{ marginTop: '30px' }}>
      <Title level={4}>Minted Tokens History</Title>
      <Row gutter={[16, 16]}>
        {mintedTokens.map((item, index) => (
          <Col xs={24} sm={12} key={index}>
            <Card
              bordered
              hoverable
              style={{
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Descriptions
                column={1}
                size="small"
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ whiteSpace: 'pre-wrap' }}
              >
                <Descriptions.Item label="Recipient">{item.recipient}</Descriptions.Item>
                <Descriptions.Item label="Token ID">{item.tokenId}</Descriptions.Item>
                <Descriptions.Item label="Amount">{item.amount}</Descriptions.Item>
                <Descriptions.Item label="Transaction">
                  <a
                    href={`https://gnosis-chiado.blockscout.com/tx/${item.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Explorer <LinkOutlined />
                  </a>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TransactionHistory;
