import React from 'react';
import { Result } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
const ResultFailed: React.FC = () => (
  <Result  status="500" subTitle="模型创建失败，错误原因" extra={<CodeMirror height="55vh" extensions={[]} readOnly={true} />} />
);

export default ResultFailed;
