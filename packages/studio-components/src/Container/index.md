---
title: Container
---

```jsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { Container, Icons, useContainer } from '@graphscope/studio-components';
const Side = () => {
  return <div>Side</div>;
};
const Content = () => {
  return <div>Content</div>;
};
const Footer = () => {
  return <div>Footer</div>;
};
const ToogleButton = () => {
  const { toggleSidebar } = useContainer();
  return (
    <div>
      <Button icon={<Icons.Sidebar />} onClick={toggleSidebar} />
    </div>
  );
};
export default () => {
  return (
    <div style={{ height: '600px', width: '600px', background: 'red', transform: 'scale(1)' }}>
      <Container
        side={<Side />}
        footer={<Footer />}
        autoResize={false}
        //   sideStyle={{ position: 'fixed' }}
      >
        <ToogleButton />
        <Content />
      </Container>
    </div>
  );
};
```
