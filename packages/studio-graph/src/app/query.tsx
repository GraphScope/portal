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

const ToogleButton = ({ color }) => {
  const { toggleRightSide } = useSection();
  return (
    <Tooltip title={<FormattedMessage id="Toggle Right Side" />} placement="left">
      <Button icon={<Icons.Sidebar revert style={{ color }} />} onClick={() => toggleRightSide()} type="text" />
    </Tooltip>
  );
};

const QueryGraph: React.FunctionComponent<QueryGraphProps> = props => {
  const { data, schema, graphId, onQuery } = props;
  console.log('data>>>>', data);
  const { buttonBackground } = useCustomToken();
  const { isLight } = useStudioProvier();
  const color = !isLight ? '#ddd' : '#000';
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
            <Brush onSelect={onSelectNodes} />
            <Divider style={{ margin: '0px' }} />
            <SwitchEngine />
            <RunCluster />
            <Export />
          </Toolbar>
        </Section>
      </MultipleInstance>
    </div>
  );
};

export default QueryGraph;
