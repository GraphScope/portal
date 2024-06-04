import * as React from 'react';
import { Breadcrumb, Divider, Typography, Tabs, Segmented, Select, Space, Button, SegmentedProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import { GlobalOutlined } from '@ant-design/icons';
import type { BreadcrumbProps, TabsProps } from 'antd';
import ConnectModal from '../ConnectModal';

interface ISectionProps {
  title?: string;
  desc?: string;
  children?: React.ReactNode;
  options: SegmentedProps['options'];
  style?: React.CSSProperties;
  value?: string;
  withNav?: boolean;
  connectStyle?: React.CSSProperties;
}

const StatusPoint = ({ status }) => {
  return <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'green' }}></div>;
};

const SegmentedSection: React.FunctionComponent<ISectionProps> = props => {
  const { children, style, value, withNav, connectStyle, options } = props;

  const handleClick = () => {};

  return (
    <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '8px 8px 16px 8px',
          display: 'flex',
          alignItems: 'center',
          // justifyContent: withNav ? 'space-between' : 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button type="text" icon={<GlobalOutlined style={{ color: 'green' }} />} onClick={handleClick}>
          Movie-1
        </Button>

        {withNav && (
          <>
            <div style={{ width: '400px' }}>
              <Segmented options={options} block value={value} />
            </div>
            <div></div>
          </>
        )}
      </div>
      <div
        style={{
          padding: '4px',
          flex: 1,
          background: '#fff',
          borderRadius: '4px',
          ...style,
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default SegmentedSection;
