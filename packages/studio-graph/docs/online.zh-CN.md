---
order: 5
title: 综合应用
---

## 在线图分析工具

通过对于上述组件的了解，让我们来构建一个在线图分析工具：

```jsx
import React, { useRef, useState } from 'react';
import { Button, Tooltip, theme, Divider, Flex, Modal } from 'antd';
import { FullScreen } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  Prepare,
  ZoomFit,
  ClearStatatus,
  RunCluster,
  ContextMenu,
  NeighborQuery,
  DeleteNode,
  CommonNeighbor,
  Brush,
  Loading,
  DeleteLeafNodes,
  Export,
  BasicInteraction,
  FixedMode,
  GraphProvider,
  LoadCSV,
} from '@graphscope/studio-graph';
import { ApiOutlined } from '@ant-design/icons';

const UploadCSV = () => {
  const [visible, setVisible] = useState(false);
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Button
        type="text"
        onClick={() => {
          setVisible(true);
        }}
        icon={<ApiOutlined />}
      ></Button>
      <Modal open={visible} width={'80%'} onClose={handleClose} onCancel={handleClose} footer={false}>
        <div style={{ height: '70vh' }}>
          <LoadCSV onCallback={handleClose} />
        </div>
      </Modal>
    </>
  );
};

const QueryGraph = props => {
  const { data, schema, graphId, onQuery, id } = props;
  const containerRef = useRef(null);

  return (
    <div
      style={{
        borderRadius: '8px',
        height: '500px',
        position: 'relative',
      }}
      ref={containerRef}
    >
      <GraphProvider id={id}>
        <Prepare data={data} schema={schema} graphId={graphId} />
        <Canvas />
        <BasicInteraction />
        <ClearStatatus />
        <PropertiesPanel />
        <Loading />
        <ContextMenu>
          <DeleteLeafNodes />
          <DeleteNode />
        </ContextMenu>
        <Toolbar style={{ position: 'absolute', top: '20px', left: '20px', right: 'unset' }}>
          <UploadCSV />
          <FullScreen containerRef={containerRef} />
          <ZoomFit />
          <Brush />
          <FixedMode />
          <Divider style={{ margin: '0px' }} />
          <SwitchEngine />
          <RunCluster />
          <Export />
        </Toolbar>
      </GraphProvider>
    </div>
  );
};

export default QueryGraph;
```
