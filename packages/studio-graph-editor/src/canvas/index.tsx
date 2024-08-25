import React, { CSSProperties, useEffect } from 'react';
import { ReactFlow, Controls, Background, MiniMap } from 'reactflow';
import { EmptyCanvas, useThemeContainer, Utils } from '@graphscope/studio-components';
import { nodeTypes } from '../elements/node-types';
import { edgeTypes } from '../elements/edge-types';
import ConnectionLine from '../elements/connection-line';
import ArrowMarker from '../elements/arrow-marker';
import { PlayCircleOutlined } from '@ant-design/icons';
import ButtonController from '../button-controller';

import useInteractive from './useInteractive';
import { FormattedMessage } from 'react-intl';

interface ISchemaGraphProps {
  children?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}
const { fakeSnapshot } = Utils;
const SchemaGraph: React.FunctionComponent<ISchemaGraphProps> = props => {
  const { children } = props;
  const { store, onDoubleClick, onEdgesChange, onNodesChange, onConnectStart, onConnectEnd } = useInteractive();
  const { nodes, edges, theme } = store;
  const { algorithm } = useThemeContainer();
  const isEmpty = nodes.length === 0;
  const isDark = algorithm === 'darkAlgorithm';
  // const rfBG = isDark ? '#161616' : collapsed.left && collapsed.right ? '#fff' : '#f4f5f5';
  const rfBG = '#fff';
  const description = (
    <FormattedMessage
      id="Start sketching a model, a vertex label is a named grouping or categorization of nodes within the graph dataset"
      values={{
        icon: <PlayCircleOutlined />,
      }}
    />
  );
  return (
    <div style={{ height: '100%', width: '100%', ...props.style }} className={props.className}>
      <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
        <ReactFlow
          nodes={fakeSnapshot(nodes)}
          // nodes={nodes}
          // edges={edges}
          //@ts-ignore
          edges={fakeSnapshot(edges)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={ConnectionLine}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          zoomOnDoubleClick={false}
          // onDoubleClick={onDoubleClick}
        >
          <ArrowMarker selectedColor={theme.primaryColor} color={isDark ? '#d7d7d7' : '#000'} />
          <Controls
            style={{
              gap: '4px',
              boxShadow:
                '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            }}
          />
          <ButtonController />
          <Background
            style={{
              // background: '#f4f5f5',
              background: rfBG,
            }}
          />
          {isEmpty && <EmptyCanvas description={description} />}
          <MiniMap style={{ backgroundColor: isDark ? '#161616' : '' }} />
          {children && children}
        </ReactFlow>
      </div>
    </div>
  );
};

export default SchemaGraph;
