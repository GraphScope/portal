import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { useContext, processLinks as pro } from '../../';
import { MergeOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';

interface ILinkCurvatureProps {}

const CurvatureLinks: React.FunctionComponent<ILinkCurvatureProps> = props => {
  const { store } = useContext();
  const { graph, data } = store;
  const [curvatured, setToogle] = React.useState(false);
  const handleClick = () => {
    if (graph) {
      const { nodes, edges } = data;
      if (!curvatured) {
        const links = processLinks(edges);
        graph.linkCurvature('__style_curvature');
        graph.graphData({ links, nodes });
      } else {
        const links = edges.map(item => {
          //@ts-ignore
          const { __controlPoints, __style_curvature, __nodePairId, __indexColor, ...others } = item;
          return others;
        });
        graph.graphData({ nodes, links });
      }
    }
    setToogle(!curvatured);
  };
  const title = curvatured ? 'Merge Edges' : 'UnMerge Edges';
  return (
    <Tooltip title={title} placement="left">
      <Button onClick={handleClick} icon={<MergeOutlined />} type="text" />
    </Tooltip>
  );
};

export default CurvatureLinks;

function processLinks(edges) {
  let selfLoopLinks = {};
  let sameNodesLinks = {};
  const curvatureMinMax = 0.3; //0.5;

  edges.forEach(link => {
    const source = typeof link.source === 'object' ? link.source.id : link.source;
    const target = typeof link.target === 'object' ? link.target.id : link.target;

    const __nodePairId = `${source}_${target}`;
    link.__nodePairId = __nodePairId;
    delete link.__controlPoints;

    let map = source === target ? selfLoopLinks : sameNodesLinks;

    if (!map[__nodePairId]) {
      map[__nodePairId] = [];
    }

    map[__nodePairId].push(link);
  });

  // Compute the __style_curvature for self-loop edges to avoid overlaps
  Object.keys(selfLoopLinks).forEach(id => {
    let edges = selfLoopLinks[id];
    let lastIndex = edges.length - 1;
    edges[lastIndex].__style_curvature = 1;
    let delta = (1 - curvatureMinMax) / lastIndex;
    for (let i = 0; i < lastIndex; i++) {
      edges[i].__style_curvature = curvatureMinMax + i * delta;
    }
  });

  // Compute the __style_curvature for edges sharing the same two nodes to avoid overlaps
  Object.keys(sameNodesLinks)
    .filter(__nodePairId => sameNodesLinks[__nodePairId].length > 1)
    .forEach(__nodePairId => {
      let edges = sameNodesLinks[__nodePairId];
      let lastIndex = edges.length - 1;
      let lastLink = edges[lastIndex];
      lastLink.__style_curvature = curvatureMinMax;
      let delta = (2 * curvatureMinMax) / lastIndex;
      for (let i = 0; i < lastIndex; i++) {
        edges[i].__style_curvature = -curvatureMinMax + i * delta;
        if (lastLink.source !== edges[i].source) {
          edges[i].__style_curvature *= -1; // flip it around, otherwise they overlap
        }
      }
    });
  return edges;
}
