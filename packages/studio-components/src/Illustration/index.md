---
tag: New
---

# Illustration

- open source : https://undraw.co/illustrations

```jsx
import React, { useState } from 'react';
import { Space, Flex, Typography } from 'antd';
import { Illustration } from '@graphscope/studio-components';

export default () => {
  return (
    <Flex wrap gap={44}>
      {Object.keys(Illustration).map(key => {
        const Item = Illustration[key];
        return (
          <Flex key={key} gap={8} vertical align="center">
            <Item />
            <Typography.Text>{key}</Typography.Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
```
