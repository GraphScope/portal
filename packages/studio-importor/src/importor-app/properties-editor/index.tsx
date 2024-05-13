import React from 'react';
import { Collapse, Segmented } from 'antd';
import PropertiesSchema from './properties-schema';
// import LabelSwitch from './label-switch';
import { useContext } from '../useContext';
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

const PropetiesEditor: React.FunctionComponent<IPropetiesEditorProps> = props => {
  const { store, updateStore } = useContext();
  const { nodes, edges, currentType, currentId } = store;
  // const [state, setState] = React.useState<{
  //   currentType: 'nodes' | 'edges';
  //   nodes: PropertiesSchema[];
  //   edges: EdgeSchema[];
  // }>({
  //   currentType: 'nodes',
  //   nodes: [
  //     {
  //       key: 'n_1',
  //       label: 'person',
  //       properties: {
  //         name: 'node1',
  //       },
  //     },
  //     {
  //       key: 'n_2',
  //       label: 'software',
  //       properties: {
  //         name: 'node1',
  //       },
  //     },
  //   ],
  //   edges: [
  //     {
  //       key: 'e_0',
  //       label: 'knows',
  //       properties: {
  //         name: 'node1',
  //       },
  //       source: '1',
  //       target: '2',
  //     },
  //   ],
  // });

  // const { currentType, nodes, edges } = state;
  const nodes_items = nodes.map(item => {
    const { id, data } = item;
    const { label } = data || { label: id };
    return {
      key: id,
      label: label,
      children: <PropertiesSchema data={item} type="nodes" />,
    };
  });
  const edges_items = edges.map(item => {
    const { id, data } = item;
    const { label } = data || { label: id };
    return {
      key: id,
      label: label,
      children: <PropertiesSchema data={item} type="edges" />,
    };
  });

  const onChange = (key: string | string[]) => {
    updateStore(draft => {
      draft.currentId = key[0] as string;
    });
  };

  return (
    <div>
      <Segmented
        options={['nodes', 'edges']}
        value={currentType}
        // onChange={value => setState({ ...state, currentType: value })}
        onChange={value =>
          updateStore(draft => {
            draft.currentType = value as 'nodes' | 'edges';
          })
        }
      />
      {currentType === 'nodes' && (
        <Collapse accordion items={nodes_items} activeKey={[currentId]} onChange={onChange} />
      )}
      {currentType === 'edges' && (
        <Collapse accordion items={edges_items} activeKey={[currentId]} onChange={onChange} />
      )}
    </div>
  );
};

export default PropetiesEditor;
