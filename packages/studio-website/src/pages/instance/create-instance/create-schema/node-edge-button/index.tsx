import * as React from 'react';
import { Button, Radio, RadioChangeEvent } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import {cloneDeep} from 'lodash'
import { useContext } from '../../valtio/createGraph';
import Schema from '../schema';
const NodeEdgeButton = () => {
  const { store, updateStore } = useContext();
  const { nodeList, edgeList, nodeEdge, nodeItems, edgeItems, detail } = store;
  const nodeEdgeChange = (e: RadioChangeEvent): void => {
    updateStore(draft => {
      draft.nodeEdge = e.target.value;
    });
    if (nodeEdge == 'Edge') {
      updateStore(draft => {
        draft.edgeActiveKey = edgeList[0]?.key;
      });
    }
  };
  const add = () => {
    if (nodeEdge == 'Node') {
      const newActiveKey = uuidv4();
      const node = [
        ...nodeList,
        {
          label: 'undefine',
          children: <Schema nodeEdge={nodeEdge} newActiveKey={newActiveKey} deleteNode={deleteNode}/>,
          key: newActiveKey,
        },
      ];
      updateStore(draft => {
        draft.nodeActiveKey = newActiveKey;
        draft.nodeList = node;
      });
    } else {
      const newActiveKey = uuidv4();
      const node = [
        ...edgeList,
        {
          label: 'undefine',
          children: <Schema nodeEdge={nodeEdge} newActiveKey={newActiveKey} deleteNode={deleteNode}/>,
          key: newActiveKey,
        },
      ];
      updateStore(draft => {
        draft.edgeActiveKey = newActiveKey;
        draft.edgeList = node;
      });
    }
  };
  const deleteNode = (val: string, key: string) => {
    let data = val == 'Node' ? cloneDeep(nodeList) : cloneDeep(edgeList);
    const newPanes = data.filter(pane => pane.key !== key);
    if (val == 'Node') {
      const nodedata = cloneDeep(nodeItems);
      Object.entries(nodedata).map((keys, i) => {
        if (keys[0] == key) {
          delete nodedata[key];
        }
      });
      const activeKey = Object.keys(nodedata)[Object.keys(nodedata).length-1];
      updateStore(draft => {
        draft.nodeList = newPanes;
        draft.nodeItems = nodedata;
        draft.nodeActiveKey = activeKey;
      });
    } else {
      const edgedata = cloneDeep(edgeItems);
      Object.entries(edgedata).map((keys, i) => {
        if (keys[0] == key) {
          delete edgedata[key];
        }
      });
      const activeKey = Object.keys(edgedata)[Object.keys(edgedata).length-1];
      updateStore(draft => {
        draft.edgeList = newPanes;
        draft.edgeItems = edgedata;
        draft.edgeActiveKey = activeKey;
      });
    }
  };
  const nodeEddgeLength = () => {
    if (nodeEdge == 'Node') {
      return nodeList.length;
    } else {
      return edgeList.length;
    }
  };
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Radio.Group defaultValue="Node" style={{ marginBottom: '16px' }} onChange={e => nodeEdgeChange(e)}>
          <Radio.Button value="Node">Nodes</Radio.Button>
          <Radio.Button value="Edge">Edges</Radio.Button>
        </Radio.Group>
        {nodeEddgeLength() > 0 ? (
          <Button type="dashed" onClick={add} disabled={detail}>
            + Add {nodeEdge}
          </Button>
        ) : null}
      </div>
      {nodeEddgeLength() == 0 ? (
        <Button disabled={detail} style={{ width: '100%', color: '#1650ff' }} type="dashed" onClick={add}>
          + Add {nodeEdge}
        </Button>
      ) : null}
    </>
  );
};
export default NodeEdgeButton;
