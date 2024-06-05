import * as React from 'react';
import { Breadcrumb, Divider, Typography, Tabs, Segmented, Select, Space, Button, SegmentedProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import { GlobalOutlined } from '@ant-design/icons';
import type { BreadcrumbProps, TabsProps } from 'antd';
import ConnectModal from '../ConnectModal';
import { searchParamOf } from '../Utils';

interface ISectionProps {
  value: string;
  options: SegmentedProps['options'];
  title?: string;
  desc?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  withNav?: boolean;
  connectStyle?: React.CSSProperties;
  onChange?: SegmentedProps['onChange'];
  /** 额外需要转发的url信息，默认为 graph_id */
  extraRouterKey?: string;
  history?: any;
}

const StatusPoint = ({ status }) => {
  return <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'green' }}></div>;
};

const SegmentedSection: React.FunctionComponent<ISectionProps> = props => {
  const {
    children,
    style,
    value,
    withNav,
    connectStyle,
    options,
    onChange,
    extraRouterKey = 'graph_id',
    history,
  } = props;
  const handleChange = value => {
    const graphId = searchParamOf('graph_id');
    const herf = graphId ? `${value}?${extraRouterKey}=${graphId}` : value;
    history && history.push(herf);
    onChange && onChange(value);
  };
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
              <Segmented options={options} block value={value} onChange={handleChange} />
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