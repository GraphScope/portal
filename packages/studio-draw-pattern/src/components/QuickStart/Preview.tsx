import React from 'react';
import { Graph } from '@graphscope/studio-graph-editor';
import { defaultEdges, defaultNodes } from './data';
export const Preview = () => {
  return (
    <div
      style={{
        borderRadius: '8px',
        border: '1px solid #E3E3E3',
        height: '30%',
        padding: '0.8rem',
        backgroundColor: '#F9F9F9',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        flexBasis: '30%',
        marginTop: '1rem',
      }}
    >
      <span style={{ fontSize: '1rem' }}>Model Preview</span>
      <div style={{ flexGrow: '1', backgroundColor: 'white' }}>
        <Graph
          isControlButton={false}
          isMiniMap={false}
          disabled={true}
          isPreview={true}
          defaultEdges={defaultEdges}
          defaultNodes={defaultNodes}
          graphId="preview"
        ></Graph>
      </div>
    </div>
  );
};
