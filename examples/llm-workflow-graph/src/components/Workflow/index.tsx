import * as React from 'react';
import { Typography, Collapse, Timeline } from 'antd';

const { Title } = Typography;
interface IWorkflowProps {
  items: {
    key: string;
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }[];
  type?: 'collapse' | 'timeline';
}

const Workflow: React.FunctionComponent<IWorkflowProps> = props => {
  const { items, type } = props;
  if (type === 'timeline') {
    const _items = items.map(item => {
      return {
        color: '#000',
        dot: item.icon,
        children: (
          <div>
            <Typography.Text>{item.label}</Typography.Text>
            <div style={{ padding: '24px 24px 24px 0px' }}>{item.children}</div>
          </div>
        ),
      };
    });
    return <Timeline items={_items} style={{ padding: '12px' }} />;
  }

  return (
    <div style={{ overflow: 'scroll', height: '100%' }}>
      <Collapse items={items} defaultActiveKey={items.map(item => item.key)} />
    </div>
  );
};

export default Workflow;
