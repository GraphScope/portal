import React, { useMemo } from 'react';
import { assets, spec, services, defaultCanvas, defaultContainer } from './spec';
interface ISdkProps {}

interface RuntimeComponent {
  id: string;
  props: any;
  render: React.ReactNode;
}
const Sdk: React.FunctionComponent<ISdkProps> = props => {
  const { container, components, menu, canvas } = useMemo(() => {
    //@ts-ignore
    let canvas: RuntimeComponent = defaultCanvas;
    //@ts-ignore
    let container: RuntimeComponent = defaultContainer;
    const components: RuntimeComponent[] = [];
    const menuitem: RuntimeComponent[] = [];
    const runtimeComponentMap = {};
    spec.forEach(item => {
      const { type, id, props } = item;

      if (type === 'canvas') {
        canvas = { ...item, render: assets[id] };
      }
      if (type === 'components') {
        components.push({
          ...item,
          render: assets[id],
        });
        runtimeComponentMap[id] = assets[id];
      }
      if (type === 'menuitem') {
        menuitem.push({
          ...item,
          render: assets[id],
        });
      }
      if (type === 'container') {
        container = {
          ...item,
          render: assets[id],
          props: {
            items: props.items.map(subItem => {
              return subItem.map(i => {
                return {
                  id: i,
                  children: runtimeComponentMap[i],
                };
              });
            }),
          },
        };
      }
    });

    return {
      container,
      components,
      menu,
      canvas,
    };
  }, []);

  console.log(container);

  return (
    <container.render {...container.props}>
      <canvas.render {...canvas.props} />
    </container.render>
  );
};

export default Sdk;
