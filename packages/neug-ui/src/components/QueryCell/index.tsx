import React, { useState } from 'react';
import { QueryCellHeader } from './QueryCellHeader';
import { QueryCellEditor } from './QueryCellEditor';
import type { QueryCellProps } from './types';
import clsx from 'clsx';

/**
 * QueryCell 组件，包含 Header 和 Cypher 代码编辑器
 */
export const QueryCell: React.FC<QueryCellProps> = ({
  databaseList,
  currentDatabase,
  value,
  onChange,
  onRun,
  onDelete,
  ...rest
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={clsx(
        'rounded-lg bg-white dark:bg-neutral-900 shadow-sm transition-all',
        'border',
        focused ? 'border-primary-500' : 'border-neutral-200 dark:border-neutral-700',
        hovered && 'shadow-md',
        'relative group',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {/* 左侧拖拽和折叠 ICON，仅 hover 时显示 */}
      {hovered && (
        <div className="absolute left-2 top-4 flex flex-col gap-2">
          <span className="cursor-move" title="拖拽">
            ≡
          </span>
          <span className="cursor-pointer" title="折叠">
            ▾
          </span>
        </div>
      )}
      {/* Header 区域 */}
      <QueryCellHeader
        databaseList={databaseList}
        currentDatabase={currentDatabase}
        onRun={onRun}
        onDelete={onDelete}
        showActions={hovered}
      />
      {/* 代码编辑器区域 */}
      <QueryCellEditor
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

export default QueryCell;
