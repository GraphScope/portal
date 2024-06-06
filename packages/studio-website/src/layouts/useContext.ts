import { proxy, useSnapshot } from 'valtio';
import type { INTERNAL_Snapshot as Snapshot } from 'valtio';
import localStorage from '@/components/utils/localStorage';
const { getItem } = localStorage;
const themeColor = getItem('themeColor');
const primaryColor = getItem('primaryColor');
const corner = getItem('corner');
const locale = getItem('locale');
import { Utils } from '@graphscope/studio-components';
console.log(themeColor);

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
  locale: locale || 'en-US',
  /** 主题色 */
  primaryColor: primaryColor || '#1677ff',
  /** 收起导航 */
  collapse: false,
  /** 当前导航 */
  currentnNav: '/' + location.pathname.split('/')[1],
  /** 主题模式 */
  mode: themeColor || 'defaultAlgorithm',
  inputNumber: corner || 6,
  navStyle: 'inline',
  graphs: [],
  graphId: Utils.searchParamOf('graph_id'),
  draftGraph: Utils.storage.get('DRAFT_GRAPH') || {},
};

export type IStore = {
  locale: string;
  primaryColor: string;
  collapse: boolean;
  currentnNav: string;
  mode: string;
  inputNumber: number;
  navStyle: string;
  graphs: IGraph[];
  graphId: string | null;
  draftGraph: IGraph | {};
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
