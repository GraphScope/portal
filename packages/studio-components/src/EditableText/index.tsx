import React, { useState, useRef, useEffect } from 'react';
import { debounce } from '../Utils/index';
const EditableText = ({ text, onTextChange, id, style = {}, disabled }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(text);

  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      // 当进入编辑模式时聚焦到输入框
      inputRef.current.focus();
    }
  }, [isEditing]);
  useEffect(() => {
    setEditableText(text);
  }, [text]);

  const handleDoubleClick = () => {
    if (disabled) return;
    // 开启编辑模式
    setIsEditing(true);
  };

  const handleChange = e => {
    // 更新输入框中的文本
    setEditableText(e.target.value);
  };

  const handleKeyDown = e => {
    // 当用户按下回车键时结束编辑
    if (e.key === 'Enter') {
      handleSave();
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    // 当用户点击输入框外部时结束编辑
    handleSave();
  };

  const handleSave = () => {
    // 将文本保存并结束编辑模式
    onTextChange(editableText);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <input
          data-nodeid={id}
          style={{
            textAlign: 'center',
            outline: 'none',
            border: 'none',
            background: 'transparent',
            fontSize: '12px',
            ...style,
          }}
          ref={inputRef}
          type="text"
          value={editableText}
          // defaultValue={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div
          data-nodeid={id}
          onDoubleClick={handleDoubleClick}
          style={{
            minWidth: '60px',
            minHeight: '16px',
            textAlign: 'center',
            maxWidth: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '12px',
            ...style,
          }}
        >
          {editableText}
        </div>
      )}
    </div>
  );
};

export default EditableText;
