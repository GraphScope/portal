//@ts-nocheck
import React, { forwardRef } from 'react';
import { MonacoEnvironment, EditorProvider } from '@difizen/cofine-editor-core';
import cypherLanguage from '@difizen/cofine-language-cypher';
export interface CypherEditorProps {
  maxRows?: number;
  minRows?: number;
}
const Editor = forwardRef<any, any>((props, editorRef) => {
  const { value, onCreated, onChange, language = 'cypher', onInit, maxRows = 20, minRows = 1 } = props;
  let codeEditor: monaco.editor.IStandaloneCodeEditor;
  // 监听事件
  let erdElement: HTMLElement | null;

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
          suggestLineHeight: 24,
          suggestLineHeight: 24,
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
          editor.codeEditor.onDidChangeModelContent(() => {
            const contentHeight = editor.codeEditor.getContentHeight();
            const lineCount = editor.codeEditor.getModel()?.getLineCount(); // 获取行数
            const lineHeight = 20; // 获取行高

            // 计算编辑器容器的高度
            const height = lineCount * lineHeight;
            console.log('editor.codeEditor', editor.codeEditor.getContentHeight(), lineCount, height);

            if (contentHeight <= maxRows * lineHeight) {
              editorRef.current.style.height = height + lineHeight + 'px';
            }
            return onChange(editor.codeEditor.getValue());
          });
        }

        editor.codeEditor.onDidContentSizeChange(params => {
          const { contentHeight } = params;
          console.log('onDidContentSizeChange', contentHeight);
        });

        // registerOptions({});
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
        paddingTop: '8px',
        width: '100%',
        height: (minRows + 1) * 20 + 'px',
      }}
    />
  );
});
export default Editor;
