# EditableText

```jsx
import React, { useState } from 'react';
import { EditableText } from '@graphscope/studio-components';
export default () => {
  const [state, updateState] = useState({
    text: 'double click',
  });
  const onChange = value => {
    console.log('value', value);
    updateState(preState => {
      return {
        ...preState,
        text: value,
      };
    });
  };
  const { text } = state;
  return (
    <div>
      <EditableText text={text} onTextChange={onChange} />
    </div>
  );
};
```
