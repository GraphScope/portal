import { Utils } from '@graphscope/studio-components';
import { useContext as useZustandContext } from '@graphscope/use-zustand';

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
export const initialStore = {
  /** 语言 */
  locale: Utils.storage.get('locale'),
  /** 收起导航 */
  collapse: false,
  /** 当前导航 */
  currentnNav: Utils.getCurrentNav(),
  navStyle: (Utils.storage.get('GS_STUDIO_navStyle') as string) || 'inline',
  graphs: [],
  graphId: Utils.getSearchParams('graph_id'),
  draftGraph: Utils.storage.get('DRAFT_GRAPH') || {},
  draftId: 'DRAFT_GRAPH',
  displaySidebarType: Utils.storage.get<'Sidebar' | 'Segmented'>('displaySidebarType') || 'Segmented',
  displaySidebarPosition: Utils.storage.get<'left' | 'right'>('displaySidebarPosition') || 'left',
  isReady: false,
};

export const useContext = (id?: string) => useZustandContext<IStore>(id);
