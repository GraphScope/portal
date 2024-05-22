import React, { useRef } from 'react';
import UploadFile from './update-file';
import { updateStore } from '../../useContext';
import CodeEditor from './code-editor';
import { Button } from 'antd';

interface IImportFromCSVProps {}
import { convertDDLToPropertyGraph } from './parse';
import { schemaToPropertyGraph } from './parse-ddl';
import { transformNodes, transformEdges, layout, transformGraphNodes } from '../../elements/index';

const ImportFromSQL: React.FunctionComponent<IImportFromCSVProps> = props => {
  const editorRef = useRef(null);

  const handleCovert = () => {
    if (editorRef.current) {
      const { editor } = editorRef.current;
      //@ts-ignore
      const value = editor.getValue();
      const data = schemaToPropertyGraph(value);
      const nodes = transformGraphNodes(data.nodes, 'graph');
      const edges = transformEdges(data.edges, 'graph');
      console.log('dd', data, { nodes, edges });
      updateStore(draft => {
        draft.nodes = nodes;
        draft.edges = edges;
        draft.displayMode = 'graph';
      });

      // const res = convertDDLToPropertyGraph(value);
      // const data = processProperties(res);
      // layout(data, 'LR');
      // const nodes = transformNodes(data.nodes, 'table');
      // const edges = transformEdges(data.edges, 'table');
      // console.log('data', data, { nodes, edges }, dd);
      // updateStore(draft => {
      //   draft.nodes = nodes;
      //   draft.edges = edges;
      //   draft.displayMode = 'table';
      // });
    }
  };
  return (
    <div
      style={{
        height: '100%',
        borderRadius: '6px',
      }}
    >
      <CodeEditor ref={editorRef} />
      <Button type="primary" onClick={handleCovert} style={{ marginLeft: '12px', width: '120px' }}>
        Convert
      </Button>
    </div>
  );
};

export default ImportFromSQL;
