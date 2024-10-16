import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import { Utils } from '@graphscope/studio-components';
const { GS_ENGINE_TYPE } = window;
const { storage } = Utils;

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
/** groot 状态中无需默认创建 */

export const initialStore = {
  /** 语言 */
  locale: Utils.storage.get('locale'),
  /** 收起导航 */
  collapse: false,
  /** 当前导航 */
  currentnNav: Utils.getCurrentNav(),
  navStyle: (Utils.storage.get('GS_STUDIO_navStyle') as string) || 'inline',
  graphs: [],
  graphId: Utils.searchParamOf('graph_id'),
  draftGraph: Utils.storage.get('DRAFT_GRAPH') || {},
  draftId: 'DRAFT_GRAPH',
  displaySidebarType: Utils.storage.get<'Sidebar' | 'Segmented'>('displaySidebarType') || 'Sidebar',
  displaySidebarPosition: Utils.storage.get<'left' | 'right'>('displaySidebarPosition') || 'left',
  isReady: false,
};

export type IStore = {
  locale: 'zh-CN' | 'en-US';
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
  isReady: boolean;
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
