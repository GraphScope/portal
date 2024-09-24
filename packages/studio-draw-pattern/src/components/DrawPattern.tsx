import React, { createContext } from 'react';
import { QuickStart } from './QuickStart';
import { Canvas } from './Canvas';
import { Section } from '@graphscope/studio-components';
import { ISchemaNode } from '@graphscope/studio-graph-editor';
import { ISchemaEdge } from '@graphscope/studio-graph-editor';

export interface GraphProps {
  nodes: ISchemaNode[];
  edges: ISchemaEdge[];
}

export interface DrawPatternValue {
  MATCHs: string;
  WHEREs: string;
  RETURNs: string;
  description: string;
}
export interface DrawPatternProps {
  /**
   * preview graph schema
   */
  previewGraph?: GraphProps;
  /**
   * onChange, the MATCH WHERE DESC change callback
   */
  onClick?: (value: DrawPatternValue) => void;
}
const defaultDrawPatternProps: DrawPatternProps = {
  previewGraph: undefined,
  onClick: undefined,
};
export const DrawPatternContext = createContext<DrawPatternProps>(defaultDrawPatternProps);

export const DrawPattern: React.FC<DrawPatternProps> = props => {
  return (
    <DrawPatternContext.Provider value={props}>
      <Section
        defaultCollapsed={{ leftSide: true }}
        splitBorder={true}
        leftSide={
          <div
            id="quick-start-wrapper"
            style={{
              height: '100%',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <QuickStart />
          </div>
        }
        children={
          <div id="canvas-wrapper" style={{ height: '100%', width: '100%', backgroundColor: '#E6F4FF' }}>
            <Canvas />
          </div>
        }
      />
    </DrawPatternContext.Provider>
  );
};
