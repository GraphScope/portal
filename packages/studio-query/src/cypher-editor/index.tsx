import React, { forwardRef, useEffect } from 'react';
import { editor } from 'monaco-editor';
import 'monaco-editor/esm/vs/editor/editor.api';
require('monaco-editor/esm/vs/basic-languages/cypher/cypher');
import './index.css';
import { useThemeContainer } from '@graphscope/studio-components';

function countLines(str) {
  // 使用正则表达式匹配换行符，并计算匹配到的数量，即为行数
  return (str.match(/\r?\n/g) || []).length + 1;
}

const LANGUAGE = {
  cypher: 'cypher',
  gremlin: 'Gremlin',
};
const THEMES = {
  cypher: 'cypherTheme',
  gremlin: 'GremlinTheme',
};
interface IEditor {
  value: string;
  language?: string;
  maxRows?: number;
  minRows?: number;
  clear?: boolean;
  onInit?: (val: HTMLDivElement) => void;
  onCreated?: (val: editor.IStandaloneCodeEditor) => void;
  onChange?: (val: string) => void;
  onChangeContent?: () => void;
}
const Editor = forwardRef((props: IEditor, editorRef: any) => {
  const { value, language = 'cypher', maxRows = 10, minRows = 1, onChangeContent, clear } = props;
  let codeEditor: editor.IStandaloneCodeEditor;
  const MAGIC_NUMBER = onChangeContent ? 0 : 1;
  const { algorithm } = useThemeContainer();
  const isDark = algorithm === 'darkAlgorithm';
  useEffect(() => {
    if (editorRef && editorRef.current) {
      if (countLines(value) <= maxRows) {
        editorRef.current.style.height = countLines(value) * 20 + 'px';
      }

      //@TODO hard code
      codeEditor = editor.create(editorRef.current, {
        language: LANGUAGE[language],
        value,
        theme: isDark ? 'vs-dark' : THEMES[language], // 'vs' (default), 'vs-dark', 'hc-black', 'hc-light'
        suggestLineHeight: 20,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 20,
        folding: true,
        wordWrap: 'on',
        scrollBeyondLastLine: false, // 不允许在内容的下方滚动
        scrollBeyondLastColumn: 0, // 不允许在内容的右侧滚动
      });

      editorRef.current.codeEditor = codeEditor;
      codeEditor.onDidChangeModelContent(() => {
        const contentHeight = codeEditor.getContentHeight();
        const lineHeight = 20; // 获取行高
        if (contentHeight <= maxRows * lineHeight) {
          editorRef.current.style.height = contentHeight + 'px';
        }
        if (onChangeContent) {
          onChangeContent();
        }
      });
    }

    return () => {
      codeEditor.dispose();
    };
  }, [editorRef, value, language, isDark]);
  React.useEffect(() => {
    if (clear && editorRef && editorRef.current && editorRef.current.codeEditor) {
      editorRef.current.codeEditor.setValue('');
    }
  }, [clear]);
  return (
    <div
      ref={editorRef}
      style={{
        padding: '5px 0px',
        width: '100%',
        height: (minRows + MAGIC_NUMBER) * 20 + 'px',
        border: isDark ? '1px solid #434343' : '1px solid rgb(187, 190, 195)',
        borderRadius: '6px',
      }}
    />
  );
});
export default Editor;
