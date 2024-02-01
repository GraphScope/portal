import * as React from 'react';
import CypherEdit from '../../cypher-editor';
import { Space, Button, Input, Flex, Tooltip, Typography, Tag } from 'antd';
import type { GlobalToken } from 'antd';
import { PlayCircleOutlined, BookOutlined, CloseOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { IEditorProps } from '../typing';

const Editor: React.FunctionComponent<
  IEditorProps & {
    isFetching: boolean;
    antdToken: GlobalToken;
    saved: boolean; // 是否是保存的语句
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
    saved,
    schemaData,
  } = props;
  const editorRef = useRef<any>(null);

  const handleChange = async value => {
    console.log('value', value);
  };
  const handleQuery = async () => {
    const value = editorRef?.current?.codeEditor?.getValue();
    const result = await onQuery({
      id,
      script: value,
    });
    console.log('result', result);
  };
  const handleSave = () => {
    const value = editorRef?.current?.codeEditor?.getValue();
    onSave &&
      onSave({
        id,
        script: value,
      });
  };
  const handleClose = () => {
    onClose && onClose(id);
  };

  return (
    <div style={{}}>
      <Flex justify="space-between">
        <Space>
          <Tag>Cypher</Tag>
          <Typography.Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
            2024/12/1 12:00:00
          </Typography.Text>
        </Space>

        <Space>
          <Button
            type="text"
            icon={
              <PlayCircleOutlined
                spin={isFetching}
                style={{
                  color: isFetching ? '#52c41a' : antdToken.colorPrimary,
                }}
              />
            }
            onClick={handleQuery}
          />
          {onSave && (
            <Tooltip title={saved ? '更新语句' : '保存语句'}>
              <Button
                type="text"
                icon={<BookOutlined style={saved ? { color: antdToken.colorPrimary } : {}}></BookOutlined>}
                onClick={handleSave}
              />
            </Tooltip>
          )}
          {onClose && <Button type="text" icon={<CloseOutlined onClick={handleClose} />} />}
        </Space>
      </Flex>

      <CypherEdit
        schemaData={schemaData}
        ref={editorRef}
        value={script}
        onChange={handleChange}
        onInit={(initEditor: any) => {}}
      />
    </div>
  );
};

export default Editor;
