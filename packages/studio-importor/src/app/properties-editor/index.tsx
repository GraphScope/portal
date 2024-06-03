import React from 'react';
import { Collapse, Segmented, Button } from 'antd';
import PropertiesSchema from './properties-schema';

import { useContext } from '../useContext';
import { SegmentedTabs } from '@graphscope/studio-components';
interface IPropetiesEditorProps {}

interface PropertiesSchema {
  /** 唯一ID */
  key: string;
  /** 类型 */
  label: string;
  properties: {
    [key: string]: string;
  };
}
interface EdgeSchema extends PropertiesSchema {
  source: string;
  target: string;
}

const Wrap = ({ children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '65px',
        bottom: '0px',
        left: 0,
        right: 0,
        overflow: 'scroll',
        padding: '0px 10px 0px 10px',
      }}
    >
      {children}
    </div>
  );
};
const PropetiesEditor: React.FunctionComponent<IPropetiesEditorProps> = props => {
  const { store, updateStore } = useContext();
  const { nodes, edges, currentType, currentId } = store;

  const nodes_items = nodes.map(item => {
    const { id, data } = item;
    const { label } = data || { label: id };
    return {
      key: id,
      label: label,
      //@ts-ignore
      children: <PropertiesSchema data={item} type="nodes" {...props} />,
    };
  });
  const edges_items = edges.map(item => {
    const { id, data } = item;
    const { label } = data || { label: id };
    return {
      key: id,
      label: label,
      //@ts-ignore
      children: <PropertiesSchema data={item} type="edges" {...props} />,
    };
  });

  const onChange = (key: string | string[]) => {
    updateStore(draft => {
      draft.currentId = key[0] as string;
    });
  };

  return (
    <div>
      <SegmentedTabs
        block
        queryKey="element"
        items={[
          {
            key: 'nodes',
            label: 'Vertex',
            children: (
              <Wrap>
                <Collapse accordion items={nodes_items} activeKey={[currentId]} onChange={onChange} />
              </Wrap>
            ),
          },
          {
            key: 'edges',
            label: 'Edges',
            children: (
              <Wrap>
                <Collapse accordion items={edges_items} activeKey={[currentId]} onChange={onChange} />
              </Wrap>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PropetiesEditor;
