import * as React from 'react';
import { useContext } from '../../';
import { Flex, theme } from 'antd';

export interface IContextMenuProps {
  children: React.ReactNode;
}

const ContextMenu: React.FunctionComponent<IContextMenuProps> = props => {
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
    const handleContextmenu = params => {
      //@ts-ignore
      const { node, evt } = params;

      const { offsetX, offsetY } = evt;
      setState(preState => {
        return {
          ...preState,
          visible: true,
          x: offsetX,
          y: offsetY,
        };
      });
      updateStore(draft => {
        draft.nodeStatus = {
          ...draft.nodeStatus,
          [node.id]: {
            selected: true,
          },
        };
        // draft.selectNodes = [node];
      });
    };
    const handleClear = () => {
      setState(preState => {
        return {
          ...preState,
          visible: false,
          x: 0,
          y: 0,
        };
      });
    };

    emitter?.on('node:contextmenu', handleContextmenu);
    emitter?.on('canvas:click', handleClear);

    return () => {
      emitter?.off('node:contextmenu', handleContextmenu);
      emitter?.off('canvas:click', handleClear);
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

export default ContextMenu;
