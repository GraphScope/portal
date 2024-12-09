import { useContext } from '../../hooks/useContext';
import { useEffect } from 'react';
import { Utils } from '@graphscope/studio-components';

export function calculateRenderTime(N: number) {
  let groups = Math.floor((N - 1) / 500); // 超过基础1个点后，每500个点为一组
  let extraTime = groups * 0.5; // 每组增加0.5秒
  let renderTime = 1.2 + extraTime; // 加上基础的0.5秒
  return Math.min(renderTime, 15) * 1000; // 确保渲染时间不超过15秒
}

export const useData = () => {
  const { store } = useContext();
  const { data, graph } = store;

  useEffect(() => {
    if (graph) {
      console.log('data effect');
      const new_data = Utils.fakeSnapshot({ nodes: data.nodes, links: data.edges });
      const renderTime = calculateRenderTime(new_data.nodes.length);
      graph.cooldownTime(renderTime);
      graph.onEngineStop(() => {
        console.log('engine stop');
      });
      graph.graphData(new_data);
    }
  }, [data, graph]);
};
