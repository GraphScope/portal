import * as React from 'react';
import CypherEdit from '../../cypher-editor';
import { Space, Button, Input, Flex } from 'antd';
import { PlayCircleOutlined, BookOutlined, CloseOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { IEditorProps } from '../typing';

import CypherDriver from '../../cypher-editor/driver';
export const driver = new CypherDriver('neo4j://localhost:7687');
console.log('driver', driver);

const Editor: React.FunctionComponent<IEditorProps> = props => {
  const { onClose, onQuery, script = `Match (n) return n limit 10`, onSave, id } = props;
  const editorRef = useRef<any>(null);

  const handleChange = async value => {
    console.log('value', value);
  };
  const handleQuery = async () => {
    const value = editorRef?.current?.codeEditor?.getValue();
    onQuery &&
      onQuery({
        id,
        script: value,
      });
    // const res = await driver.queryCypher(value);
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
    <div>
      <Flex justify="end" align="center">
        <Space align="end">
          {/* <TextArea autoSize={{ minRows: 1, maxRows: 20 }}></TextArea> */}
          <Button type="text" icon={<PlayCircleOutlined />} onClick={handleQuery} />
          <Button type="text" icon={<BookOutlined onClick={handleSave} />} />
          <Button type="text" icon={<CloseOutlined onClick={handleClose} />} />
        </Space>
      </Flex>
      <div style={{ height: '100px', width: 'calc(100vw - 328px)' }}>
        <CypherEdit ref={editorRef} value={script} onChange={handleChange} onInit={(initEditor: any) => {}} />
      </div>
    </div>
  );
};

export default Editor;
