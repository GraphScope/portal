//@ts-nocheck
import React, { forwardRef } from 'react';
import { MonacoEnvironment, EditorProvider } from '@difizen/cofine-editor-core';

import cypherLanguage, { registerOptions } from '@difizen/cofine-language-cypher';
import './index.css';

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
  } = props;
  let codeEditor: monaco.editor.IStandaloneCodeEditor;
  // 监听事件
  let erdElement: HTMLElement | null;
  const MAGIC_NUMBER = onChangeContent ? 0 : 1;

  React.useEffect(() => {
    MonacoEnvironment.loadModule(async (container: { load: (arg0: Syringe.Module) => void }) => {
      // const dsl = await import('@difizen/cofine-language-cypher');
      container.load(cypherLanguage);
    });
    MonacoEnvironment.init().then(async () => {
      if (editorRef && editorRef.current) {
        const editorProvider = MonacoEnvironment.container.get<EditorProvider>(EditorProvider);
        const editor = editorProvider.create(editorRef.current, {
          language,
          value,
          theme: 'cypherTheme',
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
        if (onChange) {
          onChange(editor.codeEditor.getValue());
        }
        editor.codeEditor.onDidChangeModelContent(() => {
          const contentHeight = editor.codeEditor.getContentHeight();
          const lineCount = editor.codeEditor.getModel()?.getLineCount(); // 获取行数
          const lineHeight = 20; // 获取行高

          // 计算编辑器容器的高度
          const height = lineCount === 1 ? (lineCount + MAGIC_NUMBER) * lineHeight : (lineCount + 1) * lineHeight;
          console.log('editor.codeEditor', editor.codeEditor.getContentHeight(), lineCount, height);

          if (contentHeight <= maxRows * lineHeight) {
            editorRef.current.style.height = height + 'px';
          }

          if (onChangeContent) {
            onChangeContent(lineCount, editor.codeEditor);
          }
        });

        editor.codeEditor.onDidContentSizeChange(params => {
          const { contentHeight } = params;
          console.log('onDidContentSizeChange', contentHeight);
        });
        registerOptions({
          querySchema: () => Promise.resolve(schemaData),
          queryFunctions: () => Promise.resolve(functions),
        });
        editor.codeEditor.layout();

        // 监听光标位置变化事件
        // editor.codeEditor.onDidChangeCursorPosition(() => {
        //   // 获取当前光标所在的行号
        //   const currentLineNumber = editor.codeEditor.getPosition().lineNumber;
        //   console.log('currentLineNumber', currentLineNumber);

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
  }, [editorRef]);
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
