import React, { useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import {
  MultipleInstance,
  Section,
  //  SegmentedTabs,
  useSection,
  Icons,
  FullScreen,
  useCustomToken,
  useStudioProvier,
} from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  Prepare,
  ZoomFit,
  ClearStatatus,
  RunCluster,
  ContextMenu,
  NeighborQuery,
  DeleteNode,
  CommonNeighbor,
  Brush,
  Loading,
  DeleteLeafNodes,
  Export,
  BasicInteraction,
} from '../components';

import { Divider } from 'antd';
import StoreProvider from '@graphscope/use-zustand';
import { initialStore } from '../hooks/useContext';

interface QueryGraphProps {
  // instance id
  id?: string;
  data: any;
  schema: any;
  graphId: string;
  onQuery: (params: any) => Promise<any>;
}

const ToogleButton = ({ color }) => {
  const { toggleRightSide } = useSection();
  return (
    <Tooltip title={<FormattedMessage id="Toggle Right Side" />} placement="left">
      <Button icon={<Icons.Sidebar revert style={{ color }} />} onClick={() => toggleRightSide()} type="text" />
    </Tooltip>
  );
};

const QueryGraph: React.FunctionComponent<QueryGraphProps> = props => {
  const { data, schema, graphId, onQuery, id } = props;

  const { buttonBackground } = useCustomToken();
  const { isLight } = useStudioProvier();
  const color = !isLight ? '#ddd' : '#000';
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      style={{
        // background: '#fff',
        borderRadius: '8px',
        height: '500px',
      }}
      ref={containerRef}
    >
      <StoreProvider id={id} store={initialStore}>
        <Section
          splitBorder
          rightSide={
            <PropertiesPanel>
              <StyleSetting />
            </PropertiesPanel>
          }
          autoResize={false}
          rightSideStyle={{
            width: '300px',
            padding: '12px 0px 12px 18px',
          }}
          defaultCollapsed={{
            leftSide: true,
            rightSide: false,
          }}
        >
          <Prepare data={data} schema={schema} graphId={graphId} />
          <Canvas />
          <BasicInteraction />
          <ClearStatatus />

          <Loading />
          <ContextMenu>
            <NeighborQuery onQuery={onQuery} />
            <CommonNeighbor onQuery={onQuery} />
            <DeleteLeafNodes />
            <DeleteNode />
          </ContextMenu>
          <Toolbar
            style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset', background: buttonBackground }}
          >
            <ToogleButton color={color} />
            <Divider style={{ margin: '0px' }} />
            <FullScreen containerRef={containerRef} />
            <ZoomFit />
            <Brush />
            <Divider style={{ margin: '0px' }} />
            <SwitchEngine />
            <RunCluster />
            <Export />
          </Toolbar>
        </Section>
      </StoreProvider>
    </div>
  );
};

export default QueryGraph;
