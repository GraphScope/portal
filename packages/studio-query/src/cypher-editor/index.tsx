//@ts-nocheck
import React, { forwardRef } from 'react';
import { MonacoEnvironment, EditorProvider } from '@difizen/cofine-editor-core';
import cypherLanguage from '@difizen/cofine-language-cypher';

const Editor = forwardRef<any, any>((props, editorRef) => {
  const { value, onCreated, onChange, language = 'cypher', onInit } = props;
  let codeEditor: monaco.editor.IStandaloneCodeEditor;
  // 监听事件
  let erdElement: HTMLElement | null;
  const installElementResizeDetector = () => {
    // eslint-disable-next-line react/no-find-dom-node
    const node = editorRef && editorRef.current;
    const parentNode = node && node.parentElement;
    erdElement = parentNode;
  };
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
        });
        editorRef.current.codeEditor = codeEditor = editor.codeEditor;
        if (onInit) {
          onInit(editorRef.current.codeEditor);
        }
        installElementResizeDetector();
        if (onCreated) {
          onCreated(editor.codeEditor);
        }
        if (onChange) {
          editor.codeEditor.onDidChangeModelContent(() => onChange(editor.codeEditor.getValue()));
        }
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
        width: '100%',
        height: '100%',
      }}
    />
  );
});
export default Editor;
