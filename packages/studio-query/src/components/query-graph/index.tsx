import React, { useRef } from 'react';
import { Button, Tooltip, theme } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Section, useSection, FullScreen, Utils } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  Prepare,
  ZoomFit,
  ClearStatus,
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
  FixedMode,
  GraphProvider,
  registerIcons,
  ZoomStatus,
} from '@graphscope/studio-graph';

import { Divider } from 'antd';

import { BgColorsOutlined } from '@ant-design/icons';
import CypherServices from './cypher-services';
import GremlinServices from './gremlin-services';

interface QueryGraphProps {
  // instance id
  id?: string;
  data: any;
  schema: any;
  graphId: string;
}

const ToogleButton = () => {
  const { toggleLeftSide } = useSection();
  return (
    <Tooltip title={<FormattedMessage id="Style settings" />} placement="left">
      <Button icon={<BgColorsOutlined />} onClick={() => toggleLeftSide()} type="text" />
    </Tooltip>
  );
};

registerIcons();

const QueryGraph: React.FunctionComponent<QueryGraphProps> = props => {
  const { data, schema, graphId, id } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const services = Utils.storage.get('query_language') === 'gremlin' ? GremlinServices : CypherServices;
  const { token } = theme.useToken();

  return (
    <div
      style={{
        borderRadius: '8px',
        height: '500px',
        background: token.colorBgContainer,
      }}
      ref={containerRef}
    >
      <GraphProvider id={id} services={services}>
        <Section
          splitBorder
          leftSide={<StyleSetting />}
          autoResize={false}
          rightSideStyle={{
            width: '300px',
            padding: '12px 0px 12px 18px',
          }}
          defaultCollapsed={{
            leftSide: true,
            rightSide: true,
          }}
        >
          <Prepare data={data} schema={schema} graphId={graphId} />
          <Canvas />
          <ZoomStatus />
          <BasicInteraction />
          <ClearStatus />
          <PropertiesPanel />
          <Loading />
          <ContextMenu>
            <NeighborQuery />
            <DeleteLeafNodes />
            <DeleteNode />
          </ContextMenu>
          <Toolbar style={{ position: 'absolute', top: '20px', left: '20px', right: 'unset' }}>
            <ToogleButton />
            <Divider style={{ margin: '0px' }} />
            <FullScreen containerRef={containerRef} />
            <ZoomFit />
            <Brush />
            <FixedMode />
            <Divider style={{ margin: '0px' }} />
            <SwitchEngine />
            <RunCluster />
            <Export />
          </Toolbar>
        </Section>
      </GraphProvider>
    </div>
  );
};

export default QueryGraph;
