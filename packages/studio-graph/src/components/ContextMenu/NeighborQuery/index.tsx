import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'antd';
import { useContext, getDataMap, type GraphSchema } from '../../../';
import { handleExpand, applyStatus } from './utils';

interface INeighborQueryProps {}

export interface INeighborQueryData {
  id: 'queryNeighborData';
  query: (params: {
    /** 每个menu item 点击的回调值 */
    key: string;
    /** 当前选择的一批节点id */
    selectIds: string[];
  }) => Promise<any>;
}
export interface INeighborQueryItems {
  id: 'queryNeighborItems';
  query: (params: { schema: GraphSchema }) => Promise<Record<string, { label: string; value: string }[]>>;
}

const getScript = (ids, dataMap) => {};

const NeighborNeighbor: React.FunctionComponent<INeighborQueryProps> = props => {
  const { store, updateStore } = useContext();
  const { nodeStatus, schema, dataMap, emitter, graph, data, getService } = store;

  const MenuRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    itemMap: {},
    isLoading: false,
  });
  const { itemMap } = state;
  const getMenuItems = async () => {
    const itemResult = await getService<INeighborQueryItems>('queryNeighborItems')({
      schema,
    });
    setState(preState => {
      return {
        ...preState,
        itemMap: itemResult,
      };
    });
  };
  useEffect(() => {
    getMenuItems();
  }, [schema]);

  const selectIds = Object.keys(nodeStatus).filter(key => {
    return nodeStatus[key].selected;
  });
  const selectNode = data.nodes.find(item => item.id === selectIds[0]); // dataMap[selectId] || {};
  if (!selectNode) {
    return null;
  }

  const onClick = async ({ key }) => {
    emitter?.emit('canvas:click');
    updateStore(draft => {
      draft.isLoading = true;
    });

    const res = await getService<INeighborQueryData>('queryNeighborData')({
      selectIds,
      key,
    });

    if (res.nodes.length > 0 && graph) {
      const { nodeStatus, edgeStatus } = applyStatus(res, item => {
        return { selected: true };
      });
      const newData = handleExpand(graph, res, selectIds);
      updateStore(draft => {
        draft.data = newData;
        draft.dataMap = getDataMap(newData);
        draft.nodeStatus = nodeStatus;
        draft.edgeStatus = edgeStatus;
        draft.isLoading = false;
        draft.focusNodes = res.nodes.map(item => item.id);
      });
    } else {
      updateStore(draft => {
        draft.isLoading = false;
      });
    }
  };

  return (
    <div ref={MenuRef}>
      <Menu
        getPopupContainer={node => {
          if (MenuRef.current) {
            return MenuRef.current;
          }
          return node;
        }}
        onClick={onClick}
        style={{ margin: '0px', padding: '0px', width: '103%' }}
        mode="vertical"
        items={[
          {
            key: 'NeighborQuery',
            label: 'NeighborQuery',
            //@ts-ignore
            children: itemMap[selectNode.label],
          },
        ]}
      />
    </div>
  );
};

export default NeighborNeighbor;
