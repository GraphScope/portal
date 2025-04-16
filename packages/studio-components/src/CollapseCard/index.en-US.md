---
title: CollapseCard
group:
  title: Data Display
  order: 1
---

# CollapseCard

A collapsible card component that supports custom title, content and styles.

## When To Use

- When you need to display collapsible content areas
- When you need to save page space while maintaining content accessibility
- When you need to group related content

## Examples

### Basic Usage

```tsx
import React from 'react';
import { CollapseCard } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <CollapseCard title="Basic Usage">
      <div>This is the card content</div>
    </CollapseCard>
  );
};

export default Demo;
```

### With Tooltip

```tsx
import React from 'react';
import { CollapseCard } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <CollapseCard title="With Tooltip" tooltip="This is a tooltip">
      <div>This is the card content</div>
    </CollapseCard>
  );
};

export default Demo;
```

### With Border

```tsx
import React from 'react';
import { CollapseCard } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <CollapseCard title="With Border" bordered>
      <div>This is the card content</div>
    </CollapseCard>
  );
};

export default Demo;
```

## API

### CollapseCard

| Property        | Description                           | Type                          | Default |
| --------------- | ------------------------------------- | ----------------------------- | ------- |
| bordered        | Whether to show border                | `boolean`                     | `false` |
| ghost           | Whether to use transparent background | `boolean`                     | `true`  |
| title           | Card title                            | `React.ReactNode`             | -       |
| children        | Card content                          | `React.ReactNode`             | -       |
| defaultCollapse | Whether to collapse by default        | `boolean`                     | `false` |
| tooltip         | Tooltip content                       | `React.ReactNode`             | -       |
| style           | Custom style                          | `React.CSSProperties`         | -       |
| className       | Custom class name                     | `string`                      | -       |
| onChange        | Callback when expand/collapse         | `(isActive: boolean) => void` | -       |

</rewritten_file>
