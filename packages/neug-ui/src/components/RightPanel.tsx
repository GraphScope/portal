import React from 'react';
import { useStore } from '../store/useStore';

export const RightPanel: React.FC = () => {
  const { activeCell } = useStore();

  if (!activeCell || !activeCell.result) {
    return (
      <div className="h-full flex flex-col bg-background border-l border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-muted-foreground">结果统计</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">选择一个有结果的 Cell 查看统计信息</p>
        </div>
      </div>
    );
  }

  const { result } = activeCell;

  // 分析字段类型
  const columnTypes = result.columns.map((column, index) => {
    const sampleValues = result.rows.slice(0, 10).map(row => row[index]);
    const isNumeric = sampleValues.every(val => val !== null && val !== undefined && !isNaN(Number(val)));
    const isDate = sampleValues.every(val => val !== null && val !== undefined && !isNaN(Date.parse(String(val))));

    if (isDate) return 'date';
    if (isNumeric) return 'number';
    return 'string';
  });

  // 计算数值字段的统计信息
  const numericStats = result.columns
    .map((column, index) => {
      if (columnTypes[index] !== 'number') return null;

      const values = result.rows.map(row => Number(row[index])).filter(v => !isNaN(v));
      if (values.length === 0) return null;

      const min = Math.min(...values);
      const max = Math.max(...values);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;

      return { column, min, max, avg, count: values.length };
    })
    .filter(Boolean);

  return (
    <div className="h-full flex flex-col bg-background border-l border-border">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-muted-foreground">结果统计</h3>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* 基本信息 */}
        <div>
          <h4 className="text-sm font-medium mb-2">基本信息</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">总行数:</span>
              <span>{result.rowCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">总列数:</span>
              <span>{result.columns.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">执行时间:</span>
              <span>{result.executionTime}ms</span>
            </div>
          </div>
        </div>

        {/* 字段类型分布 */}
        <div>
          <h4 className="text-sm font-medium mb-2">字段类型</h4>
          <div className="space-y-2">
            {result.columns.map((column, index) => (
              <div key={column} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{column}:</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    columnTypes[index] === 'number'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : columnTypes[index] === 'date'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {columnTypes[index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 数值字段统计 */}
        {numericStats.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">数值统计</h4>
            <div className="space-y-3">
              {numericStats.map((stat: any) => (
                <div key={stat.column} className="border border-border rounded-md p-3">
                  <h5 className="text-sm font-medium mb-2">{stat.column}</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">最小值:</span>
                      <span>{stat.min.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">最大值:</span>
                      <span>{stat.max.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">平均值:</span>
                      <span>{stat.avg.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">有效值:</span>
                      <span>{stat.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 字符串字段统计 */}
        <div>
          <h4 className="text-sm font-medium mb-2">字符串字段</h4>
          <div className="space-y-2">
            {result.columns.map((column, index) => {
              if (columnTypes[index] !== 'string') return null;

              const values = result.rows.map(row => String(row[index]));
              const uniqueValues = new Set(values);
              const nullCount = values.filter(v => v === 'null' || v === '').length;

              return (
                <div key={column} className="border border-border rounded-md p-3">
                  <h5 className="text-sm font-medium mb-2">{column}</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">唯一值:</span>
                      <span>{uniqueValues.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">空值:</span>
                      <span>{nullCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
