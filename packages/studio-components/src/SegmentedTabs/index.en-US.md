---
title: SegmentedTabs
group:
  title: Navigation
  order: 1
---

# SegmentedTabs

A segmented tabs component based on Ant Design Segmented, supporting URL parameter synchronization and custom styles.

## When To Use

- When you need to display multiple related content in a limited space
- When you need to categorize content
- When you need tabs that synchronize with URL parameters

## Examples

### Basic Usage

```tsx
import React from 'react';
import { SegmentedTabs } from '@graphscope/studio-components';

const Demo = () => {
  const items = [
    {
      key: 'tab1',
      label: 'Tab One',
      children: <div>Content of Tab One</div>,
    },
    {
      key: 'tab2',
      label: 'Tab Two',
      children: <div>Content of Tab Two</div>,
    },
  ];

  return <SegmentedTabs items={items} />;
};

export default Demo;
```

### With Icons

```tsx
import React from 'react';
import { SegmentedTabs } from '@graphscope/studio-components';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const Demo = () => {
  const items = [
    {
      key: 'tab1',
      label: 'Tab One',
      icon: <HomeOutlined />,
      children: <div>Content of Tab One</div>,
    },
    {
      key: 'tab2',
      label: 'Tab Two',
      icon: <UserOutlined />,
      children: <div>Content of Tab Two</div>,
    },
  ];

  return <SegmentedTabs items={items} />;
};

export default Demo;
```

### Block Display

```tsx
import React from 'react';
import { SegmentedTabs } from '@graphscope/studio-components';

const Demo = () => {
  const items = [
    {
      key: 'tab1',
      label: 'Tab One',
      children: <div>Content of Tab One</div>,
    },
    {
      key: 'tab2',
      label: 'Tab Two',
      children: <div>Content of Tab Two</div>,
    },
  ];

  return <SegmentedTabs items={items} block />;
};

export default Demo;
```

## API

### SegmentedTabs

| Property      | Description                                       | Type                                                                                            | Default |
| ------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------- |
| items         | Tab item configuration                            | `{ key: string; children: React.ReactNode; label?: React.ReactNode; icon?: React.ReactNode }[]` | -       |
| queryKey      | URL query parameter key for saving the active tab | `string`                                                                                        | `'tab'` |
| rootStyle     | Custom style for the root container               | `React.CSSProperties`                                                                           | -       |
| tabStyle      | Custom style for the tabs                         | `React.CSSProperties`                                                                           | -       |
| tableHeight   | Height of the tabs                                | `number`                                                                                        | `40`    |
| defaultActive | Default active tab                                | `string`                                                                                        | -       |
| block         | Whether to display as block                       | `boolean`                                                                                       | -       |
| value         | Current value in controlled mode                  | `string`                                                                                        | -       |
| onChange      | Callback when tab changes                         | `(value: string) => void`                                                                       | -       |
