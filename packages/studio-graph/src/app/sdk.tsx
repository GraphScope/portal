import React, { useMemo } from 'react';
import { assets, spec, services, defaultCanvas, defaultContainer, ContainerSpec, AtomSpec } from './spec';
import { Utils } from '@graphscope/studio-components';
import Canvas from './canvas';
interface ISdkProps {}

export interface RuntimeAtom extends AtomSpec {
  render: React.ReactNode;
}

const getCom = (container: ContainerSpec) => {
  const containerRender = assets[container.id];
  if (!containerRender) {
    console.warn(`container asset: ${container.id} not found`);
    return {
      ...container,
      render: () => null,
    };
  }
  const items = container.children
    .map(item => {
      const { id } = item;
      const itemRender = assets[id];
      if (!itemRender) {
        console.warn(`asset: ${id} not found`);
        return null;
      }
      return {
        ...item,
        render: itemRender,
      };
    })
    .filter(item => {
      return item;
    });
  const groupedItems = Utils.groupBy(items, (item: AtomSpec, index) => {
    return item.meta?.group;
  });
  console.log('groupedItems', groupedItems, Object.values(groupedItems));
  return {
    ...container,
    render: containerRender,
    props: {
      ...container.props,
      items: Object.values(groupedItems),
    },
  };
};
const Sdk: React.FunctionComponent<ISdkProps> = props => {
  const { container, toolbar, contextmenu, atoms } = useMemo(() => {
    const container = getCom(spec.container);
    const toolbar = getCom(spec.toolbar);
    const contextmenu = getCom(spec.contextmenu);
    const atoms = spec.atoms.map(item => {
      const { id } = item;
      const render = assets[id];
      if (!render) {
        console.warn(`asset: ${id} not found`);
        return {
          ...item,
          render: () => null,
        };
      }
      return {
        ...item,
        render,
      };
    });
    return {
      container,
      toolbar,
      contextmenu,
      atoms,
    };
  }, []);

  console.log('SDK >>>> ', toolbar, contextmenu, atoms);

  return (
    <container.render {...container.props}>
      <Canvas />
      <toolbar.render {...toolbar.props} />
      <contextmenu.render {...contextmenu.props} />
      {atoms.map(item => {
        return <item.render key={item.id} {...item.props} />;
      })}
    </container.render>
  );
};

export default Sdk;
