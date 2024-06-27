import React from 'react';
import { Collapse } from 'antd';
import PropertiesSchema from './properties-schema';
import { useContext } from '../useContext';
import { SegmentedTabs } from '@graphscope/studio-components';
import { CaretRightOutlined } from '@ant-design/icons';
import type { ImportorProps } from '../typing';
import ValidateInfo from './properties-schema/validate-info';

type IPropetiesEditorProps = Pick<ImportorProps, 'appMode' | 'handleUploadFile' | 'queryPrimitiveTypes'>;

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
  const { appMode, handleUploadFile, queryPrimitiveTypes } = props;

  const nodes_items = nodes.map(item => {
    const { id, data } = item;
    const { label, properties = [] } = data || { label: id };
    return {
      key: id,
      label: label,
      extra: <ValidateInfo type="node" appMode={appMode} properties={JSON.parse(JSON.stringify(properties))} />,
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
  const edges_items = edges.map(item => {
    const { id, data } = item;
    const { label, properties = [] } = data || { label: id };

    return {
      key: id,
      label: label,
      extra: <ValidateInfo type="edge" appMode={appMode} properties={JSON.parse(JSON.stringify(properties))} />,
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
