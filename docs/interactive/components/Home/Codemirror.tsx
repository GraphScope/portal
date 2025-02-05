import React, { useEffect, useState } from 'react';
import { Flex, Button, Row, Col } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { codemirrorCode } from './const';
const myTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#f5f5f5',
    backgroundImage: '',
    // foreground: '#75baff',
    // caret: '#5d00ff',
    // selection: '#036dd626',
    // selectionMatch: '#036dd626',
    // lineHighlight: '#8a91991a',
    // gutterBackground: '#fff',
    // gutterForeground: '#8a919966',
  },
  styles: [],
});
export default () => {
  const [copy, setCopy] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(codemirrorCode);
    setCopy(true);
  };
  useEffect(() => {
    let timer = setTimeout(() => {
      setCopy(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [copy]);
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px',
        overflow: 'hidden',
        padding: '12px 12px 12px 0px',
      }}
    >
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <CodeMirror
            value={codemirrorCode}
            readOnly
            basicSetup={{
              lineNumbers: false, // 确保不显示行号
            }}
            theme={myTheme}
          />
          <Button
            style={{ position: 'absolute', top: 0, right: 0 }}
            type={'text'}
            icon={copy ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
          />
        </Col>
      </Row>
    </div>
  );
};
