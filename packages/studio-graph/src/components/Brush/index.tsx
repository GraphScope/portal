import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { brush as d3Brush } from 'd3-brush';
import { select } from 'd3-selection';
import { FormattedMessage } from 'react-intl';
import { useContext } from '../../';
import { Button, Tooltip, TooltipProps } from 'antd';
import { Icons } from '@graphscope/studio-components';

interface IBrushProps {
  onSelect?: (values: any) => void;
  title?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
}

const Brush: React.FunctionComponent<IBrushProps> = props => {
  const { onSelect, title = 'Select nodes by box selection', placement = 'left' } = props;
  const { store, updateStore, id } = useContext();
  const { graph, data } = store;

  const brushRef = useRef<SVGSVGElement>(null);
  const [isBrushActive, setIsBrushActive] = useState(false);
  const handleSelect = selectedNodes => {
    const nodeStatus = data.nodes.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: {
          disabled: true,
        },
      };
    }, {});

    selectedNodes.forEach(item => {
      nodeStatus[item.id] = {
        disabled: false,
        selected: true,
      };
    });

    updateStore(draft => {
      draft.nodeStatus = nodeStatus;
      draft.selectNodes = selectedNodes;
    });
    onSelect && onSelect(selectedNodes);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter') {
        setIsBrushActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClick = () => {
    setIsBrushActive(preState => {
      return !preState;
    });
  };

  useEffect(() => {
    const svg = select(brushRef.current);
    if (isBrushActive && graph) {
      const { nodes = [] } = graph.graphData() || {};
      const brush = d3Brush()
        .extent([
          [0, 0],
          //@ts-ignore
          [svg.node().clientWidth, svg.node().clientHeight],
        ])
        .on('end', event => {
          if (!event.selection) return;
          const [[x0, y0], [x1, y1]] = event.selection;

          const p0 = graph.screen2GraphCoords(x0, y0, 0);
          const p1 = graph.screen2GraphCoords(x1, y1, 0);

          const selectedNodes = nodes.filter(node => {
            //@ts-ignore
            return node.x >= p0.x && node.x <= p1.x && node.y >= p0.y && node.y <= p1.y;
          });
          handleSelect(selectedNodes);
        });

      svg.append('g').attr('class', 'brush').call(brush);
    }
    return () => {
      svg.select('.brush').remove();
    };
  }, [isBrushActive, onSelect, graph]);
  const style: React.CSSProperties = isBrushActive
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'rgba(0, 0, 0, 0.05)',
      }
    : {
        display: 'none',
      };
  //@ts-check
  const trigetDOM = document.getElementById(`GRAPH_${id}`);
  if (!trigetDOM) {
    return null;
  }
  return (
    <>
      <Tooltip placement={placement} title={<FormattedMessage id={`${title}`} />}>
        <Button icon={<Icons.Lasso />} type="text" onClick={handleClick} />
      </Tooltip>
      {ReactDOM.createPortal(<svg ref={brushRef} style={style} />, trigetDOM)}
    </>
  );
};

export default Brush;
