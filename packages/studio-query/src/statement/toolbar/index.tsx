import * as React from 'react';
import { Space, Button } from 'antd';
interface ToolbarProps {}

const Toolbar: React.FunctionComponent<ToolbarProps> = props => {
  return (
    <div>
      <Space>
        <Button>Cypher</Button>
        <Button>执行</Button>
        <Button>保存</Button>
        <Button>下载</Button>
      </Space>
    </div>
  );
};

export default Toolbar;
