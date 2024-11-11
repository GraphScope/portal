import React, { useEffect, useState } from 'react';
import Content from './Content';
import { useContext } from '@graphscope/studio-graph';
interface IClusterInfoProps {}

const ClusterInfo: React.FunctionComponent<IClusterInfoProps> = props => {
  const { store } = useContext();
  const { groups, graph } = store;
  console.log('groups', groups);
  const [state, setState] = useState({
    visible: false,
    id: null,
    x: 0,
    y: 0,
    combo: {},
  });
  const hiddenComboInfo = () => {
    setState(preState => {
      return {
        ...preState,
        visible: false,
        id: null,
      };
    });
  };
  const showComboInfo = (ev, combo) => {
    setState(preState => {
      return {
        ...preState,
        visible: true,
        id: combo.id,
        combo: combo,
        x: ev.offsetX,
        y: ev.offsetY,
      };
    });
  };
  useEffect(() => {
    const container = document.querySelector('.force-graph-container');
    function getOffset(el) {
      const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }
    const onClickCombo = ev => {
      const offset = getOffset(container);
      const x = ev.pageX - offset.left;
      const y = ev.pageY - offset.top;
      //@ts-ignore
      const position = graph?.screen2GraphCoords(x, y);
      if (position) {
        const combo = groups.find(item => {
          const { x: gx, y: gy, r: gr } = item;
          const dx = gx - position.x;
          const dy = gy - gr - 6 - position.y; // 采用文本的高度：gy - gr - 6
          const d = Math.sqrt(dx * dx + dy * dy);
          return d < 20;
        });
        if (combo) {
          showComboInfo(ev, combo);
        } else {
          hiddenComboInfo();
        }
      }
    };
    if (container) {
      container.addEventListener('pointerup', onClickCombo);
    }
    return () => {
      if (container) {
        container.removeEventListener('pointerup', onClickCombo);
      }
    };
  }, [groups]);
  const { x, y, id, visible, combo } = state;
  console.log('combo', combo);
  return (
    <div
      style={{
        position: 'absolute',
        // padding: '4px',
        visibility: visible ? 'visible' : 'hidden',
        right: 70, // x,
        top: 20, //y,
        zIndex: 999,
        bottom: 20,
        boxShadow:
          'rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px',
      }}
    >
      <Content id={id} combo={state.combo} />
    </div>
  );
};

export default ClusterInfo;
