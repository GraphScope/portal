---
title: TypingText
group:
  title: Feedback
  order: 1
---

# TypingText

A typing effect text component based on typewriter-effect, supporting custom typing speed, deletion speed, and loop playback.

## When To Use

- When you need to display a typing effect
- When you need to emphasize text content
- When you need to show loading or generation process

## Examples

### Basic Usage

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  return <TypingText>This is a typing effect text</TypingText>;
};

export default Demo;
```

### Custom Speed

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  return (
    <TypingText delay={50} deleteSpeed={30}>
      This is a typing effect text with custom speed
    </TypingText>
  );
};

export default Demo;
```

### Loop Playback

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  return <TypingText loop>This is a typing effect text with loop playback</TypingText>;
};

export default Demo;
```

### Completion Callback

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  const handleComplete = () => {
    console.log('Typing effect completed');
  };

  return <TypingText onComplete={handleComplete}>This is a typing effect text with completion callback</TypingText>;
};

export default Demo;
```

### Custom Loading Text

```tsx
import React from 'react';
import { TypingText } from '@graphscope/studio-components';

const Demo = () => {
  return <TypingText loadingText="Loading...">This is a typing effect text with custom loading text</TypingText>;
};

export default Demo;
```

## API

### TypingText

| Property    | Description                               | Type         | Default           |
| ----------- | ----------------------------------------- | ------------ | ----------------- |
| children    | Text content to display                   | `string`     | -                 |
| delay       | Typing delay time (ms)                    | `number`     | `10`              |
| deleteSpeed | Deletion speed (ms)                       | `number`     | `10`              |
| loop        | Whether to loop playback                  | `boolean`    | `false`           |
| onComplete  | Callback function when typing is complete | `() => void` | -                 |
| loadingText | Loading text to display                   | `string`     | `'Generating...'` |

```

```
