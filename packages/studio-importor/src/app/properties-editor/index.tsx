import React, { useEffect } from 'react';
import { Collapse, Segmented, Button } from 'antd';
import PropertiesSchema from './properties-schema';

import { useContext } from '../useContext';
import { SegmentedTabs } from '@graphscope/studio-components';
import { CaretRightOutlined } from '@ant-design/icons';

interface IPropetiesEditorProps {}

const StyleWrap = ({ children }) => {
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
  const { nodes, edges, currentType, currentId, elementOptions } = store;

  const nodes_items = nodes.map(item => {
    const { id, data } = item;
    const { label } = data || { label: id };
    return {
      key: id,
      label: label,
      //@ts-ignore
      children: <PropertiesSchema schema={item} type="nodes" {...props} disabled={!elementOptions.isEditable} />,
    };
  });
  const edges_items = edges.map(item => {
    const { id, data } = item;
    const { label } = data || { label: id };

    return {
      key: id,
      label: label,
      //@ts-ignore
      children: <PropertiesSchema schema={item} type="edges" {...props} disabled={!elementOptions.isEditable} />,
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
        value={currentType}
        // onChange={value => setState({ ...state, currentType: value })}
        onChange={value =>
          updateStore(draft => {
            draft.currentType = value as 'nodes' | 'edges';
          })
        }
        items={[
          {
            key: 'nodes',
            label: 'Vertex',
            children: (
              <StyleWrap>
                <Collapse
                  expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  accordion
                  items={nodes_items}
                  activeKey={[currentId]}
                  onChange={onChange}
                />
              </StyleWrap>
            ),
          },
          {
            key: 'edges',
            label: 'Edges',
            children: (
              <StyleWrap>
                <Collapse
                  expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  accordion
                  items={edges_items}
                  activeKey={[currentId]}
                  onChange={onChange}
                />
              </StyleWrap>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PropetiesEditor;
