---
title: EditableText
group:
  title: Data Display
  order: 1
---

# EditableText

An editable text component that supports double-click editing, enter confirmation, and blur saving.

## When To Use

- When you need to let users edit text content directly
- When you need to display editable text fields
- When you need to implement Excel-like cell editing functionality

## Examples

### Basic Usage

```tsx
import React from 'react';
import { EditableText } from '@graphscope/studio-components';

const Demo = () => {
  const handleTextChange = (text: string) => {
    console.log('Text updated:', text);
  };

  return <EditableText text="Double click to edit" onTextChange={handleTextChange} />;
};

export default Demo;
```

### Disabled State

```tsx
import React from 'react';
import { EditableText } from '@graphscope/studio-components';

const Demo = () => {
  return <EditableText text="Not editable" onTextChange={() => {}} disabled />;
};

export default Demo;
```

### Custom Style

```tsx
import React from 'react';
import { EditableText } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <EditableText
      text="Custom style"
      onTextChange={() => {}}
      style={{
        color: 'blue',
        fontSize: '16px',
      }}
      maxWidth={200}
      minWidth={100}
    />
  );
};

export default Demo;
```

## API

### EditableText

| Property     | Description          | Type                     | Default |
| ------------ | -------------------- | ------------------------ | ------- |
| text         | Initial text content | `string`                 | -       |
| onTextChange | Text change callback | `(text: string) => void` | -       |
| id           | Component identifier | `string`                 | -       |
| style        | Custom styles        | `React.CSSProperties`    | -       |
| disabled     | Whether disabled     | `boolean`                | `false` |
| maxWidth     | Maximum width (px)   | `number`                 | `100`   |
| minWidth     | Minimum width (px)   | `number`                 | `60`    |
