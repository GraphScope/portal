import React, { forwardRef, useEffect } from 'react';
import './index.css';
import { editor } from 'monaco-editor';

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
const Editor = forwardRef((props: any, ref: any) => {
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
  let codeEditor: editor.IStandaloneCodeEditor;

  useEffect(() => {
    if (ref.current) {
      codeEditor = editor.create(ref.current, {
        value: value,
        language: 'cypher',
      });
      codeEditor.layout();
      ref.current.codeEditor = codeEditor;
    }
    return () => {
      codeEditor.dispose();
    };
  }, []);
  return (
    <div
      ref={ref}
      style={{
        padding: '5px 0px',
        width: '100%',
        height: minRows * 20 + 'px',
      }}
    />
  );
});
export default Editor;
