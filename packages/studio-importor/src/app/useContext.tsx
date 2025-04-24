import React, { useMemo, useContext as useReactContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ISchemaNode, ISchemaEdge } from './typing';
import StoreProvider, { useContext as useZustandContext } from '@graphscope/use-zustand';
import { useGraphStore, GraphProvider } from '@graphscope/studio-flow-editor';
import type { GraphState } from '@graphscope/studio-flow-editor';

export type IStore = {
  /** APP类型 */
  appMode: 'DATA_MODELING' | 'DATA_IMPORTING' | 'PURE';
  /**不可编辑状态 */
  disabled: boolean;
  isReady: boolean;
  source: {
    nodes: ISchemaNode[];
    edges: ISchemaEdge[];
  };
  graphPosition: Record<string, { x: number; y: number }>;
  tablePosition: Record<string, { x: number; y: number }>;
  collapsed: {
    left: boolean;
    right: boolean;
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
  source: {
    nodes: [],
    edges: [],
  },
  isReady: false,
  graphPosition: {},
  tablePosition: {},
  collapsed: {
    left: true,
    right: true,
  },
  csvFiles: [],
  isSaveFiles: true,
};
const ImportorInstanceContext = React.createContext<string | null>(null);

export const ImportorProvider: React.FC<{ children: React.ReactNode; id?: string }> = props => {
  const { children, id } = props;
  const instanceId = useMemo(() => {
    return id || `importor-${uuidv4()}`;
  }, []);
  console.log('ImportorProvider instanceId::: ', instanceId);
  return (
    <GraphProvider>
      <ImportorInstanceContext.Provider value={instanceId}>
        <StoreProvider id={instanceId} store={{ ...initialStore }}>
          {children}
        </StoreProvider>
      </ImportorInstanceContext.Provider>
    </GraphProvider>
  );
};

export const useContext: any = (id?: string) => {
  const instanceId = useReactContext(ImportorInstanceContext);
  if (!instanceId) {
    throw new Error('请在 GraphProvider 内使用 useImportorStore');
  }
  const { store: importorStore, updateStore: updateImportorStore } = useZustandContext(id);
  // 获取 Graph 的 store
  const { store: graphStore, updateStore: updateGraphStore } = useGraphStore();

  // 统一的更新方法
  const updateStore = (fn: (draft: IStore | GraphState) => void) => {
    // 更新 Importor store
    updateImportorStore((draft: IStore) => {
      const importorKeys = Object.keys(initialStore);
      fn(draft);
      // 删除不属于 Importor store 的属性
      Object.keys(draft).forEach(key => {
        if (!importorKeys.includes(key) && key !== 'updateStore') {
          delete draft[key];
        }
      });
    });

    // 更新 Graph store
    updateGraphStore((draft: GraphState) => {
      const graphKeys = Object.keys(graphStore) as (keyof GraphState)[];
      fn(draft);
      // 删除不属于 Graph store 的属性
      Object.keys(draft).forEach(key => {
        if (!graphKeys.includes(key as keyof GraphState) && key !== 'updateStore') {
          delete draft[key];
        }
      });
    });
  };

  return {
    // 合并两个 store 的数据
    store: {
      ...importorStore,
      ...graphStore,
    },
    // 提供统一的更新方法
    updateStore,
    // 也提供单独更新某个 store 的方法
    updateImportorStore,
    updateGraphStore,
  };
};
