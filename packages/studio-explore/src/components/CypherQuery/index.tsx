import * as React from 'react';
import { Input, Flex, Typography, Space, Button, InputRef } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useContext, type IQueryStatement } from '@graphscope/studio-graph';
interface IStatementQueryProps {}

const CypherQuery: React.FunctionComponent<IStatementQueryProps> = props => {
  const inputRef = React.useRef<InputRef>(null);
  const { store, updateStore } = useContext();
  const { getService } = store;
  const handleQuery = async () => {
    if (inputRef.current) {
      //@ts-ignore
      const { value } = inputRef.current.resizableTextArea.textArea;
      const data = await getService<IQueryStatement>('queryStatement')(value);
      updateStore(draft => {
        draft.data = data;
        draft.source = data;
      });
    }
  };
  return (
    <Flex vertical gap={12}>
      <Typography.Text italic>You can write Cypher queries here to retrieve data.</Typography.Text>
      <Input.TextArea
        rows={10}
        ref={inputRef}
        defaultValue={`Match (a:Paper)-[r:Reference]-(b:Paper) Where a.title contains "The Llama 3" return b`}
      ></Input.TextArea>
      <Space>
        <Button icon={<PlayCircleOutlined />} block onClick={handleQuery}>
          Query
        </Button>
      </Space>
    </Flex>
  );
};

export default CypherQuery;
