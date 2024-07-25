import React, { useEffect, useRef } from 'react';
import { Collapse } from 'antd';
import PropertiesSchema from './properties-schema';
import { useContext } from '../useContext';
import { SegmentedTabs } from '@graphscope/studio-components';
import { CaretRightOutlined } from '@ant-design/icons';
import type { ImportorProps } from '../typing';
import ValidateInfo from './properties-schema/validate-info';
import ScrollContainer, { disableScroll } from './scroll-container';
type IPropetiesEditorProps = Pick<
  ImportorProps,
  | 'appMode'
  | 'handleUploadFile'
  | 'queryPrimitiveTypes'
  | 'batchUploadFiles'
  | 'createVertexTypeOrEdgeType'
  | 'deleteVertexTypeOrEdgeType'
>;
const { GS_ENGINE_TYPE } = window as unknown as { GS_ENGINE_TYPE: string };
const PropetiesEditor: React.FunctionComponent<IPropetiesEditorProps> = props => {
  const { store, updateStore } = useContext();
  const { nodes, edges, currentType, currentId, elementOptions } = store;
  const {
    appMode,
    handleUploadFile,
    queryPrimitiveTypes,
    batchUploadFiles,
    createVertexTypeOrEdgeType,
    deleteVertexTypeOrEdgeType,
  } = props;
  const ids = new Set();
  const itemRefs = [...nodes, ...edges].reduce((acc, curr) => {
    acc[curr.id] = { ref: React.createRef(), file: curr.data.label + '.csv' };
    ids.add(curr.id);
    return acc;
  }, {});

  //@ts-ignore
  window.ITEM_REFS = itemRefs;
  const [state, setState] = React.useState(() => {
    return {
      autoUpload: false,
    };
  });
  const { autoUpload } = state;

  const activeKey = autoUpload ? [...ids.values()] : [currentId];
  const accordion = autoUpload ? false : true;
  console.log('autoUpload', autoUpload);

  const NODES_SCROLL_ITEMS = {};
  const EDGES_SCROLL_ITEMS = {};

  const nodes_items = nodes.map((item, index) => {
    const { id, data } = item;
    const { label, properties = [], filelocation, isNewNodeOrEdge = false } = data || { label: id };
    NODES_SCROLL_ITEMS[id] = { index: index };
    /** groot 状态下是否可以编辑节点 */
    const disabled = GS_ENGINE_TYPE === 'interactive' ? !elementOptions.isConnectable : !isNewNodeOrEdge;
    return {
      key: id,
      label: label,
      extra: (
        <>
          {appMode === 'DATA_MODELING' && (
            <ValidateInfo
              type="nodes"
              filelocation={filelocation}
              appMode={appMode}
              properties={JSON.parse(JSON.stringify(properties))}
            />
          )}
        </>
      ),
      children: (
        <PropertiesSchema
          ref={itemRefs[id].ref}
          schema={JSON.parse(JSON.stringify(item))}
          type="nodes"
          queryPrimitiveTypes={queryPrimitiveTypes}
          handleUploadFile={handleUploadFile}
          appMode={appMode}
          disabled={disabled}
          createVertexTypeOrEdgeType={createVertexTypeOrEdgeType}
          deleteVertexTypeOrEdgeType={deleteVertexTypeOrEdgeType}
        />
      ),
    };
  });
  const edges_items = edges.map((item, index) => {
    const { id, data } = item;
    const { label, properties = [], filelocation, isNewNodeOrEdge = false } = data || { label: id };
    EDGES_SCROLL_ITEMS[id] = { index: index };
    /** groot 状态下是否可以编辑边 */
    const disabled = GS_ENGINE_TYPE === 'interactive' ? !elementOptions.isEditable : !isNewNodeOrEdge;
    return {
      key: id,
      label: label,
      extra: (
        <>
          {appMode === 'DATA_MODELING' && (
            <ValidateInfo
              type="edges"
              filelocation={filelocation}
              appMode={appMode}
              properties={JSON.parse(JSON.stringify(properties))}
            />
          )}
        </>
      ),
      children: (
        <PropertiesSchema
          ref={itemRefs[id].ref}
          schema={JSON.parse(JSON.stringify(item))}
          type="edges"
          queryPrimitiveTypes={queryPrimitiveTypes}
          handleUploadFile={handleUploadFile}
          appMode={appMode}
          disabled={disabled}
          createVertexTypeOrEdgeType={createVertexTypeOrEdgeType}
          deleteVertexTypeOrEdgeType={deleteVertexTypeOrEdgeType}
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
  useEffect(() => {
    if (appMode !== 'DATA_IMPORTING') {
      return;
    }

    if (batchUploadFiles) {
      updateStore(draft => {
        draft.currentType = 'edges';
      });
      setState(preState => {
        return {
          ...preState,
          autoUpload: true,
        };
      });
      batchUploadFiles().then(res => {
        if (res) {
          //@ts-ignore
          const fileRef: any = Object.values(window.ITEM_REFS).reduce((acc: any, curr: any) => {
            console.log('acc', acc, curr);
            return {
              ...acc,
              [curr.file]: curr.ref,
            };
          }, {});
          //@ts-ignore
          console.log('res', res, window.ITEM_REFS);
          res.forEach(file => {
            //@ts-ignore
            const match = fileRef[file.name];
            if (match && match.current) {
              match.current.upload(file);
            }
          });
        } else {
          setState(preState => {
            return {
              ...preState,
              autoUpload: false,
            };
          });
          updateStore(draft => {
            draft.currentType = 'nodes';
          });
        }
      });
    }
  }, []);

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
                  accordion={accordion}
                  items={nodes_items}
                  // activeKey={[currentId]}
                  //@ts-ignore
                  activeKey={activeKey}
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
                  accordion={accordion}
                  items={edges_items}
                  // activeKey={[currentId]}
                  //@ts-ignore
                  activeKey={activeKey}
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
