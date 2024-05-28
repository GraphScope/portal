# Toolbar

```jsx
import React, { useState } from 'react';
import { Space, Button } from 'antd';
import { Toolbar, Icons } from '@graphscope/studio-components';

export default () => {
  return (
    <div style={{ position: 'relative', height: '400px' }}>
      <Toolbar>
        <Button type="text" icon={<Icons.Sidebar />} />
        <Button type="text" icon={<Icons.AddNode />} />
      </Toolbar>
    </div>
  );
};
```
