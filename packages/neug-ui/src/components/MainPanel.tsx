import React from 'react';
import { useStore } from '../store/useStore';
import { QueryCell } from './QueryCell';
import { Button } from './ui/button';
import { Plus, Play } from 'lucide-react';

export const MainPanel: React.FC = () => {
  const { activeNotebook, addCell } = useStore();

  if (!activeNotebook) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">欢迎使用 neug WebUI</h2>
          <p className="text-sm text-muted-foreground">请从左侧选择一个 Notebook 或创建新的 Notebook</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{activeNotebook.name}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => addCell(activeNotebook.id)}>
              <Plus className="h-4 w-4 mr-2" />
              添加 Cell
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              运行全部
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeNotebook.cells.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">这个 Notebook 还没有任何查询 Cell</p>
            <Button variant="outline" onClick={() => addCell(activeNotebook.id)}>
              <Plus className="h-4 w-4 mr-2" />
              创建第一个 Cell
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeNotebook.cells.map((cell, index) => (
              <QueryCell key={cell.id} cell={cell} notebookId={activeNotebook.id} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
