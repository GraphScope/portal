import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'antd';
import { useContext, type GraphSchema } from '../../../';
import { handleExpand, applyStatus } from './utils';
import { ShareAltOutlined } from '@ant-design/icons';
import { useDynamicStyle } from '@graphscope/studio-components';

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
  query: (params: { schema: GraphSchema }) => Promise<Record<string, { label: string; key: string }[]>>;
}

const NeighborNeighbor: React.FunctionComponent<INeighborQueryProps> = props => {
  const { store, updateStore } = useContext();
  const { schema, selectNodes, emitter, graph, getService } = store;
  useDynamicStyle(
    `
    .studio-graph-neighbor-query .ant-menu-vertical .ant-menu-submenu-title{
        padding-inline:12px !important;
    }
    .studio-graph-neighbor-query .ant-menu .ant-menu-submenu-title .anticon span {
        margin-inline-start:8px !important;
    }
  `,
    'studio-neighbor-query',
  );

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

  if (selectNodes.length === 0) {
    return null;
  }

  const onClick = async ({ key }) => {
    emitter?.emit('canvas:click');
    updateStore(draft => {
      draft.isLoading = true;
    });
    const selectIds = selectNodes.map(item => item.id);
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

  const defaultChildren = itemMap['all'];
  const items =
    selectNodes.length === 1
      ? [
          {
            icon: <ShareAltOutlined />,
            key: 'NeighborQuery',
            label: 'NeighborQuery',
            //@ts-ignore
            children: itemMap[selectNodes[0].label] || defaultChildren,
          },
        ]
      : [
          {
            icon: <ShareAltOutlined />,
            key: 'NeighborQuery',
            label: 'NeighborQuery',
            children: defaultChildren,
          },
        ];
  console.log(items, itemMap);
  return (
    <div ref={MenuRef} className="studio-graph-neighbor-query">
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
        items={items}
      />
    </div>
  );
};

export default NeighborNeighbor;
