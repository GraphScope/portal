```jsx
import React, { useState, useRef } from 'react';
import { ImportFiles, Button, message } from '@graphscope/studio-components';

export default () => {
  const onSubmit = params => {
    message(params);
  };
  return (
    <div style={{ height: '500px' }}>
      <ImportFiles
        upload={{
          accept: '.json,.csv',
          title: 'xxx',
          description: 'xxx',
        }}
        type="json"
      >
        {params => {
          return (
            <>
              <Button type="primary" onClick={() => onSubmit(params)} loading={params.loading}>
                Visualization
              </Button>
            </>
          );
        }}
      </ImportFiles>
    </div>
  );
};
```
