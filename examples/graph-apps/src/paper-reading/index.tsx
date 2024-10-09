import React, { useRef } from 'react';

import { Button } from 'antd';

import { MultipleInstance, Section, useSection, Icons, FullScreen } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  Canvas,
  ZoomFit,
  ClearStatatus,
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
} from '@graphscope/studio-graph';

import { FetchGraph, Searchbar, PaperList, PaperInfo, Statistics } from './components';
import {
  IQueryServices,
  queryCypher as defaultQueryCypher,
  queryCypherSchema as defaultQueryCypherSchema,
} from './service';
export interface QueryGraphProps {
  queryCypher?: IQueryServices['queryCypher'];
  queryCypherSchema?: IQueryServices['queryCypherSchema'];
}

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
  const { queryCypher = defaultQueryCypher, queryCypherSchema = defaultQueryCypherSchema } = props;

  return (
    <MultipleInstance>
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
              <Statistics queryCypher={queryCypher}>
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
            <Searchbar queryCypher={queryCypher} />
          </Toolbar>
          <Toolbar direction="horizontal" style={{ position: 'absolute', top: '20px', right: 'unset', left: '20px' }}>
            <ToogleLeftButton />
          </Toolbar>
          <Toolbar direction="horizontal" style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
            <ToogleRightButton />
          </Toolbar>

          <Canvas />
          <BasicInteraction />
          <FetchGraph queryCypher={queryCypher} queryCypherSchema={queryCypherSchema} />
          <Brush />
          <ClearStatatus />
          <Loading />
          <ContextMenu>
            <NeighborQuery onQuery={queryCypher} />
            <CommonNeighbor onQuery={queryCypher} />
            <DeleteLeafNodes />
            <DeleteNode />
          </ContextMenu>

          <Toolbar style={{ position: 'absolute', top: '80px', right: '20px', left: 'unset' }}>
            <SwitchEngine />
            <ZoomFit />
            <RunCluster />
            <FullScreen containerRef={containerRef} />
            <ClearCanvas />
          </Toolbar>
        </Section>
      </div>
    </MultipleInstance>
  );
};

export default PaperReading;
