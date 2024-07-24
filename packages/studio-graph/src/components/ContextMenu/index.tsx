import * as React from 'react';
import { useContext } from '../../hooks/useContext';

export interface IContextMenuProps {}

const ContextMenu: React.FunctionComponent<IContextMenuProps> = props => {
  const { store } = useContext();
  const { graph, emitter } = store;
  const [state, setState] = React.useState({
    visible: false,
    data: {},
    x: 0,
    y: 0,
  });
  const { visible, data, x, y } = state;
  React.useEffect(() => {
    if (graph && emitter) {
      emitter.on('node:contextmenu', params => {
        //@ts-ignore
        const { node, evt } = params;
        console.log('onNodeRightClick >>>>>>>', node, evt);
        const { offsetX, offsetY } = evt;
        setState(preState => {
          return {
            ...preState,
            visible: true,
            data: node,
            x: offsetX,
            y: offsetY,
          };
        });
      });

      emitter.on('node:click', () => {
        console.log('ContextMenu >>> node click');
        setState(preState => {
          return {
            ...preState,
            visible: false,
            data: {},
            x: 0,
            y: 0,
          };
        });
      });
    }
    return () => {
      emitter?.off('node:click');
      emitter?.off('node:contextmenu');
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
        width: 100,
        height: 100,
        backgroundColor: 'red',
        zIndex: 100,
      }}
    >
      {x} | {y}
    </div>
  );
};

export default ContextMenu;
