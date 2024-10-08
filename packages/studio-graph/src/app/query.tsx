import React, { useRef } from 'react';
import { Button } from 'antd';
import {
  MultipleInstance,
  Section,
  //  SegmentedTabs,
  useSection,
  Icons,
  FullScreen,
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
  SegmentedTabs,
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

interface QueryGraphProps {
  data: any;
  schema: any;
  graphId: string;
  onQuery: (params: any) => Promise<any>;
}

const ToogleButton = () => {
  const { toggleRightSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar revert />} onClick={() => toggleRightSide()} type="text" />
    </div>
  );
};

const QueryGraph: React.FunctionComponent<QueryGraphProps> = props => {
  const { data, schema, graphId, onQuery } = props;
  console.log('data>>>>', data);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const items = [
    {
      key: 'Info',
      label: 'Info',
      value: 'Info',
      children: <PropertiesPanel />,
      autoFoucs: true,
    },
    {
      key: 'Style',
      label: 'Style',
      value: 'Style',
      children: <StyleSetting />,
    },
  ];

  const onSelectNodes = values => {
    console.log(values);
  };

  return (
    <div
      style={{
        // background: '#fff',
        borderRadius: '8px',
        height: '500px',
      }}
      ref={containerRef}
    >
      <MultipleInstance>
        <Section
          splitBorder
          rightSide={<SegmentedTabs items={items} block nodeClickTab="Info" canvasClickTab="Style" />}
          autoResize={false}
          leftSideStyle={{
            width: '350px',
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
          <Brush onSelect={onSelectNodes} />
          <Loading />
          <ContextMenu>
            <NeighborQuery onQuery={onQuery} />
            <CommonNeighbor onQuery={onQuery} />
            <DeleteLeafNodes />
            <DeleteNode />
          </ContextMenu>
          <Toolbar style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
            <ToogleButton />
            <Divider style={{ margin: '0px' }} />
            <SwitchEngine />
            <FullScreen containerRef={containerRef} />
            <ZoomFit />
            <RunCluster />
            <Export />
          </Toolbar>
        </Section>
      </MultipleInstance>
    </div>
  );
};

export default QueryGraph;
