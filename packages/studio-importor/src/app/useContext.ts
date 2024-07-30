import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import type { Node, Edge } from 'reactflow';
import React from 'react';
import { fakeSnapshot } from './utils';
import { ISchemaNode, ISchemaEdge } from './typing';
export type IStore = {
  /** APP类型 */
  appMode: 'DATA_MODELING' | 'DATA_IMPORTING';
  /**不可编辑状态 */
  disabled: boolean;

  currentType: 'nodes' | 'edges';
  currentId: string;
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
  source: {
    nodes: ISchemaNode[];
    edges: ISchemaEdge[];
  };

  displayMode: 'graph' | 'table';
  graphPosition: Record<string, { x: number; y: number }>;
  tablePosition: Record<string, { x: number; y: number }>;
  theme: {
    primaryColor: string;
  };
  collapsed: {
    left: boolean;
    right: boolean;
  };
  hasLayouted: boolean;
  elementOptions: {
    /** 是否能够连线，包括拖拽产生节点 */
    isClickable: boolean;
    /** 是否可以点击，包含点和边 */
    isEditable: boolean;
    /** 是否可以编辑标签，包括节点和边 */
    isConnectable: boolean;
  };
  /** 是否保存原始上传的文件 */
  isSaveFiles?: boolean;
  csvFiles: File[];
};

export const initialStore: IStore = {
  /** APP类型 */
  appMode: 'DATA_MODELING',
  /**不可编辑状态 */
  disabled: false,
  nodes: [],
  edges: [],
  source: {
    nodes: [],
    edges: [],
  },
  displayMode: 'graph',
  graphPosition: {},
  tablePosition: {},
  currentType: 'nodes',
  currentId: '',
  theme: {
    primaryColor: '#1978FF',
  },
  collapsed: {
    left: true,
    right: true,
  },
  hasLayouted: false,
  elementOptions: {
    isClickable: true,
    isEditable: true,
    isConnectable: true,
  },
  csvFiles: [],
};
export const StoreMap = new Map();
//@ts-ignore
window.StoreMap = StoreMap;
type ContextType = {
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

export const IdContext = React.createContext<{ id: string }>({
  id: '',
});

export const getProxyStoreById = (ContextId: string) => {
  if (ContextId) {
    const prevStore = StoreMap.get(ContextId);
    if (!prevStore) {
      /** 考虑SDK多实例的场景 */
      StoreMap.set(ContextId, proxy(fakeSnapshot(initialStore)));
    }
  }

  return StoreMap.get(ContextId);
};

export function useContext(): ContextType {
  const { id } = React.useContext(IdContext);
  const proxyStore = getProxyStoreById(id);
  const store = useSnapshot(proxyStore);
  return {
    store,
    updateStore: (fn: (draft) => void) => {
      return fn(proxyStore);
    },
  };
}
