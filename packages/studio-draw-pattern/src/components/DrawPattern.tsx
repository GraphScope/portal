import React, { createContext, useEffect } from 'react';
import { QuickStart } from './QuickStart';
import { Canvas } from './Canvas';
import { Section } from '@graphscope/studio-components';
import { ISchemaEdge, ISchemaNode} from '@graphscope/studio-flow-editor';
import { useGraphStore } from '../stores/useGraphStore';
import { useEdgeStore } from '../stores/useEdgeStore';
import { useNodeStore } from '../stores/useNodeStore';

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
  const clearGraphStore = useGraphStore(state => state.clearGraphStore);
  const clearEdge = useEdgeStore(state => state.clearEdge);
  const clearNode = useNodeStore(state => state.clearNode);

  useEffect(() => {
    return () => {
      clearGraphStore();
      clearEdge?.();
      clearNode?.();
    };
  }, [clearGraphStore, clearEdge, clearNode]);

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
      >
        <div id="canvas-wrapper" style={{ height: '100%', width: '100%', backgroundColor: '#E6F4FF' }}>
          <Canvas />
        </div>
      </Section>
    </DrawPatternContext.Provider>
  );
};
