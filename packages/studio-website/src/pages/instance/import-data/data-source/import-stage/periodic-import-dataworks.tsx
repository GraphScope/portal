import React, { useEffect, useState } from 'react';
import { Card, Button, Flex, Typography } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { useContext } from '@/layouts/useContext';
import { download } from '@/components/utils';
const { Title, Link } = Typography;
const PeriodicImportDataworks = (props: { setState?: any; configLpading?: any; type?: any; onClose?: any }) => {
  const { configLpading, type } = props;
  const [state, updateState] = useState({
    codeMirrorData: '',
    howToUse: '',
  });
  const { codeMirrorData, howToUse } = state;
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
  //下载
  const sparkDownload = () => {
    const param = `${type?.toLocaleLowerCase()}` + '_' + `${configLpading?.label?.label}` + '_config.ini';
    download(param, codeMirrorData);
  };
  return (
    <Flex vertical gap={12}>
      {/* <Card style={{ marginTop: '18px' }} styles={{ body: { padding: '16px 24px 24px' } }}> */}
      <Flex justify="space-between" style={{ padding: '14px 0px 0px' }}>
        <Title level={5} style={{ margin: '0px' }}>
          Configuration Preview
        </Title>
        <>
          {howToUse !== '#' ? (
            <Link href={howToUse} target="_blank">
              How to Use
            </Link>
          ) : (
            <Link href="#">How to Use</Link>
          )}
        </>
      </Flex>
      <CodeMirror
        style={{
          overflow: 'scroll',
          border: `1px solid ${mode === 'defaultAlgorithm' ? '#efefef' : '#323232'}`,
          color: mode === 'defaultAlgorithm' ? '#1F1F1F' : '#808080',
          borderRadius: '6px',
        }}
        value={codeMirrorData}
        height="150px"
        theme={myTheme}
        readOnly
        autoFocus
      />
      {/* </Card> */}
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" style={{ width: '108px' }} onClick={() => sparkDownload()}>
          download
        </Button>
      </div>
    </Flex>
  );
};
export default PeriodicImportDataworks;
