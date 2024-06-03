import * as React from 'react';
import { Breadcrumb, Divider, Typography, Tabs, Segmented, Select, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
import type { BreadcrumbProps, TabsProps } from 'antd';

interface ISectionProps {
  title?: string;
  desc?: string;
  breadcrumb?: BreadcrumbProps['items'];
  children?: React.ReactNode;
  items?: TabsProps['items'];
  style?: React.CSSProperties;
}

const StatusPoint = ({ status }) => {
  return <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'green' }}></div>;
};
const SegmentedSection: React.FunctionComponent<ISectionProps> = props => {
  const { children, style } = props;
  const graphStatus = [
    {
      id: 'Movie-1',
      name: 'Movie-1',
      status: 'Running',
    },
    {
      id: 'Movie-2',
      name: 'Movie-2',
      status: 'Stopped',
    },
    {
      id: 'Movie-3',
      name: 'Movie-3',
      status: 'Stopped',
    },
  ];
  const options = graphStatus.map(item => {
    return {
      value: item.name,
      label: (
        <Space>
          {item.name}
          <StatusPoint status={item.status} />
        </Space>
      ),
    };
  });

  return (
    <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{ padding: '8px 8px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div>
          <Select
            variant="borderless"
            value={options[0].value}
            style={{
              flex: 1,
              //  width: '120px'
            }}
            options={options}
          />
        </div>
        <Segmented options={['Modeling', 'Importing', 'Querying']} />
        <div></div>
      </div>
      <div
        style={{
          padding: '0px 24px 24px 24px',
          flex: 1,
          background: '#fff',
          borderRadius: '8px',
          ...style,
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default SegmentedSection;
