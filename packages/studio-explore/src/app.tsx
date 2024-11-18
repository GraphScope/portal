import React, { useRef } from 'react';
import { Section, FullScreen, useCustomToken, StudioProvier } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  //   Prepare,
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
  GraphProvider,
  locales,
  ClearCanvas,
} from '@graphscope/studio-graph';

import ToogleButton from './components/ToggleButton';
import { Connection, FetchGraph, Searchbar } from './components';

import { Divider } from 'antd';
import builtinServices from './services';

interface IServices {
  queryCypher: (params: { script: string }) => Promise<any>;
}
interface ExploreProps {
  id?: string;
  services?: any;
}

const Explore: React.FunctionComponent<ExploreProps> = props => {
  const { id, services = builtinServices } = props;

  const onQuery = async () => {};

  const { buttonBackground } = useCustomToken();

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: '0px', left: '0px', bottom: '0px', right: '0px' }}>
      <GraphProvider id={id} services={services}>
        <StudioProvier locales={locales}>
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
              rightSide: true,
            }}
          >
            {/* <Prepare data={data} schema={schema} graphId={graphId} /> */}
            <Canvas />
            <BasicInteraction />
            <ClearStatatus />
            <FetchGraph />
            <Loading />
            <Toolbar
              direction="horizontal"
              style={{ position: 'absolute', top: '20px', right: '80px', left: '80px' }}
              noSpace
            >
              <Searchbar />
            </Toolbar>

            <ContextMenu>
              <NeighborQuery />
              <CommonNeighbor onQuery={onQuery} />
              <DeleteLeafNodes />
              <DeleteNode />
            </ContextMenu>
            <Toolbar
              style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset', background: buttonBackground }}
            >
              <Connection />
              <Divider style={{ margin: '0px' }} />
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
              <ClearCanvas />
            </Toolbar>
          </Section>
        </StudioProvier>
      </GraphProvider>
    </div>
  );
};

export default Explore;
