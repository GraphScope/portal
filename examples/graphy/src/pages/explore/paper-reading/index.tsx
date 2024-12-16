import React, { useRef } from 'react';

import { Button } from 'antd';

import { Section, useSection, Icons, FullScreen, StudioProvier } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  Canvas,
  ZoomFit,
  ClearStatus,
  RunCluster,
  BasicInteraction,
  ContextMenu,
  Loading,
  NeighborQuery,
  CommonNeighbor,
  DeleteLeafNodes,
  DeleteNode,
  ClearCanvas,
  StyleSetting,
  Brush,
  GraphProvider,
} from '@graphscope/studio-graph';

import { FetchGraph, Searchbar, PaperList, PaperInfo, Statistics } from './components';
import { IntlProvider } from 'react-intl';
import locales from './locales';
import { SERVICES } from './components/registerServices';
export interface IQueryServices {}

export interface QueryGraphProps {}

const ToogleLeftButton = () => {
  const { toggleLeftSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar />} onClick={() => toggleLeftSide()} type="text" />
    </div>
  );
};
const ToogleRightButton = () => {
  const { toggleRightSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar revert />} onClick={() => toggleRightSide()} type="text" />
    </div>
  );
};

const PaperReading: React.FunctionComponent<QueryGraphProps> = props => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const locale = 'en-US';
  const messages = locales[locale];
  console.log('PaperReading props', props);
  return (
    <IntlProvider messages={messages} locale={locale}>
      <GraphProvider>
        <div
          style={{
            background: '#fff',
            borderRadius: '8px',
            position: 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
          }}
          ref={containerRef}
        >
          <Section
            splitBorder
            leftSide={<PaperList />}
            rightSide={
              <PaperInfo>
                <Statistics>
                  <StyleSetting />
                </Statistics>
              </PaperInfo>
            }
            autoResize={false}
            rightSideStyle={{
              width: '400px',
              boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
              overflowY: 'scroll',
            }}
            leftSideStyle={{
              width: '380px',
              padding: '0px',
              boxShadow: 'rgba(0, 0, 0, 0.19) 0px 4px 12px',
              overflow: 'scroll',
            }}
            defaultCollapsed={{
              leftSide: false,
              rightSide: false,
            }}
          >
            <Toolbar
              direction="horizontal"
              style={{ position: 'absolute', top: '20px', right: '80px', left: '80px' }}
              noSpace
            >
              <Searchbar />
            </Toolbar>
            <Toolbar direction="horizontal" style={{ position: 'absolute', top: '20px', right: 'unset', left: '20px' }}>
              <ToogleLeftButton />
            </Toolbar>
            <Toolbar direction="horizontal" style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
              <ToogleRightButton />
            </Toolbar>

            <Canvas />
            <BasicInteraction />
            <FetchGraph />

            <ClearStatus />
            <Loading />
            <ContextMenu>
              <NeighborQuery />
              <CommonNeighbor onQuery={SERVICES.queryCypher} />
              <DeleteLeafNodes />
              <DeleteNode />
            </ContextMenu>
            <Toolbar style={{ position: 'absolute', top: '80px', right: '20px', left: 'unset' }}>
              <SwitchEngine />
              <ZoomFit />
              <RunCluster />
              <Brush />
              <FullScreen containerRef={containerRef} />
              <ClearCanvas />
            </Toolbar>
          </Section>
        </div>
      </GraphProvider>
    </IntlProvider>
  );
};

export default PaperReading;
