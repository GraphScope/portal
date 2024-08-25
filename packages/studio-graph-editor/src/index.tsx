import * as React from 'react';
import { MultipleInstance, Utils } from '@graphscope/studio-components';
import Canvas from './canvas';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { IntlProvider } from 'react-intl';
import locales from './locales';
import { ISchemaNode } from './types/node';
import { ISchemaEdge } from './types/edge';
import { useContext } from './canvas/useContext';
interface IGraphProps {
  locale?: 'zh-CN' | 'en-US';
  children?: React.ReactNode;

  // base API
  onNodeClick?: (value: ISchemaNode, event: React.MouseEvent) => void;
  onEdgeClick?: (value: ISchemaEdge, event: React.MouseEvent) => void;
  onNodesChange?: (nodes: ISchemaNode[]) => void;
  onEdgesChange?: (edges: ISchemaEdge[]) => void;
  className?: string;
  controlElements?: React.ReactNode;
  style?: React.CSSProperties;

  // quick start API, 没用明白组件 PropertiesList 建议自己封装
  // if want to show properties, you can set this to true
  isShowPopover?: boolean;
  triggerPopover?: 'click' | 'hover';
  popoverCustomContent?: React.ReactNode;
}

export const GraphContext = React.createContext<IGraphProps>({});

export const useGraphContext = () => {
  const context = React.useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraphContext must be used within a GraphProvider');
  }
  return context;
};

const Graph: React.FunctionComponent<IGraphProps> = React.forwardRef((props, ref) => {
  const { locale = 'en-US' } = props;
  const messages = locales[locale];
  const { updateStore } = useContext();

  React.useImperativeHandle(ref, () => {
    return {
      clearCanvas() {
        updateStore(draft => {
          draft.nodes = [];
          draft.edges = [];
        });
      },
    };
  });

  return (
    <IntlProvider messages={messages} locale={locale}>
      {/* <MultipleInstance> */}
      <GraphContext.Provider value={{ ...props }}>
        <ReactFlowProvider>
          <Canvas className={props.className}>{props.children}</Canvas>
        </ReactFlowProvider>
      </GraphContext.Provider>
      {/* </MultipleInstance> */}
    </IntlProvider>
  );
});

export default Graph;
