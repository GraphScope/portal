import React from 'react';
import { Collapse } from 'antd';
import PropertiesSchema from './properties-schema';
import { useContext } from '../useContext';
import { SegmentedTabs } from '@graphscope/studio-components';
import { CaretRightOutlined } from '@ant-design/icons';
import type { ImportorProps } from '../typing';
import ValidateInfo from './properties-schema/validate-info';
import ScrollContainer, { disableScroll } from './scroll-container';
type IPropetiesEditorProps = Pick<ImportorProps, 'appMode' | 'handleUploadFile' | 'queryPrimitiveTypes'>;

const PropetiesEditor: React.FunctionComponent<IPropetiesEditorProps> = props => {
  const { store, updateStore } = useContext();
  const { nodes, edges, currentType, currentId, elementOptions } = store;
  const { appMode, handleUploadFile, queryPrimitiveTypes } = props;

  const NODES_SCROLL_ITEMS = {};
  const EDGES_SCROLL_ITEMS = {};

  const nodes_items = nodes.map((item, index) => {
    const { id, data } = item;
    const { label, properties = [] } = data || { label: id };
    NODES_SCROLL_ITEMS[id] = { index: index };
    return {
      key: id,
      label: label,
      extra: <ValidateInfo type="nodes" appMode={appMode} properties={JSON.parse(JSON.stringify(properties))} />,
      children: (
        <PropertiesSchema
          schema={JSON.parse(JSON.stringify(item))}
          type="nodes"
          queryPrimitiveTypes={queryPrimitiveTypes}
          handleUploadFile={handleUploadFile}
          appMode={appMode}
          disabled={!elementOptions.isEditable}
        />
      ),
    };
  });
  const edges_items = edges.map((item, index) => {
    const { id, data } = item;
    const { label, properties = [] } = data || { label: id };
    EDGES_SCROLL_ITEMS[id] = { index: index };
    return {
      key: id,
      label: label,
      extra: <ValidateInfo type="edges" appMode={appMode} properties={JSON.parse(JSON.stringify(properties))} />,
      children: (
        <PropertiesSchema
          schema={JSON.parse(JSON.stringify(item))}
          type="edges"
          queryPrimitiveTypes={queryPrimitiveTypes}
          handleUploadFile={handleUploadFile}
          appMode={appMode}
          disabled={!elementOptions.isEditable}
        />
      ),
    };
  });

  const onChange = (key: string | string[]) => {
    updateStore(draft => {
      draft.currentId = key[0] as string;
    });
    disableScroll();
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
              <ScrollContainer currentId={currentId} items={NODES_SCROLL_ITEMS}>
                <Collapse
                  expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  accordion
                  items={nodes_items}
                  activeKey={[currentId]}
                  onChange={onChange}
                />
              </ScrollContainer>
            ),
          },
          {
            key: 'edges',
            label: 'Edges',
            children: (
              <ScrollContainer currentId={currentId} items={EDGES_SCROLL_ITEMS}>
                <Collapse
                  expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                  accordion
                  items={edges_items}
                  activeKey={[currentId]}
                  onChange={onChange}
                />
              </ScrollContainer>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PropetiesEditor;
