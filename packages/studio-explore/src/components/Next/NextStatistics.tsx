import * as React from 'react';
import Statistics from '../Statistics';
import { useContext } from '@graphscope/studio-graph';
import Neighbors from './Neighbors';
interface IGlobalStatisticsProps {}

const NextStatistics: React.FunctionComponent<IGlobalStatisticsProps> = props => {
  const { store } = useContext();
  const { data, selectNodes } = store;
  const match = selectNodes.length !== 0;
  if (!match) {
    return null;
  }
  return (
    <div>
      <Neighbors />
    </div>
  );
};

export default NextStatistics;
