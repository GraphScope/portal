import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import type { TransformedNode, TransformedEdge } from '@/components/utils/schema';
export interface Extra {
  /** 数据源类型 */
  datatype: string;
  /** 文件位置 */
  filelocation: string;
  /** 是否绑定 isBind */
  isBind: boolean;
  dataFields?: string[];
  delimiter?: string;
  isEidtInput?: boolean;
}
export type BindingNode = TransformedNode & Extra;
export type BindingEdge = TransformedEdge & Extra;

export type IStore = {
  graphName: string;
  currentType: string;
  nodes: BindingNode[];
  edges: BindingEdge[];
  isReady: boolean;
  schema: any;
};

export const initialStore: IStore = {
  /** 图名字 */
  graphName: '',
  /** 数据源 currentType */
  currentType: 'node',
  /** 节点 */
  nodes: [],
  /** 边 */
  edges: [],
  isReady: false,
  schema: {
    nodes: [],
    edges: [],
  },
};
export const initialDataMap: Record<string, BindingNode | BindingEdge> = {};

type ContextType<T> = {
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

const proxyStore = proxy(initialStore);
export function useContext<T>(): ContextType<T> {
  const store = useSnapshot(proxyStore);
  return {
    store,
    updateStore: (fn: (draft: IStore) => void) => {
      return fn(proxyStore);
    },
  };
}
export function clearStore() {
  Object.keys(proxyStore).forEach(key => {
    //@ts-ignore
    proxyStore[key] = initialStore[key];
  });
}

/** 节点和边的配置，每次改动会带来大量重绘，因此单独把数据拿出来，做成 data map */
const proxyDataMap = proxy(initialDataMap);

export function useDataMap() {
  return useSnapshot(proxyDataMap);
}
export function updateDataMap(fn: (draft: Record<string, BindingNode | BindingEdge>) => void) {
  return fn(proxyDataMap);
}
export function clearDataMap() {
  Object.keys(proxyDataMap).forEach(key => {
    delete proxyDataMap[key];
  });
}

export function transformDataMap(dataMap: BindingEdge | BindingNode) {
  let nodes: any[] = [];
  let edges: any[] = [];
  Object.values(dataMap).forEach(item => {
    const { source, target } = item;
    if (source && target) {
      edges.push(item);
    } else {
      nodes.push(item);
    }
  });
  return {
    nodes,
    edges,
  };
}
