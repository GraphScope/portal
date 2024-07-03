import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import { Utils } from '@graphscope/studio-components';
export interface IGraph {
  id: string;
  name: string;
  createtime: string;
  updatetime: string;
  importtime: string;
  server: string;
  status: 'Running' | 'Stopped' | 'Draft';
  hqps: string;
  schema: {
    vertices: number;
    edges: number;
  };
  store_type: string;
  stored_procedures: string[];
}

export const initialStore = {
  /** 语言 */
  locale: Utils.storage.get('locale') || 'en-US',
  /** 收起导航 */
  collapse: false,
  /** 当前导航 */
  currentnNav: '/' + location.pathname.split('/')[1],
  navStyle: 'inline',
  graphs: [],
  graphId: Utils.searchParamOf('graph_id'),
  draftGraph: Utils.storage.get('DRAFT_GRAPH') || {},
  draftId: 'DRAFT_GRAPH',
  displaySidebarType: Utils.storage.get<'Sidebar' | 'Segmented'>('displaySidebarType') || 'Sidebar',
  displaySidebarPosition: Utils.storage.get<'left' | 'right'>('displaySidebarPosition') || 'left',
};

export type IStore = {
  locale: string | {};
  collapse: boolean;
  currentnNav: string;
  navStyle: string;
  graphs: IGraph[];
  graphId: string | null;
  draftGraph: IGraph | {};
  draftId: string;
  /** 查询侧边栏展示的位置 */
  displaySidebarPosition?: 'left' | 'right';
  /** 查询侧边栏展示的类型 */
  displaySidebarType?: 'Sidebar' | 'Segmented';
};

type ContextType = {
  store: Snapshot<IStore>;
  updateStore: (fn: (draft: IStore) => void) => void;
};

export function useContext(): ContextType {
  const proxyStore = proxy(initialStore) as IStore;
  const store = useSnapshot(proxyStore);
  return {
    store,
    updateStore: (fn: (draft: IStore) => void) => {
      return fn(proxyStore);
    },
  };
}
