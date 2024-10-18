---
tag: New
---

# Icons

```jsx
import React, { useState } from 'react';
import { Space, Flex, Typography } from 'antd';
import { Icons } from '@graphscope/studio-components';

export default () => {
  console.log(Icons, Object.keys(Icons));
  return (
    <Flex wrap gap={44}>
      {Object.keys(Icons).map(key => {
        const Icon = Icons[key];
        return (
          <Flex key={key} gap={8} vertical align="center">
            <Icon style={{ fontSize: 46 }} />
            <Typography.Text>{key}</Typography.Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
```
