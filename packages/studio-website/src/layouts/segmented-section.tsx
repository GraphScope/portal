import * as React from 'react';
import {
  Breadcrumb,
  Divider,
  Typography,
  Tabs,
  Segmented,
  Select,
  Space,
  Button,
  SegmentedProps,
  notification,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import { GlobalOutlined } from '@ant-design/icons';
import type { BreadcrumbProps, TabsProps } from 'antd';
import SelectGraph from './select-graph';

import { Utils } from '@graphscope/studio-components';
import { listGraphs } from '@/pages/instance/lists/service';
import { useContext, IGraph } from './useContext';

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

const getGraphOptions = () => {};

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
  const { currentnNav, graphs, graphId } = store;

  const handleChange = (value: string) => {
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
      let matchGraph: any;
      if (res) {
        if (graphId) {
          matchGraph = res.find(item => item.id === graphId);
          if (!matchGraph) {
            notification.error({
              message: 'Graph Instance Not Found',
              description: `Graph Instance ${graphId} Not Found`,
              duration: 3,
            });
          }
        } else {
          matchGraph = res.find(item => {
            return item.status === 'Running';
          });
        }
        updateStore(draft => {
          draft.graphs = res as unknown as IGraph[];
          draft.graphId = (matchGraph && matchGraph.id) || graphId;
        });
      }
    });
  }, []);

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
        <SelectGraph />

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
