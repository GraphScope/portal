# RawTable

```jsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RawTable from './';
import { interanctiveData } from './const.ts';
export default () => {
  const dataSource = interanctiveData.map(item => {
    const { keys, _fields } = item;
    return keys.reduce((acc, key, index) => {
      const field = _fields[index];
      acc[key] = {
        key: uuidv4(),
        elementId: field.elementId,
        data: field,
        labels: field.labels ? field.labels[0] : undefined,
        type: field.type,
        startNodeElementId: field.startNodeElementId,
        endNodeElementId: field.endNodeElementId,
      };
      acc['id'] = uuidv4();
      return acc;
    }, {});
  });
  return <RawTable dataSource={dataSource} columnsName={interanctiveData[0].keys} />;
};
```
