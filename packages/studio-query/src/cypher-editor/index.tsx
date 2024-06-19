//@ts-nocheck
import React, { forwardRef } from 'react';
import { MonacoEnvironment, EditorProvider } from '@difizen/cofine-editor-core';
import cypherLanguage, { registerOptions } from '@difizen/cofine-language-cypher';
import gremlinLanguage from '@difizen/cofine-language-gremlin';
import './index.css';
import { isDarkTheme } from '../app/utils';

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
    schemaData,
    functions,
    onChangeContent,
    clear,
  } = props;
  let codeEditor: monaco.editor.IStandaloneCodeEditor;
  // 监听事件
  let erdElement: HTMLElement | null;
  const MAGIC_NUMBER = onChangeContent ? 0 : 1;
  const isDark = isDarkTheme();
  React.useEffect(() => {
    MonacoEnvironment.loadModule(async (container: { load: (arg0: Syringe.Module) => void }) => {
      container.load(cypherLanguage);
      container.load(gremlinLanguage);
    });
    MonacoEnvironment.init().then(async () => {
      if (editorRef && editorRef.current) {
        if (countLines(value) <= maxRows) {
          editorRef.current.style.height = countLines(value) * 20 + 'px';
        }
        //@TODO hard code

        const editorProvider = MonacoEnvironment.container.get<EditorProvider>(EditorProvider);
        const editor = editorProvider.create(editorRef.current, {
          language: LANGUAGE[language],
          value,
          theme: isDark ? 'vs-dark' : THEMES[language], // 'vs' (default), 'vs-dark', 'hc-black', 'hc-light'
          suggestLineHeight: 20,
          suggestLineHeight: 20,
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 20,
          folding: true,
          wordWrap: 'on',
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          readOnly: false,
          hover: {
            delay: 800,
          },
          suggestSelection: 'first',
          wordBasedSuggestions: false,
          suggest: { snippetsPreventQuickSuggestions: false },
          autoClosingQuotes: 'always',
          fixedOverflowWidgets: true,
          'bracketPairColorization.enabled': true,
          scrollBeyondLastLine: false, // 不允许在内容的下方滚动
          scrollBeyondLastColumn: false, // 不允许在内容的右侧滚动
        });

        editorRef.current.codeEditor = codeEditor = editor.codeEditor;
        if (onInit) {
          onInit(editorRef.current.codeEditor);
        }

        if (onCreated) {
          onCreated(editor.codeEditor);
        }

        editor.codeEditor.onDidChangeModelContent(() => {
          const contentHeight = editor.codeEditor.getContentHeight();
          const lineCount = editor.codeEditor.getModel()?.getLineCount(); // 获取行数
          const lineHeight = 20; // 获取行高

          // 计算编辑器容器的高度
          const height = lineCount === 1 ? (lineCount + MAGIC_NUMBER) * lineHeight : (lineCount + 1) * lineHeight;

          if (contentHeight <= maxRows * lineHeight) {
            editorRef.current.style.height = height + 'px';
          }
          if (onChange) {
            onChange(editor.codeEditor.getValue());
          }

          if (onChangeContent) {
            onChangeContent(lineCount, editor.codeEditor);
          }
        });

        registerOptions({
          querySchema: () => Promise.resolve(schemaData),
          queryFunctions: () => Promise.resolve(functions),
        });

        // 监听光标位置变化事件
        // editor.codeEditor.onDidChangeCursorPosition(() => {
        //   // 获取当前光标所在的行号
        //   const currentLineNumber = editor.codeEditor.getPosition().lineNumber;

        //   // 判断行数是否为1
        //   if (currentLineNumber === 1) {
        //     // 在行数为1时，将编辑区域往右移动50px
        //     editor.codeEditor.getDomNode().style.marginLeft = '50px';
        //   } else {
        //     // 行数不为1时，恢复到正常位置
        //     editor.codeEditor.getDomNode().style.marginLeft = '0';
        //   }

        //   // 强制重新布局编辑器
        //   editor.codeEditor.layout();
        // });
      }
    });
    return () => {
      if (codeEditor) {
        codeEditor.dispose();
      }
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
      }}
    />
  );
});
export default Editor;
