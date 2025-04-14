import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { listProcedures, deleteProcedure } from '../service';

export interface PluginItem {
  id: string;
  name: string;
  type: string;
  bound_graph: string;
}

interface UsePluginsState {
  pluginList: PluginItem[];
  isReady: boolean;
}

/**
 * 自定义 Hook：管理插件列表逻辑
 */
export const usePlugins = () => {
  const [state, setState] = useState<UsePluginsState>({
    pluginList: [],
    isReady: false,
  });

  const { pluginList, isReady } = state;

  /**
   * 获取插件列表
   */
  const getPlugins = useCallback(async () => {
    try {
      const res = await listProcedures();
      setState({
        pluginList: res || [],
        isReady: true,
      });
    } catch (error) {
      message.error('Failed to fetch plugins');
      setState(prevState => ({ ...prevState, isReady: true }));
    }
  }, []);

  /**
   * 删除插件
   */
  const deleteExtension = useCallback(
    async (plugin: { id: string; bound_graph: string }) => {
      try {
        const { bound_graph: graph_id, id } = plugin;
        const res = await deleteProcedure(graph_id, id);
        message.success(res || 'The plugin was deleted');
        await getPlugins();
      } catch (error) {
        message.error('Failed to delete plugin');
      }
    },
    [getPlugins],
  );

  useEffect(() => {
    getPlugins();
  }, [getPlugins]);

  return { pluginList, isReady, deleteExtension };
};
