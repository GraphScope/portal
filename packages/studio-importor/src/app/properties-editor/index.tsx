import React, { useMemo } from 'react';
import { Collapse } from 'antd';
import PropertiesSchema from './properties-schema';
import type {} from '../typing';
import { useContext } from '../useContext';
import { SegmentedTabs } from '@graphscope/studio-components';
import { CaretRightOutlined } from '@ant-design/icons';
import type { ImportorProps } from '../typing';

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

  const commonProps = useMemo(
    () => ({
      appMode,
      handleUploadFile,
      queryPrimitiveTypes,
      disabled: !elementOptions.isEditable,
    }),
    [appMode, handleUploadFile, queryPrimitiveTypes, elementOptions.isEditable],
  );
  const createItems = (items, type) =>
    items.map(({ id, data }) => {
      const label = data?.label || id;
      return {
        key: id,
        label,
        children: (
          <PropertiesSchema
            schema={JSON.parse(JSON.stringify(items.find(item => item.id === id)))}
            type={type}
            {...commonProps}
          />
        ),
      };
    });

  const nodes_items = useMemo(() => createItems(nodes, 'nodes'), [nodes, commonProps]);
  const edges_items = useMemo(() => createItems(edges, 'edges'), [edges, commonProps]);

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
