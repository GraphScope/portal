import * as React from 'react';
import CypherEdit from '../../cypher-editor';
import { Space, Button, Input, Flex } from 'antd';
import { PlayCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useRef } from 'react';

interface IEditorProps {}
import CypherDriver from '../../cypher-editor/driver';
export const driver = new CypherDriver('neo4j://localhost:7687');
console.log('driver', driver);

const Editor: React.FunctionComponent<IEditorProps> = props => {
  const editorRef = useRef<any>(null);
  const script = `Match (n) return n limit 10`;
  const handleChange = async value => {
    console.log('value', value);
  };
  const handleClick = async () => {
    const value = editorRef?.current?.codeEditor?.getValue();
    const res = await driver.queryCypher(value);
    console.log('res', value, res);
  };
  return (
    <div>
      <Flex justify="space-between" align="center">
        <Button>Cypher</Button>
        <Space align="end">
          {/* <TextArea autoSize={{ minRows: 1, maxRows: 20 }}></TextArea> */}
          <Button type="text" icon={<PlayCircleOutlined />} onClick={handleClick} />
          <Button type="text" icon={<BookOutlined />} />
        </Space>
      </Flex>
      <div style={{ height: '100px', width: 'calc(100vw - 328px)' }}>
        <CypherEdit ref={editorRef} value={script} onChange={handleChange} onInit={(initEditor: any) => {}} />
      </div>
    </div>
  );
};

export default Editor;
