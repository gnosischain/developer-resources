import React from 'react';
import { DynamicWidget } from '../../lib/dynamic';
import { Typography } from 'antd';

const { Title } = Typography;

export const DynamicWidgetButton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
      <Title level={3} style={{ marginBottom: '20px' }}>Wallet Interaction</Title>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <DynamicWidget />
      </div>
    </div>
  );
};
