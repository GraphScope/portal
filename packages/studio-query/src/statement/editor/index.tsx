import * as React from 'react';
import CypherEdit from '../../cypher-editor';
import { Space, Button, Input, Flex, Tooltip, Typography, Tag } from 'antd';
import type { GlobalToken } from 'antd';
import { PlayCircleOutlined, BookOutlined, CloseOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { IEditorProps } from '../typing';
import SaveStatement from './save';

import { v4 as uuidv4 } from 'uuid';

const Editor: React.FunctionComponent<
  IEditorProps & {
    timestamp?: number;
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
    timestamp,
    language,
  } = props;
  const editorRef = useRef<any>(null);
  const [queryTime, setQueryTime] = React.useState(timestamp);

  const handleQuery = async () => {
    const value = editorRef?.current?.codeEditor?.getValue();
    const queryTimestamp = new Date().getTime();
    setQueryTime(queryTimestamp);
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

  return (
    <div style={{}}>
      <Flex justify="space-between">
        <Space>
          <Tag>{language}</Tag>
          <Typography.Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
            {queryTime}
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
          {onSave && <SaveStatement onSave={handleSave} />}
          {onClose && <Button type="text" icon={<CloseOutlined onClick={handleClose} />} />}
        </Space>
      </Flex>

      <CypherEdit
        language={language}
        schemaData={schemaData}
        ref={editorRef}
        value={script}
        // onChange={handleChange}
        onInit={(initEditor: any) => {}}
      />
    </div>
  );
};

export default Editor;
