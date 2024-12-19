import React, { useEffect, useRef } from 'react';
import { Collapse, Space } from 'antd';
import PropertiesSchema from './properties-schema';
import { useContext } from '@graphscope/use-zustand';
import { SegmentedTabs, Utils } from '@graphscope/studio-components';
import { CaretRightOutlined } from '@ant-design/icons';
import type { ImportorProps } from '../typing';
import ValidateInfo from './properties-schema/validate-info';
import SaveButton from './properties-schema/save';
import DeleteButton from './properties-schema/delete';
import ScrollContainer, { disableScroll } from './scroll-container';
import { useIntl } from 'react-intl';
type IPropetiesEditorProps = Pick<
  ImportorProps,
  'appMode' | 'handleUploadFile' | 'queryPrimitiveTypes' | 'batchUploadFiles' | 'onCreateLabel' | 'onDeleteLabel'
>;
const PropetiesEditor: React.FunctionComponent<IPropetiesEditorProps> = props => {
  const intl = useIntl();
  const { store, updateStore } = useContext();
  const { nodes, edges, currentType, currentId, elementOptions } = store;
  const { appMode, handleUploadFile, queryPrimitiveTypes, batchUploadFiles, onCreateLabel, onDeleteLabel } = props;
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

  const NODES_SCROLL_ITEMS = {};
  const EDGES_SCROLL_ITEMS = {};
  const nodesMap = {};

  const nodes_items = nodes.map((item, index) => {
    const { id, data } = item;
    const { label, properties = [], filelocation } = data || { label: id };
    NODES_SCROLL_ITEMS[id] = { index: index };
    nodesMap[id] = item;

    return {
      key: id,
      label: label,
      extra: (
        <Space>
          <SaveButton schema={item} type="nodes" onCreateLabel={onCreateLabel} />
          <DeleteButton schema={item} type="nodes" onDeleteLabel={onDeleteLabel} />
          <ValidateInfo
            type="nodes"
            filelocation={filelocation}
            appMode={appMode}
            properties={JSON.parse(JSON.stringify(properties))}
          />
        </Space>
      ),
      children: (
        <PropertiesSchema
          ref={itemRefs[id].ref}
          schema={JSON.parse(JSON.stringify(item))}
          type="nodes"
          queryPrimitiveTypes={queryPrimitiveTypes}
          handleUploadFile={handleUploadFile}
          appMode={appMode}
        />
      ),
    };
  });
  const edges_items = edges.map((item, index) => {
    const { id, data } = item;
    const { label, properties = [], filelocation } = data || { label: id };
    EDGES_SCROLL_ITEMS[id] = { index: index };

    return {
      key: id,
      label: label,
      extra: (
        <Space>
          <SaveButton nodesMap={nodesMap} schema={item} type="edges" onCreateLabel={onCreateLabel} />
          <DeleteButton nodesMap={nodesMap} schema={item} type="edges" onDeleteLabel={onDeleteLabel} />
          <ValidateInfo
            type="edges"
            filelocation={filelocation}
            appMode={appMode}
            properties={JSON.parse(JSON.stringify(properties))}
          />
        </Space>
      ),
      children: (
        <PropertiesSchema
          ref={itemRefs[id].ref}
          schema={JSON.parse(JSON.stringify(item))}
          type="edges"
          queryPrimitiveTypes={queryPrimitiveTypes}
          handleUploadFile={handleUploadFile}
          appMode={appMode}
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
  const initialize = async () => {
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
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      initialize();
    }, 200);
    return () => {
      clearTimeout(timer);
    };
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
            label: intl.formatMessage({ id: 'Vertex' }),
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
            label: intl.formatMessage({ id: 'Edges' }),
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
