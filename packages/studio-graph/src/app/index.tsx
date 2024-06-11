import * as React from 'react';
import Canvas from './canvas';
import { Button } from 'antd';
import { Section, useSection, Icons, MultipleInstance } from '@graphscope/studio-components';
import Side from './side';
interface StudioGraphProps {}
const ToogleButton = () => {
  const { toggleLeftSide } = useSection();
  return (
    <div>
      <Button icon={<Icons.Sidebar />} onClick={toggleLeftSide} />
    </div>
  );
};

const StudioGraph: React.FunctionComponent<StudioGraphProps> = props => {
  return (
    <div
      style={{
        background: '#fff',
        height: '100%',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: '8px',
      }}
    >
      <MultipleInstance>
        <Section
          leftSide={<Side />}
          autoResize={false}
          defaultStyle={{
            leftSideCollapsed: false,
            leftSideWidth: 200,
            rightSideCollapsed: true,
            rightSideWidth: 300,
          }}
        >
          <ToogleButton />
          <Canvas />
        </Section>
      </MultipleInstance>
    </div>
  );
};

export default StudioGraph;
