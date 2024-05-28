# TableCard

```jsx
import React, { useState } from 'react';
import { Space } from 'antd';
import { TableCard } from '@graphscope/studio-components';

export default () => {
  const data = {
    label: 'table-1',
    properties: [{}],
  };
  return (
    <div>
      <TableCard data={data}></TableCard>
    </div>
  );
};
```
