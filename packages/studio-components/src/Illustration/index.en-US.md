---
title: Illustration
group:
  title: Data Display
  order: 3
---

# Illustration

A collection of beautiful illustrations to enhance the visual effects and user experience of your interface. All illustrations are sourced from [unDraw](https://undraw.co/illustrations) and optimized for use in the component library.

## When To Use

- When you need to display friendly visual cues for empty states, loading states, etc.
- When you want to add vivid visual elements to your interface
- When you need to manage illustration resources in your project

## Examples

### Basic Usage

```tsx
import React from 'react';
import { Illustration } from '@graphscope/studio-components';

const Demo = () => {
  return <Illustration.Welcome />;
};

export default Demo;
```

### Custom Color

```tsx
import React from 'react';
import { Illustration } from '@graphscope/studio-components';

const Demo = () => {
  return <Illustration.Welcome color="#1890ff" />;
};

export default Demo;
```

### Custom Size

```tsx
import React from 'react';
import { Illustration } from '@graphscope/studio-components';

const Demo = () => {
  return <Illustration.Welcome width={300} height={200} />;
};

export default Demo;
```

### Illustration List

```tsx
import React from 'react';
import { Space, Flex, Typography } from 'antd';
import { Illustration } from '@graphscope/studio-components';

const Demo = () => {
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

export default Demo;
```

## API

### Illustration

| Name         | Description                | Usage Scenarios                        |
| ------------ | -------------------------- | -------------------------------------- |
| Welcome      | Welcome illustration       | Welcome page, homepage                 |
| Job          | Job illustration           | Task list, workspace                   |
| Explore      | Explore illustration       | Data exploration, analysis page        |
| DesignSchema | Design schema illustration | Design page, pattern display           |
| Process      | Process illustration       | Process display, step description      |
| Success      | Success illustration       | Operation success, completion status   |
| Next         | Next step illustration     | Guide process, step prompt             |
| Loading      | Loading illustration       | Loading state, waiting prompt          |
| Upload       | Upload illustration        | File upload, import function           |
| FunArrow     | Fun arrow illustration     | Interaction prompt, guide description  |
| Programming  | Programming illustration   | Code related, development function     |
| Experiment   | Experiment illustration    | Experiment function, test scenario     |
| Settings     | Settings illustration      | Settings page, configuration function  |
| Charts       | Charts illustration        | Data visualization, statistics display |

### IIllustrationProps

| Property  | Description       | Type                  | Default |
| --------- | ----------------- | --------------------- | ------- |
| style     | Custom styles     | `React.CSSProperties` | -       |
| className | Custom class name | `string`              | -       |
