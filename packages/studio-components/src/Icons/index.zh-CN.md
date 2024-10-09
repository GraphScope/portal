---
tag: New
---

# Icons

```jsx
import React, { useState } from 'react';
import { Space } from 'antd';
import { Icons } from '@graphscope/studio-components';

export default () => {
  return (
    <div>
      <Space>
        <Icons.AddNode />
        <Icons.PrimaryKey style={{ color: 'red' }} />
        <Icons.Sidebar />
        <Icons.FileExport />
        <Icons.FileYaml />
        <Icons.Graph2D />
        <Icons.Graph3D />
        <Icons.Lasso />
      </Space>
    </div>
  );
};
```
