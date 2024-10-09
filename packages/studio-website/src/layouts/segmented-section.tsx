import * as React from 'react';
import { SegmentedProps, notification } from 'antd';

import { Utils } from '@graphscope/studio-components';
import { useStudioProvier } from '@graphscope/studio-components';
import { listGraphs } from '@/pages/instance/lists/service';
import { useContext, IGraph } from './useContext';
import useWidth from './useWidth';

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
  const { currentnNav, graphs, graphId, draftId, isReady } = store;
  const { token } = useStudioProvier();
  const ContainerWidth = useWidth();
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
      let matchGraph: any;
      if (res) {
        if (graphId) {
          matchGraph = res.find(item => item.id === graphId);
          if (!matchGraph) {
            if (graphId !== draftId) {
              notification.error({
                message: 'Graph Instance Not Found',
                description: `Graph Instance ${graphId} Not Found`,
                duration: 3,
              });
            }
          }
        } else {
          matchGraph = res.find(item => {
            return item.status === 'Running';
          });
        }
        updateStore(draft => {
          draft.graphs = res as unknown as IGraph[];
          draft.graphId = (matchGraph && matchGraph.id) || graphId;
          draft.isReady = true;
        });
        Utils.setSearchParams({
          graph_id: (matchGraph && matchGraph.id) || graphId,
        });
      } else {
        updateStore(draft => {
          draft.isReady = true;
        });
      }
    });
  }, []);
  const IS_QUERY = currentnNav === '/querying';

  return (
    <section
      style={{
        //@ts-ignore
        background: token.colorBgBase,
        padding: IS_QUERY ? '0px' : '4px',
        borderRadius: '8px',
        height: '100%',
        width: `${ContainerWidth - 220}px`,
        overflow: 'hidden',

        ...style,
      }}
    >
      {isReady && children}
    </section>
  );
};

export default SegmentedSection;
