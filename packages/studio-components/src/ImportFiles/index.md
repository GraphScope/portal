```jsx
import React, { useState, useRef } from 'react';
import { ImportFiles } from '@graphscope/studio-components';
import {Button, message} from 'antd';

export default () => {
  const onSubmit = params => {
    console.log('params::: ', params);

    message.success('成功了');
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
              <Button type="primary" onClick={() => onSubmit(params)} loading={params.loading|| !params.completed}>
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
