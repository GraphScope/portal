import React, { useRef } from 'react';
import { Button } from 'antd';
import { Section, useSection, Icons, FullScreen, SegmentedTabs } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  Prepare,
  LoadCSV,
  ZoomFit,
  ClearStatatus,
  SliderFilter,
  RunCluster,
  LayoutSetting,
} from '../components';

import { Divider } from 'antd';

interface QueryGraphProps {
  data: any;
  schema: any;
  graphId: string;
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
  const { data, schema, graphId } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const items = [
    {
      key: 'CSV',
      label: 'CSV',
      value: 'CSV',
      children: <LoadCSV />,
    },

    {
      key: 'Style',
      label: 'Style',
      value: 'Style',
      children: <StyleSetting />,
    },
    {
      key: 'Filter',
      label: 'Filter',
      value: 'Filter',
      children: <SliderFilter />,
    },
    {
      key: 'LayoutSetting',
      label: 'Layout',
      value: 'LayoutSetting',
      children: <LayoutSetting />,
    },
  ];
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '8px',
        height: '100%',
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
        rightSide={<SegmentedTabs items={items} block />}
        autoResize={false}
        leftSideStyle={{
          width: '350px',
        }}
        defaultCollapsed={{
          leftSide: true,
          rightSide: true,
        }}
      >
        <Prepare data={data} schema={schema} graphId={graphId} />
        <Canvas />
        <ClearStatatus />
        <PropertiesPanel />
        <Toolbar style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
          <ToogleButton />
          <Divider style={{ margin: '0px' }} />
          <SwitchEngine />
          <ZoomFit />
          <RunCluster />
          <FullScreen containerRef={containerRef} />
        </Toolbar>
      </Section>
    </div>
  );
};

export default QueryGraph;
