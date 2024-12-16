import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { useContext } from '../../';
import { MergeOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';

interface ILinkCurvatureProps {}

const CurvatureLinks: React.FunctionComponent<ILinkCurvatureProps> = props => {
  const { store } = useContext();
  const { graph, source, data } = store;
  const [curvatured, setToogle] = React.useState(false);
  const handleClick = () => {
    if (graph) {
      if (!curvatured) {
        const { nodes, edges } = processLinks(data);
        graph.linkCurvature('_style_curvature');
        graph.graphData({ links: edges, nodes });
      } else {
        graph.graphData(Utils.fakeSnapshot({ nodes: source.nodes, links: source.edges }));
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

function processLinks(graphData) {
  const data = Utils.fakeSnapshot(graphData);
  let selfLoopLinks = {};
  let sameNodesLinks = {};
  const curvatureMinMax = 0.3; //0.5;

  // 1. assign each link a nodePairId that combines their source and target independent of the edges direction
  // 2. group edges together that share the same two nodes or are self-loops
  data.edges.forEach(link => {
    link.nodePairId = link.source <= link.target ? link.source + '_' + link.target : link.target + '_' + link.source;
    let map = link.source === link.target ? selfLoopLinks : sameNodesLinks;
    if (!map[link.nodePairId]) {
      map[link.nodePairId] = [];
    }
    map[link.nodePairId].push(link);
  });

  // Compute the _style_curvature for self-loop edges to avoid overlaps
  Object.keys(selfLoopLinks).forEach(id => {
    let edges = selfLoopLinks[id];
    let lastIndex = edges.length - 1;
    edges[lastIndex]._style_curvature = 1;
    let delta = (1 - curvatureMinMax) / lastIndex;
    for (let i = 0; i < lastIndex; i++) {
      edges[i]._style_curvature = curvatureMinMax + i * delta;
    }
  });

  // Compute the _style_curvature for edges sharing the same two nodes to avoid overlaps
  Object.keys(sameNodesLinks)
    .filter(nodePairId => sameNodesLinks[nodePairId].length > 1)
    .forEach(nodePairId => {
      let edges = sameNodesLinks[nodePairId];
      let lastIndex = edges.length - 1;
      let lastLink = edges[lastIndex];
      lastLink._style_curvature = curvatureMinMax;
      let delta = (2 * curvatureMinMax) / lastIndex;
      for (let i = 0; i < lastIndex; i++) {
        edges[i]._style_curvature = -curvatureMinMax + i * delta;
        if (lastLink.source !== edges[i].source) {
          edges[i]._style_curvature *= -1; // flip it around, otherwise they overlap
        }
      }
    });
  return data;
}
