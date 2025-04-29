import { useGraphStore } from '../store';
import { resetIndex } from '../utils';

export const useClearCanvas = () => {
  const { updateStore, store } = useGraphStore();
  const { selectedNodeIds, selectedEdgeIds } = store;

  const handleClear = () => {
    // 如果有选中的节点或边
    if ((selectedNodeIds && selectedNodeIds.length > 0) || 
        (selectedEdgeIds && selectedEdgeIds.length > 0)) {
      
      updateStore(draft => {
        // 如果有选中的节点
        if (selectedNodeIds && selectedNodeIds.length > 0) {
          // 创建一个选中节点的集合，用于快速查找
          const selectedNodeIdSet = new Set(selectedNodeIds);
          
          // 删除选中的节点
          draft.nodes = draft.nodes.filter(node => !selectedNodeIdSet.has(node.id));
          
          // 删除与选中节点相关的边
          draft.edges = draft.edges.filter(
            edge => !selectedNodeIdSet.has(edge.source) && !selectedNodeIdSet.has(edge.target)
          );
        }
        
        // 如果有选中的边
        if (selectedEdgeIds && selectedEdgeIds.length > 0) {
          // 创建一个选中边的集合，用于快速查找
          const selectedEdgeIdSet = new Set(selectedEdgeIds);
          
          // 删除选中的边
          draft.edges = draft.edges.filter(edge => !selectedEdgeIdSet.has(edge.id));
        }
        
        // 清除选中状态
        if (draft.selectedNodeIds) draft.selectedNodeIds = [];
        if (draft.selectedEdgeIds) draft.selectedEdgeIds = [];
      });
    } else {
      // 如果没有选中任何节点或边，则清空所有
      resetIndex();
      updateStore(draft => {
        draft.nodes = [];
        draft.edges = [];
        if (draft.selectedNodeIds) draft.selectedNodeIds = [];
        if (draft.selectedEdgeIds) draft.selectedEdgeIds = [];
      });
    }
  };

  return { handleClear };
};
