import React, { useEffect, useState } from 'react';
import { Button, Row, Col, theme } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { codemirrorCode } from './const';

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    overflow: 'hidden',
    padding: '12px 12px 12px 0px',
  },
  copyButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
};

export default () => {
  const [isCopied, setIsCopied] = useState(false);
  const { token } = theme.useToken();

  const myTheme = createTheme({
    theme: 'light',
    settings: {
      background: token.colorBgLayout,
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
  const handleCopy = () => {
    navigator.clipboard.writeText(codemirrorCode);
    setIsCopied(true);
  };
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);
  return (
    <div style={styles.container}>
      <Row>
        <Col span={24}>
          <CodeMirror
            value={codemirrorCode}
            readOnly
            basicSetup={{
              lineNumbers: false, // 确保不显示行号
            }}
            theme={myTheme}
          />
          <Button
            style={styles.copyButton}
            type={'text'}
            icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
          />
        </Col>
      </Row>
    </div>
  );
};
