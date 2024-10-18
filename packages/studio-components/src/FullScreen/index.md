```jsx
import React, { useState, useRef } from 'react';
import { FullScreen } from '@graphscope/studio-components';
export default () => {
  const containerRef = useRef(null);
  return (
    <div>
      <FullScreen containerRef={containerRef} />
      <div
        ref={containerRef}
        style={{ width: '100%', height: '500px', background: '#ddd', textAlign: 'center', lineHeight: '100%' }}
      >
        Trigger full screen
      </div>
    </div>
  );
};
```
