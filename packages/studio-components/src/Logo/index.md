```jsx
import React, { useState } from 'react';
import { Space } from 'antd';
import { Logo, LogoText, LogoImage } from '@graphscope/studio-components';

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <Logo />
      <LogoText />
      <LogoImage />
    </div>
  );
};
```
