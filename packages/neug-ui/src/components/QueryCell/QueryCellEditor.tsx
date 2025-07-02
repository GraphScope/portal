import React from 'react';

interface QueryCellEditorProps {
  value: string;
  onChange: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * 代码编辑器区域（可替换为更专业的编辑器如 monaco/codemirror）
 */
export const QueryCellEditor: React.FC<QueryCellEditorProps> = ({ value, onChange, onFocus, onBlur }) => {
  return (
    <textarea
      className="w-full min-h-[80px] px-8 py-3 bg-transparent outline-none resize-none text-sm text-neutral-900 dark:text-neutral-100"
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="输入 Cypher 查询语句..."
      spellCheck={false}
    />
  );
};
