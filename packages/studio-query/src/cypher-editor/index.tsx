//@ts-nocheck
import React, { forwardRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import 'monaco-editor/esm/vs/editor/editor.api';
require('monaco-editor/esm/vs/basic-languages/javascript/javascript');
import './index.css';
import { useThemeContainer } from '@graphscope/studio-components';

export interface ItemSchema {
  label: string;
  properties: {
    name: string;
    type: 'string' | 'number';
  }[];
  primary: string;
}
export interface CypherSchemaData {
  nodes: ItemSchema[];
  edges: (ItemSchema & {
    constraints: [[string, string]];
  })[];
}
export interface CypherEditorProps {
  maxRows?: number;
  minRows?: number;
  schemaData?: CypherSchemaData;
  functions?: {
    name: string;
    type: string;
    signatures: [];
    desc: string;
  }[];
  onChangeContent?: (lineCount: number, editor: any) => void;
}

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
const Editor = forwardRef<any, any>((props, editorRef) => {
  const {
    value,
    onCreated,
    onChange,
    language = 'cypher',
    onInit,
    maxRows = 10,
    minRows = 1,
    onChangeContent,
    clear,
  } = props;
  let editor: monaco.editor.IStandaloneCodeEditor;
  // 监听事件
  let erdElement: HTMLElement | null;
  const MAGIC_NUMBER = onChangeContent ? 0 : 1;
  const { algorithm } = useThemeContainer();
  const isDark = algorithm === 'darkAlgorithm';
  useEffect(() => {
    if (editorRef && editorRef.current) {
      if (countLines(value) <= maxRows) {
        editorRef.current.style.height = countLines(value) * 20 + 'px';
      }

      //@TODO hard code
      editor = monaco.editor.create(editorRef.current, {
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
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        suggestSelection: 'first',
        wordBasedSuggestions: false,
        suggest: { snippetsPreventQuickSuggestions: false },
        autoClosingQuotes: 'always',
        fixedOverflowWidgets: true,
        'bracketPairColorization.enabled': true,
        scrollBeyondLastLine: false, // 不允许在内容的下方滚动
        scrollBeyondLastColumn: false, // 不允许在内容的右侧滚动
        // lineNumbers: 'off', // 如果你不需要行号，可以关闭它
      });

      editorRef.current.codeEditor = editor.getValue();
      if (onInit) {
        onInit(editorRef.current);
      }

      if (onCreated) {
        onCreated(editor);
      }

      editor.onDidChangeModelContent(() => {
        const contentHeight = editor.getContentHeight();
        const lineCount = editor.getModel()?.getLineCount(); // 获取行数
        const lineHeight = 20; // 获取行高
        // 计算编辑器容器的高度
        const height = lineCount === 1 ? (lineCount + MAGIC_NUMBER) * lineHeight : (lineCount + 1) * lineHeight;

        if (contentHeight <= maxRows * lineHeight) {
          editorRef.current.style.height = height + 'px';
        }

        if (onChange) {
          onChange(editor.getValue());
        }

        if (onChangeContent) {
          onChangeContent(lineCount, editor.codeEditor);
        }
      });
      // monaco-editor 不会捕捉到粘贴的代码块
      editor.onDidPaste(function (event) {
        var model = editor.getModel();
        var range = event.range;
        var text = model.getValueInRange(range);
        editorRef.current.codeEditor = text;
      });
    }

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, [editorRef, value, language, isDark]);
  useEffect(() => {
    if (clear && editorRef && editorRef.current && editorRef.current.codeEditor) {
      editorRef.current.codeEditor = '';
    }
  }, [clear]);
  return (
    <div
      ref={editorRef}
      style={{
        padding: '5px 0px',
        width: '100%',
        height: (minRows + MAGIC_NUMBER) * 20 + 'px',
      }}
    />
  );
});
export default Editor;
