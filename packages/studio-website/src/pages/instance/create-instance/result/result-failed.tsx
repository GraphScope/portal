import React from 'react';
import { Result } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { updateTheme } from '@/pages/utils';
import { useContext } from '@/layouts/useContext';
const ResultFailed: React.FunctionComponent = () => {
  const { store } = useContext();
  const { mode } = store;

  return (
    <Result
      status="500"
      subTitle="模型创建失败，错误原因"
      extra={<CodeMirror height="150px" theme={updateTheme(mode, false)} extensions={[]} readOnly={true} />}
    />
  );
};

export default ResultFailed;
