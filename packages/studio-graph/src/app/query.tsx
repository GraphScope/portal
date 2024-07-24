import React, { useRef } from 'react';
import { Button } from 'antd';

import { MultipleInstance, Section, SegmentedTabs, useSection, Icons, FullScreen } from '@graphscope/studio-components';
import { Toolbar, SwitchEngine, PropertiesPanel, Canvas, StyleSetting } from '../components';
import { useContext } from '../hooks/useContext';
import { Divider } from 'antd';

interface QueryGraphProps {
  data: any;
  schema: any;
}

const ToogleButton = () => {
  const { toggleRightSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar />} onClick={() => toggleRightSide()} type="text" />
    </div>
  );
};

const RecivePropsData = props => {
  const { data } = props;
  const { updateStore } = useContext();
  React.useEffect(() => {
    updateStore(draft => {
      draft.data = data;
    });
  }, [data]);
  return null;
};

const Container = props => {
  const { data, schema } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const items = [
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
      children: <StyleSetting schema={schema} />,
    },
  ];
  return (
    <div style={{ background: '#fff', height: '100%' }} ref={containerRef}>
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
        <RecivePropsData data={data} />
        <Canvas />
        <Toolbar style={{ position: 'absolute', top: '20px', right: '20px', left: 'unset' }}>
          <ToogleButton />
          <Divider style={{ margin: '0px' }} />
          <SwitchEngine />
          <FullScreen containerRef={containerRef} />
        </Toolbar>
      </Section>
    </div>
  );
};

const QueryGraph: React.FunctionComponent<QueryGraphProps> = props => {
  const { data, schema } = props;
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '8px',
        height: '500px',
        // border: '1px solid #ddd',
      }}
    >
      <MultipleInstance>
        <Container data={data} schema={schema} />
      </MultipleInstance>
    </div>
  );
};

export default QueryGraph;
