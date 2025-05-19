import React, { useRef, useState } from 'react';
import { Tooltip, Button, Popover, Typography, Flex, Input, Popconfirm } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

interface ISaveStatementProps {
  onSave: (name: string) => void;
}

// 定义一个新的类型来表示Input的引用
interface InputWithRef {
  input: HTMLInputElement;
}

const SaveStatement: React.FunctionComponent<ISaveStatementProps> = props => {
  const { onSave } = props;
  const inputRef = useRef<any>(null);
  const [isPopconfirmOpen, setIsPopconfirmOpen] = useState(false);
  const intl = useIntl();
  
  // 添加一个自动聚焦的逻辑
  const autoFocusInput = () => {
    // 使用一个短延迟确保DOM已更新
    setTimeout(() => {
      if (inputRef.current && inputRef.current.input) {
        try {
          // 聚焦输入框
          inputRef.current.input.focus();
          // 选择所有文本
          inputRef.current.input.select();
        } catch (e) {
          console.error('Focus error:', e);
        }
      }
    }, 100);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsPopconfirmOpen(open);
    if (open) {
      autoFocusInput();
    }
  };
  
  const confirm = () => {
    if (inputRef.current) {
      const value = inputRef.current.input?.value;
      if (value && value.trim() !== '') {
        onSave && onSave(value);
      }
      setIsPopconfirmOpen(false);
    }
  };
  
  const cancel = () => {
    setIsPopconfirmOpen(false);
  };

  return (
    <Tooltip
      title={intl.formatMessage({
        id: 'Save',
      })}
    >
      <Popconfirm
        title="name your statement"
        description={
          <Input 
            width={'200px'} 
            ref={inputRef} 
            autoFocus={true}
            onFocus={(e) => {
              // 确保获取焦点后选择所有文本
              e.target.select();
            }}
            onKeyDown={(e) => {
              // 捕获Enter键事件并防止冒泡
              if (e.key === 'Enter') {
                e.stopPropagation();
                e.preventDefault();
                confirm();
              }
            }}
            onClick={(e) => {
              // 防止点击事件关闭Popconfirm
              e.stopPropagation();
            }}
          />
        }
        onConfirm={confirm}
        onCancel={cancel}
        okText="Save"
        cancelText="Cancel"
        placement="bottomRight"
        open={isPopconfirmOpen}
        onOpenChange={handleOpenChange}
      >
        <Button 
          type="text" 
          icon={<BookOutlined />} 
          onClick={() => {
            setIsPopconfirmOpen(true);
            // 确保在Popconfirm打开后input能获取焦点
            autoFocusInput();
          }}
        />
      </Popconfirm>
    </Tooltip>
  );
};

export default SaveStatement;
