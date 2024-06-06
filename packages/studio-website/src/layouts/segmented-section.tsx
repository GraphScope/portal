import * as React from 'react';
import { Breadcrumb, Divider, Typography, Tabs, Segmented, Select, Space, Button, SegmentedProps } from 'antd';
import { FormattedMessage } from 'react-intl';
import { GlobalOutlined } from '@ant-design/icons';
import type { BreadcrumbProps, TabsProps } from 'antd';
import SelectGraph from './select-graph';

import { Utils } from '@graphscope/studio-components';
import { listGraphs } from '@/pages/instance/lists/service';
import { useContext } from './useContext';
const { searchParamOf } = Utils;
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

const defaultOptions = [
  {
    label: (
      <>
        <Space>
          <GlobalOutlined style={{ color: 'green' }} />
          Movie-1
        </Space>
      </>
    ),
    value: 'movie-1',
  },
  {
    label: (
      <>
        <Space>
          <GlobalOutlined style={{ color: 'red' }} />
          Movie-2
        </Space>
      </>
    ),
    value: 'movie-2',
  },
];

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
  const { store, updateStore } = useContext();
  const { currentnNav } = store;
  const handleChange = (value: string) => {
    const graphId = searchParamOf('graph_id');
    const herf = graphId ? `${value}?${extraRouterKey}=${graphId}` : value;
    history && history.push(herf);
    updateStore(draft => {
      draft.currentnNav = value;
    });
    onChange && onChange(value);
  };
  React.useEffect(() => {
    listGraphs().then(res => {
      console.log('res', res);
    });
  }, []);

  const defaultValue = '/' + location.pathname.split('/')[1];
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
        <SelectGraph options={defaultOptions} value={''} />

        {withNav && (
          <>
            <div style={{ width: '400px' }}>
              <Segmented options={options} block onChange={handleChange} value={currentnNav} />
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
