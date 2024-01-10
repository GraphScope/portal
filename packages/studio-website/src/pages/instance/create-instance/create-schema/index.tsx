import * as React from 'react';
import { Card, Tabs,  Row, Col, Tooltip } from 'antd';
import { cloneDeep } from 'lodash';
import { useContext } from '../valtio/createGraph';
import GraphIn from './graph-in';
import Schema from '../create-schema/schema';
import NodeEdgeButton from './node-edge-button'
interface ICreateInstanceProps {
  graphData?: any;
  isAlert?: boolean;
}
const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = () => {
  const { store, updateStore } = useContext();
  const { nodeList, edgeList ,nodeEdge,nodeActiveKey,edgeActiveKey,nodeItems,edgeItems} = store;
  React.useEffect(() => {
    onChange(nodeList[0]?.key);
    updateStore(draft=>{
      draft.nodeEdge = 'Node'
    })
  }, []);
  React.useEffect(() => {
    console.log(cloneDeep(nodeItems));
    
    const data: { label: string; children: JSX.Element; key: string }[] = cloneDeep(nodeItems);
    let arr: { label: any; children: JSX.Element; key: string }[] = [];
    let nodearr: { value: string; label: string }[] = [];
    Object.entries(data).map(key => {
      arr.push({
        label: (
          <div style={{ width: '60px', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" title={key[1].label || 'undefine'}>
              {key[1].label || 'undefine'}
            </Tooltip>
          </div>
        ),
        children: (
          <Schema
            nodeEdge={'Node'}
            newActiveKey={key[0]}
            deleteNode={deleteNode}
            data={key[1]}
          />
        ),
        key: key[0],
      });
      nodearr.push({
        value: key[1].label,
        label: key[1].label,
      });
    });

    updateStore(draft => {
      draft.option = nodearr;
      draft.nodeList = arr
    });
  }, [nodeItems]);
  React.useEffect(() => {
    const data: { label: string; children: JSX.Element; key: string }[] = cloneDeep(edgeItems);
    let arr: { label: any; children: any; key: string }[] | { label: any; children: JSX.Element; key: string }[] = [];
    Object.entries(data).map(key => {
      arr.push({
        label: (
          <div style={{ width: '60px', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" title={key[1].label || 'undefine'}>
              {key[1].label || 'undefine'}
            </Tooltip>
          </div>
        ),
        children: (
          <Schema
            nodeEdge={'Edge'}
            newActiveKey={key[0]}
            deleteNode={deleteNode}
            data={key[1]}
          />
        ),
        key: key[0],
      });
    });
    const nodedata: { label: string; children: JSX.Element; key: string }[]  = cloneDeep(nodeItems);
    let nodearr: { value: any; label: any }[] = [];
    Object.entries(nodedata).map(key => {
      nodearr.push({
        value: key[1].label,
        label: key[1].label,
      });
    });
    updateStore(draft => {
      draft.edgeList = arr;
      draft.option = nodearr
    });
  }, [edgeItems]);
  // del node or edge
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
  const onChange = (key: string) => {
    if (nodeEdge == 'Node') {
      updateStore(draft => {
        draft.nodeActiveKey = key;
      });
    } else {
      updateStore(draft => {
        draft.edgeActiveKey = key;
      });
    }
  };

  return (
      <Card>
        <Row style={{ marginTop: '16px' }}>
          <Col span={14}>
            <div
              style={{
                backgroundColor: '#fff',
                padding: '16px',
                border: '1px solid #000',
                height: '65vh',
                marginRight: '12px',
                overflow: 'hidden',
              }}
            >
              <NodeEdgeButton/>
              <div>
                <div style={{ display: nodeEdge == 'Node' ? '' : 'none' }}>
                  <Tabs
                    tabBarStyle={{ borderLeft: 0 }}
                    tabPosition="left"
                    items={cloneDeep(nodeList)}
                    activeKey={nodeActiveKey}
                    onChange={onChange}
                  />
                </div>
                <div style={{ display: nodeEdge !== 'Node' ? '' : 'none' }}>
                  <Tabs
                    tabBarStyle={{ borderLeft: 0 }}
                    tabPosition="left"
                    items={cloneDeep(edgeList)}
                    activeKey={edgeActiveKey}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col span={10}>
            <GraphIn />
          </Col>
        </Row>
      </Card>
  );
};
export default CreateInstance;
