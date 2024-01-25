import { useState } from 'react';

export function useImmer<T>(initialStore: T): [T, (fn: (draft: T) => void) => void] {
  const [state, setState] = useState<T>(initialStore);
  const updateState = (fn: (draft: T) => void) => {
    setState(preState => {
      try {
        const temp = JSON.parse(JSON.stringify(preState)) as T;
        fn(temp);
        return temp;
      } catch (error) {
        return preState;
      }
    });
  };
  return [state, updateState];
}
