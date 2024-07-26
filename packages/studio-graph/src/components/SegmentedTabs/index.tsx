import React, { useEffect, useState } from 'react';
import { SegmentedTabs as CommonSegmentedTabs, SegmentedTabsProps } from '@graphscope/studio-components';
import { useContext } from '../../hooks/useContext';
interface ISegmentedTabsProps extends SegmentedTabsProps {
  nodeClickTab: string;
  canvasClickTab: string;
}

const SegmentedTabs: React.FunctionComponent<ISegmentedTabsProps> = props => {
  const { store } = useContext();
  const { emitter } = store;
  const { nodeClickTab, canvasClickTab, items, ...otherProps } = props;
  const [state, setState] = useState({
    value: canvasClickTab,
  });
  const { value } = state;

  const onChange = val => {
    setState(preState => {
      return {
        ...preState,
        value: val,
      };
    });
  };
  useEffect(() => {
    const handleNodeClick = e => {
      setState(preState => {
        return {
          ...preState,
          value: nodeClickTab,
        };
      });
    };
    const handleCanvasClick = () => {
      setState(preState => {
        return {
          ...preState,
          value: canvasClickTab,
        };
      });
    };
    emitter?.on('node:click', handleNodeClick);
    emitter?.on('canvas:click', handleCanvasClick);
    return () => {
      emitter?.off('node:click', handleNodeClick);
      emitter?.off('canvas:click', handleCanvasClick);
    };
  }, [emitter]);

  return <CommonSegmentedTabs items={items} value={value} onChange={onChange} {...otherProps} queryKey="graph-tab" />;
};

export default SegmentedTabs;
