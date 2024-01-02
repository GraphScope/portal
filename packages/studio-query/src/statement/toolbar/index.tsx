import * as React from 'react';
import { Space, Button, Input } from 'antd';
import { PlayCircleOutlined, BookOutlined } from '@ant-design/icons';
const { TextArea } = Input;
interface ToolbarProps {}

const Toolbar: React.FunctionComponent<ToolbarProps> = props => {
  return (
    <div>
      <Space>
        <Button>Cypher</Button>
        {/* <TextArea autoSize={{ minRows: 1, maxRows: 20 }}></TextArea> */}
        <Button
          type="text"
          icon={<PlayCircleOutlined />}
          // loading={loadings[2]}
          // onClick={() => enterLoading(2)}
        />
        <Button
          type="text"
          icon={<BookOutlined />}
          // loading={loadings[2]}
          // onClick={() => enterLoading(2)}
        />
      </Space>
    </div>
  );
};

export default Toolbar;
