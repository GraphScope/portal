import React from 'react';
import { Collapse, Segmented, Button } from 'antd';
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
  const handleSubmit = () => {
    console.log('edges', edges);
    console.log('nodes', nodes);
  };
  return (
    <div>
      <Button style={{ position: 'absolute', right: '400px' }} onClick={handleSubmit}>
        Save
      </Button>
      <Segmented
        block
        options={[
          { value: 'nodes', label: 'Vertex' },
          { value: 'edges', label: 'Edges' },
        ]}
        value={currentType}
        // onChange={value => setState({ ...state, currentType: value })}
        onChange={value =>
          updateStore(draft => {
            draft.currentType = value as 'nodes' | 'edges';
          })
        }
      />
      <div
        style={{
          position: 'absolute',
          top: '40px',
          bottom: '0px',
          left: 0,
          right: 0,
          overflow: 'scroll',
          padding: '0px 10px 0px 10px',
        }}
      >
        {currentType === 'nodes' && (
          <Collapse accordion items={nodes_items} activeKey={[currentId]} onChange={onChange} />
        )}
        {currentType === 'edges' && (
          <Collapse accordion items={edges_items} activeKey={[currentId]} onChange={onChange} />
        )}
      </div>
    </div>
  );
};

export default PropetiesEditor;
