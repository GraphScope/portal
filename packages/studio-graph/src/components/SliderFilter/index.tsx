import React from 'react';
import { Slider, Button } from 'antd';
import { useContext, type GraphData } from '../../';

interface ISliderFilterProps {}

export interface IFilterCriteria {
  id: string;
  // 筛选属性值
  prop?: string;
  elementType?: 'node' | 'edge';
  analyzerType?: 'HISTOGRAM' | 'SELECT' | 'PIE' | 'WORDCLOUD' | 'NONE' | 'DATE' | 'COLUMN' | 'SLIDER';
  range?: number[];
  defaultKey?: string;
}

export const filterGraphData = (data: GraphData, filter: IFilterCriteria) => {
  const { prop, range, elementType } = filter;
  let newEdges;
  let newNodes;
  const validNodes = new Set<string>();
  if (elementType === 'edge') {
    newEdges = data.edges.filter(item => {
      const { id, label, properties, source, target } = item;
      if (range && properties && prop) {
        const [min, max] = range;
        const match = properties[prop] >= min && properties[prop] <= max;
        if (match) {
          validNodes.add(source);
          validNodes.add(target);
        }
        return match;
      }
    });
    newNodes = data.nodes.filter(node => validNodes.has(node.id));
  }
  return {
    nodes: newNodes,
    edges: newEdges,
  };
};

const SliderFilter: React.FunctionComponent<ISliderFilterProps> = props => {
  const { updateStore } = useContext();

  const onChangeComplete = value => {
    updateStore(draft => {
      console.log('onChangeComplete', value, draft.source);
      const newData = filterGraphData(draft.source, {
        id: 'slider-filter',
        prop: 'weight',
        elementType: 'edge',
        range: value,
      });

      draft.data = newData;
    });
  };
  const handleRest = () => {
    updateStore(draft => {
      draft.data = draft.source;
    });
  };
  return (
    <div>
      <Slider range defaultValue={[0.5, 1]} max={1} min={0.5} step={0.01} onChangeComplete={onChangeComplete} />
      <Button block onClick={handleRest}>
        reset
      </Button>
    </div>
  );
};

export default SliderFilter;
