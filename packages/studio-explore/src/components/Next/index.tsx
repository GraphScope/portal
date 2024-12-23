import * as React from 'react';
import { Typography, Flex, theme, Divider, Segmented } from 'antd';
import { SegmentedTabs } from '@graphscope/studio-components';
const { Title } = Typography;
import { useContext, type ForceGraphInstance } from '@graphscope/studio-graph';
import { BarChartOutlined } from '@ant-design/icons';
import Statistics from '../Statistics';
import InspectNeighbor from './Neighbors';
import CurrentStatistics from './CurrentStatistics';
import GlobalStatistics from './GlobalStatistics';
import NextStatistics from './NextStatistics';
export interface IPropertiesPanelProps {
  style?: React.CSSProperties;
}

const Next: React.FunctionComponent<IPropertiesPanelProps> = props => {
  return (
    <div>
      <GlobalStatistics />
      <CurrentStatistics />
      <NextStatistics />
    </div>
  );
};

export default Next;
