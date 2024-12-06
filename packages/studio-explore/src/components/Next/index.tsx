import * as React from 'react';
import { Typography, Flex, theme, Divider } from 'antd';
import { Illustration } from '@graphscope/studio-components';
const { Title } = Typography;
import { useContext, type ForceGraphInstance } from '@graphscope/studio-graph';

import { CollapseCard } from '@graphscope/studio-components';
import { getSelectData } from './utils';
import Inspect from './Inspect';
import InspectNeighbor from './Neighbors';

export interface IPropertiesPanelProps {
  style?: React.CSSProperties;
}

const Next: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { store, updateStore } = useContext();
  const { nodeStatus, data, edgeStatus, graph } = store;
  const { token } = theme.useToken();

  const { data: selectData, type } = getSelectData(data, { nodeStatus, edgeStatus });

  if (selectData.length === 1) {
    const node = selectData[0];
    const position = (graph as ForceGraphInstance).graphData().nodes.filter(item => item.id === node.id);
    console.log(position);
    const rootStyle: React.CSSProperties = {
      display: 'flex',
      position: 'absolute',
      top: '12px',
      bottom: '12px',
      right: '280px',
      width: '300px',
      boxShadow: token.boxShadow,
      zIndex: 1999,
      background: token.colorBgContainer,
      borderRadius: token.borderRadius,
      padding: token.padding,
    };
    return (
      <Flex gap={12} style={rootStyle} vertical>
        <Flex justify="space-between">
          <Typography.Title level={5} style={{ margin: 0 }}>
            Think One More Step
          </Typography.Title>
          <Illustration.FunArrow
            style={{ width: '30px', height: '30px', transform: 'rotate(190deg)', color: token.colorPrimary }}
          />
        </Flex>
        {/* <Flex justify="end">
          <Typography.Title level={5} style={{ margin: 0 }}>
            Think One More Step
          </Typography.Title>
        </Flex> */}
        <InspectNeighbor data={selectData} />
      </Flex>
    );
  }
  return null;
};

export default Next;
