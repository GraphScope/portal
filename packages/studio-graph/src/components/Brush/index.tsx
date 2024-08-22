import React, { useRef, useEffect } from 'react';

import { useContext } from '../../hooks/useContext';
import { brush as d3Brush } from 'd3-brush';
import { select } from 'd3-selection';
interface IBrushProps {
  onSelectNodes: (e: any) => void;
}

const Brush: React.FunctionComponent<IBrushProps> = props => {
  const { onSelectNodes } = props;
  const { id, store } = useContext();
  const { graph, height, width, data } = store;
  const svgRef = useRef(null);
  const selectedNodesRef = useRef([]);

  useEffect(() => {
    if (svgRef.current) {
      const handleBrush = selection => {
        if (!selection) return;

        const [[x0, y0], [x1, y1]] = selection;
        const newSelectedNodes = data.nodes.filter(node => {
          //@ts-ignore
          const { x, y, z } = graph?.graph2ScreenCoords(node.x, node.y, 0);
          return x0 <= x && x <= x1 && y0 <= y && y <= y1;
        });
        console.log(newSelectedNodes);
      };
      const svg = select(svgRef.current);
      const brush = d3Brush()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on('start', () => {
          selectedNodesRef.current = [];
        })
        .on('brush', event => handleBrush(event.selection))
        .on('end', () => onSelectNodes(selectedNodesRef.current));

      svg.selectAll('g.brush').remove(); // Remove any existing brush group
      svg
        .append('g')
        .attr('class', 'brush')
        .call(brush)
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');

      svg.style('pointer-events', 'none');
    }
  }, [width, height, onSelectNodes]);

  return <svg ref={svgRef} width={width} height={height} style={{ position: 'absolute', top: '0px' }}></svg>;
};

export default Brush;
