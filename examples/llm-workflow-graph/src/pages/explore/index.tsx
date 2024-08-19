import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from 'antd';
import locales from '../../locales';
import {
  MultipleInstance,
  Section,
  useSection,
  Icons,
  FullScreen,
  SegmentedTabs,
  ThemeProvider,
} from '@graphscope/studio-components';
import {
  Toolbar,
  SwitchEngine,
  PropertiesPanel,
  Canvas,
  StyleSetting,
  ZoomFit,
  ClearStatatus,
  RunCluster,
  SliderFilter,
} from '@graphscope/studio-graph';

import { Workflow, Upload, EmbedSchema, Cluster, Summarize, ClusterInfo } from '../../components';

import { Divider } from 'antd';

interface QueryGraphProps {}

const ToogleButton = () => {
  const { toggleLeftSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar />} onClick={() => toggleLeftSide()} type="text" />
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
    {
      key: 'Summarize',
      label: 'Step 4: Summarize',
      icon: <Icons.Cluster />,
      children: <Summarize />,
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
    {
      key: 'SliderFilter',
      label: 'SliderFilter',
      value: 'SliderFilter',
      children: <SliderFilter />,
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
            width: '450px',
          }}
          defaultCollapsed={{
            leftSide: false,
            rightSide: true,
          }}
        >
          <Canvas />
          <ClearStatatus />
          <ClusterInfo />
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
