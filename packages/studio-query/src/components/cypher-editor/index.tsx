import React, { forwardRef, useEffect } from 'react';
import { useStudioProvier, useDynamicStyle } from '@graphscope/studio-components';
import { editor, languages } from 'monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/cypher/cypher.contribution';
import { registerGremlinLanguage } from '../basic-languages-gremlin/index';

// 注册 Gremlin 语言
registerGremlinLanguage();

function countLines(str) {
  // 使用正则表达式匹配换行符，并计算匹配到的数量，即为行数
  return (str.match(/\r?\n/g) || []).length + 1;
}
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
  onChangeContent?: (lineCount?: number, editor?: any) => void;
}

const LANGUAGE = {
  cypher: 'cypher',
  gremlin: 'Gremlin',
};
const THEMES = {
  cypher: 'cypherTheme',
  gremlin: 'GremlinTheme',
};
interface IEditor extends CypherEditorProps {
  value: string;
  language?: string;
  clear?: boolean;
  onInit?: (val: HTMLDivElement) => void;
  onCreated?: (editor: editor.IStandaloneCodeEditor) => void;
  onChange?: (val: string) => void;
}
const cypherEditorStyle = `
.monaco-editor .view-overlays .current-line {
  background-color: transparent !important;
}

.monaco-editor .monaco-scrollable-element::-webkit-scrollbar {
  display: none;
}

.decorationsOverviewRuler {
  display: none !important;
}

.monaco-editor .view-overlays .current-line-exact {
  border: none !important;
}

.monaco-editor .scroll-decoration {
  box-shadow: none;
}
`;
const Editor = forwardRef((props: IEditor, editorRef: any) => {
  useDynamicStyle(cypherEditorStyle, 'cypher-editor-style');
  const { value, language = 'cypher', maxRows = 10, minRows = 1, onChangeContent, clear, onInit, onCreated } = props;
  let codeEditor: editor.IStandaloneCodeEditor;
  const MAGIC_NUMBER = onChangeContent ? 0 : countLines(value);
  const { isLight } = useStudioProvier();
  useEffect(() => {
    if (editorRef && editorRef.current) {
      if (countLines(value) <= maxRows) {
        editorRef.current.style.height = countLines(value) * 20 + 'px';
      }

      //@TODO hard code
      codeEditor = editor.create(editorRef.current, {
        language: 'gremlin', //LANGUAGE[language],
        value,
        theme: !isLight ? 'vs-dark' : THEMES[language], // 'vs' (default), 'vs-dark', 'hc-black', 'hc-light'
        suggestLineHeight: 20,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 20,
        folding: true,
        wordWrap: 'on',
        scrollBeyondLastLine: false, // 不允许在内容的下方滚动
        scrollBeyondLastColumn: 0, // 不允许在内容的右侧滚动
        // 增强编辑器的交互性
        contextmenu: true,
        mouseWheelScrollSensitivity: 1,
        mouseWheelZoom: false,
        // 允许使用 Tab 键
        tabCompletion: 'on',
        autoIndent: 'advanced',
      });
      
      // 保存编辑器实例到 DOM 元素
      editorRef.current.codeEditor = codeEditor;
      
      // 添加对编辑器内容变化的监听
      codeEditor.onDidChangeModelContent(() => {
        const contentHeight = codeEditor.getContentHeight();
        const lineCount = codeEditor.getModel()?.getLineCount(); // 获取行数
        const lineHeight = 20; // 获取行高
        if (contentHeight <= maxRows * lineHeight) {
          editorRef.current.style.height = contentHeight + 'px';
        }
        if (onChangeContent) {
          onChangeContent(lineCount, codeEditor);
        }
      });
      
      // 确保编辑器在创建后立即获得焦点
      setTimeout(() => {
        codeEditor.focus();
      }, 50);
      
      // 调用初始化回调
      if (onInit) {
        onInit(editorRef.current);
      }
      
      // 调用创建完成回调
      if (onCreated) {
        onCreated(codeEditor);
      }
    }

    return () => {
      if (codeEditor) {
        codeEditor.dispose();
      }
    };
  }, [editorRef, value, language, !isLight]);
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
        border: !isLight ? '1px solid #434343' : '1px solid rgb(187, 190, 195)',
        borderRadius: '6px',
      }}
    />
  );
});
export default Editor;
