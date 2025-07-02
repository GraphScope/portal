import React from 'react';
import { MoreVertical } from 'lucide-react';

interface QueryCellHeaderProps {
  databaseList: string[];
  currentDatabase: string;
  onRun?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const QueryCellHeader: React.FC<QueryCellHeaderProps> = ({
  databaseList,
  currentDatabase,
  onRun,
  onDelete,
  showActions,
}) => {
  return (
    <div className="flex items-center justify-between px-8 py-2 border-b border-neutral-100 dark:border-neutral-800">
      {/* 运行 ICON */}
      <button className="mr-2 p-1 rounded hover:bg-primary-100 dark:hover:bg-primary-900" title="运行" onClick={onRun}>
        ▶
      </button>
      {/* 数据库下拉选择框 */}
      <select className="ml-2 px-2 py-1 rounded border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
        {databaseList.map(db => (
          <option key={db} value={db} selected={db === currentDatabase}>
            {db}
          </option>
        ))}
      </select>
      {/* 右侧操作 ICON，仅 hover 时显示 */}
      {showActions && (
        <div className="flex items-center gap-2 ml-auto">
          <button className="p-1" title="全屏">
            ⛶
          </button>
          {/* 更多操作（Dropmenu） */}
          <div className="relative group">
            <button className="p-1" title="更多操作">
              <MoreVertical className="w-5 h-5" />
            </button>
            {/* Dropmenu 示例 */}
            <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded shadow-lg z-10 hidden group-hover:block">
              <button
                className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                onClick={onDelete}
              >
                删除 Notebook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
