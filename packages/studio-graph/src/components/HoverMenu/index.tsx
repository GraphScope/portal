import * as React from 'react';
import { useContext } from '../../';
import { Flex, theme } from 'antd';

export interface IContextMenuProps {
  children: React.ReactNode;
}

const HoverMenu: React.FunctionComponent<IContextMenuProps> = props => {
  const { children } = props;
  const { store, updateStore } = useContext();
  const { token } = theme.useToken();
  const { graph, emitter } = store;
  const [state, setState] = React.useState({
    visible: false,

    x: 0,
    y: 0,
  });

  const { visible, x, y } = state;
  React.useEffect(() => {
    const handleHover = params => {
      if (graph) {
        //@ts-ignore
        const { node, prevNode } = params;
        if (node && graph.graph2ScreenCoords) {
          const { x, y } = graph.graph2ScreenCoords(node.x, node.y, 0);
          setState(preState => {
            return {
              ...preState,
              visible: true,
              x: x,
              y: y,
            };
          });
        } else {
          setState(preState => {
            return {
              ...preState,
              visible: false,
            };
          });
        }
      }
    };

    emitter?.on('node:hover', handleHover);
    return () => {
      emitter?.off('node:hover', handleHover);
    };
  }, [emitter]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        position: 'absolute',
        left: x,
        top: y,
        width: 180,
        height: 'auto',
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        zIndex: 2000,
        padding: '4px',
        borderRadius: '8px',
      }}
    >
      <Flex vertical gap={8}>
        {children}
      </Flex>
    </div>
  );
};

export default HoverMenu;
