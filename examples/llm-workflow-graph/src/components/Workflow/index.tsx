import * as React from 'react';
import { Typography, Collapse } from 'antd';

const { Title } = Typography;
interface IWorkflowProps {
  items: {
    key: string;
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }[];
}

const Workflow: React.FunctionComponent<IWorkflowProps> = props => {
  const { items } = props;

  return (
    <div style={{ overflow: 'scroll', height: '100%' }}>
      <Collapse items={items} defaultActiveKey={items.map(item => item.key)} />
      {/* {items.map((item, index) => {
        const { label, icon, children } = item;
        return (
          <div key={index}>
            <Title> {label}</Title>
            {children}
          </div>
        );
      })} */}
    </div>
  );
};

export default Workflow;
