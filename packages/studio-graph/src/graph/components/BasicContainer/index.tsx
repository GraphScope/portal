import * as React from 'react';
import { Section, useSection, Icons } from '@graphscope/studio-components';
import { Button } from 'antd';
import { SegmentedTabs } from '@graphscope/studio-components';

export interface IBasicContainerProps {
  items: React.ReactNode[][];
  children: React.ReactNode;
}

const ToogleButton = () => {
  const { toggleLeftSide } = useSection();
  return (
    <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
      <Button icon={<Icons.Sidebar />} onClick={() => toggleLeftSide()} />
    </div>
  );
};

const BasicContainer: React.FunctionComponent<IBasicContainerProps> = props => {
  const { items, children } = props;
  const [leftSide] = items;
  const _leftSide = leftSide.map(item => {
    console.log('item', item);
    //@ts-ignore
    const { id, children: ItemChildren } = item;
    return {
      label: id,
      key: id,
      children: <ItemChildren />,
    };
  });
  console.log('item', _leftSide);
  const left = <SegmentedTabs items={_leftSide} />;
  return (
    <Section leftSide={left} rightSide={null}>
      {children}
      <ToogleButton />
    </Section>
  );
};

export default BasicContainer;
