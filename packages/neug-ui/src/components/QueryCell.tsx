import React, { useState } from 'react';
import { useStore, type QueryCell as QueryCellType } from '../store/useStore';
import { Button } from './ui/button';
import { Play, Trash2, Copy, Download } from 'lucide-react';

interface QueryCellProps {
  cell: QueryCellType;
  notebookId: string;
  index: number;
}

export const QueryCell: React.FC<QueryCellProps> = ({ cell, notebookId, index }) => {
  const { updateCellSql, deleteCell, setActiveCell } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleRunQuery = async () => {
    // TODO: 实现查询执行逻辑
    console.log('Running query:', cell.sql);
  };

  const handleCopyResult = () => {
    if (cell.result) {
      const csvContent = [cell.result.columns.join(','), ...cell.result.rows.map(row => row.join(','))].join('\n');
      navigator.clipboard.writeText(csvContent);
    }
  };

  const handleDownloadResult = () => {
    if (cell.result) {
      const csvContent = [cell.result.columns.join(','), ...cell.result.rows.map(row => row.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `query_result_${index + 1}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Cell Header */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Cell {index + 1}</span>
          {cell.status === 'running' && <span className="text-xs text-blue-600">运行中...</span>}
          {cell.status === 'success' && <span className="text-xs text-green-600">成功</span>}
          {cell.status === 'error' && <span className="text-xs text-red-600">错误</span>}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleRunQuery} disabled={cell.status === 'running'}>
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteCell(notebookId, cell.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* SQL Editor */}
      <div className="p-4">
        <textarea
          className="w-full h-32 p-3 border border-border rounded-md bg-background text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="输入 SQL 查询..."
          value={cell.sql}
          onChange={e => updateCellSql(notebookId, cell.id, e.target.value)}
          onFocus={() => setActiveCell(cell.id)}
        />
      </div>

      {/* Results */}
      {cell.result && (
        <div className="border-t border-border">
          <div className="flex items-center justify-between p-3 bg-muted/30">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>结果: {cell.result.rowCount} 行</span>
              <span>执行时间: {cell.result.executionTime}ms</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleCopyResult}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownloadResult}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {cell.result.columns.map((column, i) => (
                    <th key={i} className="p-2 text-left font-medium border-b border-border">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cell.result.rows.slice(0, 100).map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    {row.map((cell, j) => (
                      <td key={j} className="p-2 border-b border-border">
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {cell.result.rows.length > 100 && (
              <div className="p-2 text-center text-sm text-muted-foreground">
                显示前 100 行，共 {cell.result.rows.length} 行
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {cell.error && (
        <div className="border-t border-border p-4 bg-red-50 dark:bg-red-950/20">
          <div className="text-sm text-red-600 dark:text-red-400">
            <strong>错误:</strong> {cell.error}
          </div>
        </div>
      )}
    </div>
  );
};
