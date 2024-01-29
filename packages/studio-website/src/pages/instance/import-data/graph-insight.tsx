import { FunctionComponent } from 'react';
import Graphin, { Utils } from '@antv/graphin';
import { theme } from 'antd';
import React from 'react';
import {PropertyType} from './index'
const { useToken } = theme;
interface Props {
  children?: JSX.Element;
  pdata:{
    nodeLists:PropertyType[];
    edgeLists:PropertyType[]
  }
}

/** graphin 数据处理 */
const getVertexEdges = (nodeList: any[], edgeList: any[], token: any) => {
  const nodesMap = new Map();
  const nodes = nodeList.map((item: { key: any; label: any;bind:boolean; }) => {
    const { key, label } = item;
    nodesMap.set(key, item);
    return {
      id: label,
      style: {
        label: {
          value: `${label}(${item.bind ? '已绑定' : '未绑定'})`,
        },
        fontSize: 14,
        keyshape: {
          size: 50,
          stroke: token.colorPrimary,
          fillOpacity: 1,
          fill: token.colorPrimary,
        },
      },
    };
  });

  const edges = edgeList
    .map((item: { key: any; label: any; source: any; target: any;bind:boolean;}) => {
      const { key, label, source, target } = item;
      return {
        id: key,
        source,
        target,
        label:`${label}(${item.bind ? '已绑定' : '未绑定'})`,
        style: {
          label: {
            value: `${label}(${item.bind ? '已绑定' : '未绑定'})`,
            fill: token.colorPrimary,
            offset: [0, 0],
          },
        },
      };
    })

  // //@ts-ignore
  const processEdges = Utils.processEdges(edges, { poly: 30, loop: 20 });
  /** TODO：这个地方是Graphin的BUG，一旦走了processEdge，Offset应该不做改变 */
  processEdges.forEach(item => {
    if (item.style?.label) {
      item.style.label.offset = [0, 0];
    }
  });
  
  return { nodes, edges:processEdges };
};

const GraphInsight: FunctionComponent<Props> = props => {
  const { children,pdata } = props;
  const { token } = useToken();
  //@ts-ignore
  const graphData = getVertexEdges(pdata.nodeLists, pdata.edgeLists,token);
  console.log(graphData);
  
  return (
    <>
      {children}
      <Graphin data={graphData} layout={{ type: 'circular' }} fitView fitCenter style={{ paddingBottom: '3px' }} />
    </>
  );
};

export default GraphInsight;
