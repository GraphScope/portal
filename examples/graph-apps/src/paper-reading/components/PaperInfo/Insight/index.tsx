import type { CSSProperties } from 'react';
import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';
import FindPath from './FindPath';
import RelatedWork from './RelatedWork';
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = panelStyle => [
  {
    key: '1',
    label: 'What Are the Solutions for Paper-Related Challenges?',
    children: <FindPath />,
    style: panelStyle,
  },
  {
    key: '2',
    label: 'What Is the Related Work in This Paper?',
    children: <RelatedWork />,
    style: panelStyle,
  },
];

const Insight: React.FC = () => {
  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      expandIconPosition="end"
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      style={{ background: token.colorBgContainer }}
      items={getItems(panelStyle)}
    />
  );
};

export default Insight;
