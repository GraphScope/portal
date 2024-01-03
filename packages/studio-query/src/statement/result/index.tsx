import * as React from 'react';
import { Space, Button, Segmented } from 'antd';

interface IResultProps {}

const Result: React.FunctionComponent<IResultProps> = props => {
  return (
    <div>
      <Segmented options={['graph', 'table', 'raw']}></Segmented>
      <div style={{ height: '100px', background: 'grey' }}></div>
    </div>
  );
};

export default Result;
