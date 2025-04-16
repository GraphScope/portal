---
title: FullScreen
group:
  title: General
  order: 1
---

# FullScreen

A simple component to toggle fullscreen mode for a specified container.

## When To Use

- When you need to toggle fullscreen mode for a specific area
- Useful in data visualization, image viewing, and similar scenarios

## Examples

### Basic Usage

```jsx
import React, { useRef } from 'react';
import { FullScreen } from '@graphscope/studio-components';

export default () => {
  const containerRef = useRef(null);
  return (
    <div>
      <FullScreen containerRef={containerRef} />
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '500px',
          background: '#f0f0f0',
          textAlign: 'center',
          lineHeight: '500px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
        }}
      >
        Click the button in the top-left corner to enter fullscreen mode
      </div>
    </div>
  );
};
```

### Custom Styling

```jsx
import React, { useRef } from 'react';
import { FullScreen } from '@graphscope/studio-components';

export default () => {
  const containerRef = useRef(null);
  return (
    <div>
      <FullScreen containerRef={containerRef} className="custom-fullscreen-btn" style={{ color: '#1890ff' }} />
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '500px',
          background: '#e6f7ff',
          textAlign: 'center',
          lineHeight: '500px',
          border: '1px solid #91d5ff',
          borderRadius: '4px',
        }}
      >
        Fullscreen button with custom styling
      </div>
    </div>
  );
};
```

### Listen to Fullscreen State Changes

```jsx
import React, { useRef, useState } from 'react';
import { FullScreen } from '@graphscope/studio-components';
import { message } from 'antd';

export default () => {
  const containerRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenChange = fullScreen => {
    setIsFullScreen(fullScreen);
    message.info(`Current fullscreen state: ${fullScreen ? 'Fullscreen' : 'Normal'}`);
  };

  return (
    <div>
      <FullScreen containerRef={containerRef} onFullScreenChange={handleFullScreenChange} />
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '500px',
          background: isFullScreen ? '#f6ffed' : '#f0f0f0',
          textAlign: 'center',
          lineHeight: '500px',
          border: `1px solid ${isFullScreen ? '#b7eb8f' : '#d9d9d9'}`,
          borderRadius: '4px',
        }}
      >
        Fullscreen state: {isFullScreen ? 'Fullscreen' : 'Normal'}
      </div>
    </div>
  );
};
```

## API

### FullScreen

| Property           | Description                                                      | Type                                   | Default      |
| ------------------ | ---------------------------------------------------------------- | -------------------------------------- | ------------ |
| containerRef       | Reference to the container element to be displayed in fullscreen | React.RefObject<HTMLElement \| null>   | -            |
| title              | Tooltip text, supports internationalization                      | string \| React.ReactNode              | 'Fullscreen' |
| placement          | Tooltip placement                                                | 'top' \| 'right' \| 'bottom' \| 'left' | 'left'       |
| className          | Custom CSS class name for the button                             | string                                 | -            |
| style              | Custom inline styles for the button                              | React.CSSProperties                    | -            |
| onFullScreenChange | Callback when fullscreen state changes                           | (isFullScreen: boolean) => void        | -            |

```

```
