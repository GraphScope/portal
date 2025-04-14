/** 插件项的类型定义 */
export interface PluginItem {
  id: string;
  name: string;
  type: string;
  bound_graph: string;
}

/** 自定义 Hook 的状态类型 */
export interface UsePluginsState {
  pluginList: PluginItem[];
  isReady: boolean;
}
