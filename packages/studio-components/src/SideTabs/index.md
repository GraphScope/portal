# SideTabs

```jsx
import React, { useState } from 'react';
import { Space } from 'antd';
import { SegmentedTabs } from '@graphscope/studio-components';
const Tab1 = () => {
  return <div>Tab-1 components</div>;
};
const Tab2 = () => {
  return <div>Tab-2 components</div>;
};
const Tab3 = () => {
  return <div>Tab-3 components</div>;
};
export default () => {
  const items = [
    {
      key: 'Tab-1',
      children: <Tab1 />,
      label: 'Tab-1',
    },
    {
      key: 'Tab-2',
      children: <Tab2 />,
      label: 'Tab-2',
    },
    {
      key: 'Tab-3',
      children: <Tab3 />,
      label: 'Tab-3',
    },
  ];
  return (
    <div>
      <Sidebar options={items} value="Tab-1" collapse={false} />
    </div>
  );
};
```
