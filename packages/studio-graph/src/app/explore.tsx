import React, { useRef } from 'react';
import { Button } from 'antd';
import { MultipleInstance, Section, SegmentedTabs, useSection, Icons, FullScreen } from '@graphscope/studio-components';
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
          rightSide={<SegmentedTabs items={items} block />}
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
          <ClearStatatus />
          <Toolbar style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
            <ToogleButton />
            <Divider style={{ margin: '0px' }} />
            <SwitchEngine />
            <ZoomFit />
            <FullScreen containerRef={containerRef} />
          </Toolbar>
        </Section>
      </MultipleInstance>
    </div>
  );
};

export default QueryGraph;
