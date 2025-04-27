import React, { useState, useRef, useEffect } from 'react';
import { debounce } from '../Utils/index';
import { theme } from 'antd';

/**
 * EditableText 组件的状态接口
 */
interface EditableTextState {
  isEditing: boolean;
  editableText: string;
  isHovered: boolean;
  textWidth: number;
}

/**
 * EditableText 组件的属性接口
 */
interface EditableTextProps {
  /** 初始文本内容 */
  text: string;
  /** 文本变化时的回调函数 */
  onTextChange: (text: string) => void;
  /** 组件唯一标识符 */
  id?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否禁用编辑功能 */
  disabled?: boolean;
  /** 最大宽度 */
  maxWidth?: number;
  /** 最小宽度 */
  minWidth?: number;
  /** 文本对齐方式 */
  textAlign?: 'left' | 'center' | 'right';
  /** 悬停时是否显示背景色 */
  hoverBackground?: boolean;
}

/**
 * 可编辑文本组件
 *
 * 支持双击编辑、回车确认、失焦保存等功能
 * 可以通过 style 属性自定义样式
 * 支持禁用状态
 */
const EditableText = (props: EditableTextProps) => {
  const {
    text,
    onTextChange,
    id,
    style = {},
    disabled = false,
    maxWidth = 100,
    minWidth = 60,
    textAlign = 'center',
    hoverBackground = true,
  } = props;

  // 获取 antd 主题 token
  const { token } = theme.useToken();

  // 合并状态管理
  const [state, setState] = useState<EditableTextState>({
    isEditing: false,
    editableText: text,
    isHovered: false,
    textWidth: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // 当进入编辑模式时自动聚焦
  useEffect(() => {
    if (state.isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isEditing]);

  // 同步外部文本变化
  useEffect(() => {
    setState(prev => ({ ...prev, editableText: text }));
  }, [text]);

  // 测量文本宽度
  useEffect(() => {
    if (textRef.current) {
      const width = textRef.current.offsetWidth;
      setState(prev => ({ ...prev, textWidth: width }));
    }
  }, [state.editableText]);

  // 防抖处理文本更新
  const debouncedOnTextChange = React.useMemo(() => debounce(onTextChange, 300), [onTextChange]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;
    setState(prev => ({ ...prev, isEditing: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, editableText: e.target.value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
      e.preventDefault();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const handleSave = () => {
    const { editableText } = state;
    debouncedOnTextChange(editableText);
    setState(prev => ({ ...prev, isEditing: false }));
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setState(prev => ({ ...prev, isHovered: true }));
    }
  };

  const handleMouseLeave = () => {
    setState(prev => ({ ...prev, isHovered: false }));
  };

  const commonStyles: React.CSSProperties = {
    textAlign,
    fontSize: '12px',
    transition: 'all 0.2s ease',
    ...style,
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    minWidth: `${minWidth}px`,
    maxWidth: `${maxWidth}px`,
    height: '24px', // 固定高度避免抖动
    borderRadius: '4px',
    overflow: 'hidden',
  };

  const getBackgroundStyle = () => {
    if (disabled) return { backgroundColor: token.colorBgContainerDisabled };
    if (state.isEditing) return { backgroundColor: 'rgba(0, 0, 0, 0.04)' };
    if (state.isHovered && hoverBackground) return { backgroundColor: 'rgba(0, 0, 0, 0.02)' };
    return {};
  };

  const getTextStyle = () => {
    if (disabled) {
      return {
        color: token.colorTextDisabled,
        cursor: 'not-allowed',
      };
    }
    return {
      cursor: 'pointer',
    };
  };

  return (
    <div style={containerStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {state.isEditing ? (
        <input
          data-nodeid={id}
          style={{
            ...commonStyles,
            outline: 'none',
            border: 'none',
            background: 'transparent',
            width: `${Math.max(state.textWidth, minWidth)}px`,
            height: '24px',
            padding: '0 4px',
            boxSizing: 'border-box',
            ...getBackgroundStyle(),
            ...getTextStyle(),
          }}
          ref={inputRef}
          type="text"
          value={state.editableText}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      ) : (
        <div
          data-nodeid={id}
          ref={textRef}
          onDoubleClick={handleDoubleClick}
          style={{
            ...commonStyles,
            minHeight: '24px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: '24px',
            padding: '0 4px',
            boxSizing: 'border-box',
            ...getBackgroundStyle(),
            ...getTextStyle(),
          }}
        >
          {state.editableText}
        </div>
      )}
    </div>
  );
};

export default EditableText;
