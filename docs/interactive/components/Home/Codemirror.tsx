import React, { useEffect, useState } from 'react';
import { Flex, Button, Row, Col } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
const editCode = `import graphscope as gs
from graphscope.dataset.modern_graph import load_modern_graph

gs.set_option(show_log=True)

# load the modern graph as example.
graph = load_modern_graph()

# Hereafter, you can use the graph object to create an interactive query session
g = gs.interactive(graph)
# then execute any supported gremlin query (by default)
q1 = g.execute('g.V().count()')
print(q1.all().result())   # should print [6]

q2 = g.execute('g.V().hasLabel(\'person\')')
print(q2.all().result())  # should print [[v[2], v[3], v[0], v[1]]]

# or execute any supported Cypher query, by passing lang="cypher"
q3 = g.execute("MATCH (n) RETURN count(n)", lang="cypher")
print(q3.records[0][0])  # should print 6`;
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
    navigator.clipboard.writeText(editCode);
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
        height: '100%',
        width: '100%',
      }}
    >
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <CodeMirror
            value={editCode}
            readOnly
            basicSetup={{
              lineNumbers: false, // 确保不显示行号
            }}
            theme={myTheme}
          />
          <Button
            style={{ position: 'absolute', top: 0, right: 0 }}
            type="text"
            icon={copy ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
          />
        </Col>
      </Row>
    </div>
  );
};
