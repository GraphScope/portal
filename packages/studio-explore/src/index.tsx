import React, { useRef } from 'react';
import { Button } from 'antd';
import { MultipleInstance, Section, useSection, Icons, FullScreen, SegmentedTabs } from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  ZoomFit,
  ClearStatatus,
  RunCluster,
} from '@graphscope/studio-graph';

import { Workflow, Upload, EmbedSchema, Cluster } from './components';

import { Divider } from 'antd';

interface QueryGraphProps {}

const ToogleButton = () => {
  const { toggleRightSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar revert />} onClick={() => toggleRightSide()} type="text" />
    </div>
  );
};

const ExploreApp: React.FunctionComponent<QueryGraphProps> = props => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const workflows = [
    {
      key: 'Upload files',
      label: 'Step 1: Upload files',
      icon: <Icons.FileYaml />,
      children: <Upload />,
    },
    {
      key: 'Embed Graph',
      label: 'Step 2: Embed Graph',
      icon: <Icons.Cluster />,
      children: <EmbedSchema />,
    },
    {
      key: 'Cluster',
      label: 'Step 3: Cluster',
      icon: <Icons.Cluster />,
      children: <Cluster />,
    },
  ];
  const items = [
    {
      key: 'Workflow',
      label: 'Workflow',
      value: 'Workflow',
      children: <Workflow items={workflows} />,
    },
    {
      key: 'Info',
      label: 'Info',
      value: 'Info',
      children: <PropertiesPanel />,
    },
    {
      key: 'Style',
      label: 'Style',
      value: 'Style',
      children: <StyleSetting />,
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
      <MultipleInstance>
        <Section
          splitBorder
          leftSide={<SegmentedTabs items={items} block />}
          autoResize={false}
          leftSideStyle={{
            width: '650px',
          }}
          defaultCollapsed={{
            leftSide: false,
            rightSide: true,
          }}
        >
          <Canvas />
          <ClearStatatus />
          <Toolbar style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
            <ToogleButton />
            <Divider style={{ margin: '0px' }} />
            <SwitchEngine />
            <ZoomFit />
            <RunCluster />
            <FullScreen containerRef={containerRef} />
          </Toolbar>
        </Section>
      </MultipleInstance>
    </div>
  );
};

export default ExploreApp;
