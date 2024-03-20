import React from 'react';
import { Result } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { useContext } from '@/layouts/useContext';
const ResultFailed: React.FunctionComponent = () => {
  const { store } = useContext();
  const { mode } = store;
  //@ts-ignore
  const myTheme = createTheme({
    theme: mode === 'defaultAlgorithm' ? 'light' : 'dark',
    settings: {
      background: mode === 'defaultAlgorithm' ? '#fff' : '#151515',
      backgroundImage: '',
      foreground: mode === 'defaultAlgorithm' ? '#212121' : '#FFF',
      gutterBackground: mode === 'defaultAlgorithm' ? '#fff' : '#151515',
    },
  });
  return (
    <Result
      status="500"
      subTitle="模型创建失败，错误原因"
      extra={<CodeMirror height="150px" theme={myTheme} extensions={[]} readOnly={true} />}
    />
  );
};

export default ResultFailed;
