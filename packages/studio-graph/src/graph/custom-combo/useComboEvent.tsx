import { useContext } from '../../hooks/useContext';
import { useEffect } from 'react';
import { ForceGraphInstance } from 'force-graph';
import { Utils } from '@graphscope/studio-components';
import type { ICombo } from './typing';
import { isPointInRectangle, getComboTextRect, getOffset } from './utils';
import { renderCombo } from './render';

/**
 * 支持拖拽和点击事件
 */
const useComboEvent = () => {
  const { store, updateStore } = useContext();
  const { emitter, graph, combos } = store;

  useEffect(() => {
    const container = document.querySelector('.force-graph-container canvas');
    let combo: ICombo = {} as ICombo;
    let isDragging = false;
    let startX: number, startY: number;
    let clickStartTime: number;

    function getTargetCombo(ev) {
      if (container) {
        const offset = getOffset(container);
        const x = ev.pageX - offset.left;
        const y = ev.pageY - offset.top;

        const position = graph?.screen2GraphCoords(x, y, 0);

        if (position) {
          const combo = combos.find(item => {
            const rect = getComboTextRect(item);
            return isPointInRectangle(position, rect);
          });
          if (combo) {
            return combo;
          }
        }
      }
      return false;
    }
    const onClickCombo = ev => {
      const combo = getTargetCombo(ev);
      if (combo) {
        emitter?.emit('combo:click', {
          ...ev,
          item: combo,
        });
      }
    };
    function updatePosition(dx, dy) {
      if (graph) {
        const { nodes } = graph.graphData();
        nodes.forEach(node => {
          const match = combo.children.indexOf(node.id as string) !== -1;
          if (match) {
            node.x = node.x + dx;
            node.y = node.y + dy;
          }
        });
      }
    }
    let _groups = Utils.fakeSnapshot(combos) as ICombo[];

    function updateCombo(dx, dy) {
      const g = _groups.map(group => {
        if (group.id === combo.id) {
          return {
            ...group,
            x: group.x + dx,
            y: group.y + dy,
          };
        }
        return group;
      });
      _groups = g;
      renderCombo(graph as ForceGraphInstance, g);
    }

    function pointerdown(e) {
      clickStartTime = Date.now(); // 记录按下时间
      if (container) {
        combo = getTargetCombo(e);
        if (combo) {
          //禁用默认的 pan 交互
          (graph as ForceGraphInstance).enablePanInteraction(false);
          container.classList.add('grabbable');
          startX = e.clientX;
          startY = e.clientY;
          isDragging = true;
        }
      }
    }
    function pointermove(e: any) {
      if (isDragging && container) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        updatePosition(dx, dy);
        updateCombo(dx, dy);
      }
    }
    function pointerup(e: any) {
      if (isDragging && container) {
        isDragging = false;
        container.classList.remove('grabbable');
        const clickDuration = Date.now() - clickStartTime; // 计算按下持续时间
        // 如果按下时间非常短，认为是点击事件,100ms 作为点击和拖拽的阈值
        if (clickDuration < 200) {
          onClickCombo(e);
        } else {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          updatePosition(dx, dy);
          updateCombo(dx, dy);
          updateStore(draft => {
            draft.combos = _groups;
            draft.reheatSimulation = false;
          });
        }
      }
      //拖拽combo结束后，启用 pan 交互
      (graph as ForceGraphInstance).enablePanInteraction(true);
    }
    function pointerout() {
      // isDragging = false;
      // clickStartTime = 0;
    }
    if (container) {
      // 监听 pointerdown 事件来开始拖拽
      container.addEventListener('pointerdown', pointerdown);
      // 监听 pointermove 事件来移动元素
      container.addEventListener('pointermove', pointermove);
      // 监听 pointerup 事件来结束拖拽
      container.addEventListener('pointerup', pointerup);
      // 监听 pointerout 事件来处理拖拽出画布的情况
      container.addEventListener('pointerout', pointerout);
    }

    return () => {
      if (container) {
        container.removeEventListener('pointerdown', pointerdown);
        // 监听 pointermove 事件来移动元素
        container.removeEventListener('pointermove', pointermove);
        // 监听 pointerup 事件来结束拖拽
        container.removeEventListener('pointerup', pointerup);
        // 监听 pointerout 事件来处理拖拽出画布的情况
        container.removeEventListener('pointerout', pointerout);
      }
    };
  }, [combos, graph, emitter]);
};

export default useComboEvent;
