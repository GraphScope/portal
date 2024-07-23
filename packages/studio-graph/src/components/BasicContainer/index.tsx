import * as React from 'react';
import { Section, useSection, Icons } from '@graphscope/studio-components';
import { Button } from 'antd';
import { SegmentedTabs } from '@graphscope/studio-components';
import { useContext } from '../../app/useContext';
import type { RuntimeAtom } from '../../app/sdk';
export interface IBasicContainerProps {
  items: RuntimeAtom[][];
  children: React.ReactNode;
}

const ToogleButton = () => {
  const { toggleLeftSide } = useSection();
  return (
    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
      <Button icon={<Icons.Sidebar />} onClick={() => toggleLeftSide()} />
    </div>
  );
};

const BasicContainer: React.FunctionComponent<IBasicContainerProps> = props => {
  const { store, updateStore } = useContext();
  const { graph } = store;

  const { items, children } = props;
  const [leftSide = [], rightSide = []] = items;

  const _leftSide = leftSide.map(item => {
    console.log('item', item);
    const { id, render: ItemRender, meta } = item;
    return {
      label: id,
      key: id,
      //@ts-ignore
      children: graph && <ItemRender />,
    };
  });
  const RightSide = rightSide[0]?.render;

  const left = <SegmentedTabs items={_leftSide} />;
  console.log(_leftSide);
  return (
    <Section leftSide={left} rightSide={graph && <RightSide />} splitBorder>
      {children}
      <ToogleButton />
    </Section>
  );
};

export default BasicContainer;
