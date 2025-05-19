import * as React from 'react';
import CypherEdit from '../../components/cypher-editor';
import { Space, Button, Flex, Tooltip, Typography } from 'antd';
import type { GlobalToken } from 'antd';
import { PlayCircleOutlined, CloseOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useRef, useEffect } from 'react';
import { IEditorProps } from '../typing';
import SaveStatement from './save';
import { v4 as uuidv4 } from 'uuid';
import { useIntl } from 'react-intl';

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Editor: React.FunctionComponent<
  IEditorProps & {
    timestamp?: number;
    isFetching: boolean;
    antdToken: GlobalToken;

    message: string;
  }
> = props => {
  const {
    onClose,
    onQuery,
    script = `Match (n) return n limit 10`,
    onSave,
    id,
    isFetching,
    antdToken,
    schemaData,
    timestamp,
    language,
    message,
  } = props;
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  
  // 确保编辑器容器可以接收点击并传递焦点
  useEffect(() => {
    const focusEditor = () => {
      if (editorRef?.current?.codeEditor) {
        setTimeout(() => {
          editorRef.current.codeEditor.focus();
        }, 10);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', focusEditor);
      return () => {
        container.removeEventListener('click', focusEditor);
      };
    }
  }, []);

  const handleQuery = async () => {
    const value = editorRef?.current?.codeEditor?.getValue();

    onQuery({
      id,
      script: value,
      language,
    });
  };

  const handleSave = (name: string) => {
    const value = editorRef?.current?.codeEditor?.getValue();
    const id = uuidv4();
    onSave &&
      onSave({
        id,
        script: value,
        name,
        language,
      });
  };
  const handleClose = () => {
    onClose && onClose(id);
  };
  const handleShare = () => {
    const value = editorRef?.current?.codeEditor?.getValue();
    window.open(
      `${window.location.origin}/querying?language=${language}&auto_run=true&global_script=${encodeURIComponent(value)}`,
    );
  };
  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Flex justify="space-between" style={{ paddingBottom: '8px' }}>
        <Space>
          <Tooltip title={intl.formatMessage({ id: 'Query' })}>
            <Button
              type="text"
              icon={
                <PlayCircleOutlined
                  spin={isFetching}
                  style={{
                    color: isFetching ? '#52c41a' : antdToken.green,
                  }}
                />
              }
              onClick={handleQuery}
            />
          </Tooltip>
          {/* <Tag>{language}</Tag> */}
          <Typography.Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
            {capitalizeFirstLetter(language)} {message}
          </Typography.Text>
        </Space>

        <Space size={0}>
          {onSave && <SaveStatement onSave={handleSave} />}
          {onClose && (
            <Tooltip title={intl.formatMessage({ id: 'Share' })}>
              <Button type="text" icon={<ShareAltOutlined />} onClick={handleShare} />
            </Tooltip>
          )}
          {onClose && (
            <Tooltip title={intl.formatMessage({ id: 'Delete' })}>
              <Button type="text" icon={<CloseOutlined />} onClick={handleClose} />
            </Tooltip>
          )}
        </Space>
      </Flex>
      <CypherEdit 
        language={language} 
        ref={editorRef} 
        value={script} 
        onCreated={(editor) => {
          // 确保编辑器在创建后立即聚焦
          setTimeout(() => {
            editor.focus();
          }, 100);
        }}
      />
    </div>
  );
};

export default Editor;
