import * as React from 'react';
import CypherEdit from '../../cypher-editor';
import { Space, Button, Input, Flex, Tooltip, Typography, Tag, Card } from 'antd';
import type { GlobalToken } from 'antd';
import { PlayCircleOutlined, BookOutlined, CloseOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { IEditorProps } from '../typing';
import SaveStatement from './save';
import dayjs from 'dayjs';

import { v4 as uuidv4 } from 'uuid';
import { isDarkTheme } from '../../app/utils';

const Editor: React.FunctionComponent<
  IEditorProps & {
    timestamp?: number;
    isFetching: boolean;
    antdToken: GlobalToken;
    saved: boolean; // 是否是保存的语句
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
    saved,
    schemaData,
    timestamp,
    language,
    message,
  } = props;
  const editorRef = useRef<any>(null);
  const isDark = isDarkTheme();

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
      `${window.location.origin}/query-app#?language=${language}&auto_run=true&global_script=${encodeURIComponent(value)}`,
    );
  };
  return (
    <div style={{}}>
      <Flex justify="space-between" style={{ paddingBottom: '8px' }}>
        <Space>
          {/* <Tag>{language}</Tag> */}
          <Typography.Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
            {language} {message}
          </Typography.Text>
        </Space>

        <Space size={0}>
          <Tooltip title="开始查询">
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
          {onSave && <SaveStatement onSave={handleSave} />}
          <Tooltip title="Share statements">
            <Button type="text" icon={<ShareAltOutlined onClick={handleShare} />} />
          </Tooltip>
          {onClose && (
            <Tooltip title="删除语句">
              <Button type="text" icon={<CloseOutlined onClick={handleClose} />} />
            </Tooltip>
          )}
        </Space>
      </Flex>
      <Flex
        justify="space-between"
        style={{
          // border: '1px solid #bbbec3',
          border: isDark ? '1px solid #434343' : '1px solid rgb(187, 190, 195)',
          borderRadius: '6px',
        }}
      >
        <CypherEdit
          language={language}
          schemaData={schemaData}
          ref={editorRef}
          value={script}
          // onChange={handleChange}
          onInit={(initEditor: any) => {}}
        />
      </Flex>
    </div>
  );
};

export default Editor;
