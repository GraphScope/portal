import * as React from 'react';
import { Space, Button } from 'antd';

interface IResultProps {}

const Result: React.FunctionComponent<IResultProps> = props => {
  return (
    <div>
      <Space>
        <Button>Graph</Button>
        <Button>Table</Button>
        <Button>Raw</Button>
      </Space>
    </div>
  );
};

export default Result;
