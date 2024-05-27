import React, { useRef, useEffect, forwardRef } from 'react';
import * as monaco from 'monaco-editor';
import ldbc from './ldbc';
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: Parameters<T>): void => {
    //@ts-ignore
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

const Editor: React.FC<{ ref: React.Ref<HTMLDivElement> }> = forwardRef((props, ref: any) => {
  let editor: monaco.editor.IStandaloneCodeEditor;
  useEffect(() => {
    if (ref.current) {
      editor = monaco.editor.create(ref.current, {
        value: ldbc,
        language: 'sql',
      });
      ref.current.editor = editor;
    }
    const handleSize = debounce(() => {
      editor.layout();
    }, 200);

    window.addEventListener('resize', handleSize);
    return () => {
      editor.dispose();
      window.removeEventListener('resize', handleSize);
    };
  }, []);

  return <div className="Editor" ref={ref} style={{ height: 'calc(100% - 40px)', width: '100%' }}></div>;
});
export default Editor;
