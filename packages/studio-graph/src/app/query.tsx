import React, { useRef } from 'react';
import { Button, Tooltip, theme } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Section, useSection, FullScreen } from '@graphscope/studio-components';
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
  FixedMode,
} from '../components';

import { Divider } from 'antd';

import { CypherServices, GraphProvider } from '../index';
import { BgColorsOutlined } from '@ant-design/icons';
import { registerIcons } from '../graph/custom-icons';

interface QueryGraphProps {
  // instance id
  id?: string;
  data: any;
  schema: any;
  graphId: string;
  onQuery: (params: any) => Promise<any>;
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
  const { data, schema, graphId, onQuery, id } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const language = 'cypher';
  let services: any = [];
  if (language === 'cypher') {
    services = CypherServices['services'];
  }
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
          <BasicInteraction />
          <ClearStatatus />
          <PropertiesPanel />

          <Loading />
          <ContextMenu>
            <NeighborQuery />
            <CommonNeighbor onQuery={onQuery} />
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
