import * as React from 'react';
import { Button, Card, Radio, Tabs, Steps, Alert, Row, Col, Space, Tooltip } from 'antd';
import { useImmer } from 'use-immer';
import { useLocation, history } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { setLocalData, getLocalData } from '../localStorage';
import { useContext } from '../../../valtio/createGraph';
import GraphIn from './graph-in';
import CreateSchema from './create-schema';
interface ICreateInstanceProps {
  graphData?: any;
  isAlert?: boolean;
}
interface Istate {
  nodeitems: {
    label: string;
    children: any;
    key: string;
  }[];
  edgeitems: {
    label: string;
    children: any;
    key: string;
  }[];
}
const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = props => {
  const nodeRef = React.useRef([]);
  const edgeRef = React.useRef([]);
  const { store, updateStore } = useContext();
  const { isAlert, nodeList, edgeList ,nodeEdge,nodeActiveKey,edgeActiveKey,nodeItems,edgeItems} = store;
  const params = useLocation().state;
  const [state, updateState] = useImmer<Istate>({
    nodeitems: [],
    edgeitems: [],
  });
  const { nodeitems, edgeitems } = state;
  React.useEffect(() => {
    onChange(nodeitems[0]?.key);
  }, []);
  React.useEffect(() => {
    // const data = cloneDeep(getLocalData('nodeList'));
    const data = cloneDeep(nodeItems);
    let arr: { label: any; children: any; key: string }[] | { label: any; children: JSX.Element; key: string }[] = [];
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
          <CreateSchema
            nodeEdge={nodeEdge}
            isEdit={params == 'detail'}
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
    updateState(draft => {
      draft.nodeitems = arr;
    });
    updateStore(draft => {
      draft.option = nodearr;
    });
  }, [nodeItems]);
  React.useEffect(() => {
    edgeChange('Edge');
  }, [edgeItems]);
  const add = () => {
    if (nodeEdge == 'Node') {
      const newActiveKey = uuidv4();
      const node = [
        ...nodeitems,
        {
          label: 'undefine',
          children: (
            <CreateSchema
              nodeEdge={nodeEdge}
              isEdit={params == 'detail'}
              newActiveKey={newActiveKey}
              deleteNode={deleteNode}
            />
          ),
          key: newActiveKey,
        },
      ];
      updateState(draft => {
        draft.nodeitems = node;
      });
      updateStore(draft => {
        draft.nodeActiveKey = newActiveKey;
        draft.nodeList = node
      });
      nodeRef.current = node;
    } else {
      const newActiveKey = uuidv4();
      const node = [
        ...edgeitems,
        {
          label: 'undefine',
          children: (
            <CreateSchema
              nodeEdge={nodeEdge}
              isEdit={params == 'detail'}
              newActiveKey={newActiveKey}
              deleteNode={deleteNode}
            />
          ),
          key: newActiveKey,
        },
      ];
      updateState(draft => {
        draft.edgeitems = node;
      });
      updateStore(draft => {
        draft.edgeActiveKey = newActiveKey;
        draft.edgeList = node
      });
      edgeRef.current = node;
    }
  };
  
  // del node or edge
  const deleteNode = (val: string, key: string) => {
    let data = val == 'Node' ? nodeRef.current : edgeRef.current;
    const newPanes = data.filter(pane => pane.key !== key);
    if (val == 'Node') {
      const nodedata = cloneDeep(nodeItems);
      Object.entries(nodedata).map((keys, i) => {
        if (keys[0] == key) {
          delete nodedata[key];
        }
      });
      updateState(draft => {
        draft.nodeitems = newPanes;
      });
      updateStore(draft => {
        draft.nodeList = nodedata;
        draft.nodeItems = nodedata
      });
    } else {
      const edgedata = cloneDeep(edgeItems);
      Object.entries(edgedata).map((keys, i) => {
        if (keys[0] == key) {
          delete edgedata[key];
        }
      });
      updateStore(draft => {
        draft.edgeList = edgedata;
        draft.edgeItems = edgedata
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
  const nodeEdgeChange = (e: { target: { value: string } }): void => {
    updateStore(draft => {
      draft.nodeEdge = e.target.value;
    });
    if(nodeEdge == 'Edge'){
      edgeChange(e.target.value);
      updateStore(draft => {
        draft.edgeActiveKey = edgeitems[0]?.key;
      });
    }
  };
  const edgeChange = val => {
    const data = cloneDeep(edgeItems);
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
          <CreateSchema
            nodeEdge={val}
            isEdit={params == 'detail'}
            newActiveKey={key[0]}
            deleteNode={deleteNode}
            data={key[1]}
          />
        ),
        key: key[0],
      });
    });
    const nodedata = cloneDeep(nodeItems);
    let nodearr: { value: any; label: any }[] = [];
    Object.entries(nodedata).map(key => {
      nodearr.push({
        value: key[1].label,
        label: key[1].label,
      });
    });
    updateState(draft => {
      draft.edgeitems = arr;
    });
  };

  return (
    <>
      <Card>
        {isAlert || params == 'detail' ? (
          <Alert
            message="您的图实例类型为 Interactive，一旦创建则不支持修改图模型，您可以选择新建图实例"
            type="info"
            showIcon
            closable
            style={{ margin: '16px 0' }}
          />
        ) : (
          <Steps
            current={1}
            items={[
              {
                title: 'Choose EngineType',
              },
              {
                title: 'Create Schema',
              },
              {
                title: 'Result',
              },
            ]}
          />
        )}
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Radio.Group defaultValue="Node" style={{ marginBottom: '16px' }} onChange={nodeEdgeChange}>
                  <Radio.Button value="Node">Nodes</Radio.Button>
                  <Radio.Button value="Edge">Edges</Radio.Button>
                </Radio.Group>
                {[...nodeitems, ...edgeitems].length > 0 ? (
                  <Button type="dashed" onClick={add}>
                    + Add {nodeEdge}
                  </Button>
                ) : null}
              </div>
              {[...nodeitems, ...edgeitems].length == 0 ? (
                <Button style={{ width: '100%', color: '#1650ff' }} type="dashed" onClick={add}>
                  + Add {nodeEdge}
                </Button>
              ) : null}
              <div>
                <div style={{ display: nodeEdge == 'Node' ? '' : 'none' }}>
                  <Tabs
                    // defaultActiveKey={nodeitems[0]?.key}
                    tabBarStyle={{ borderLeft: 0 }}
                    tabPosition="left"
                    items={nodeitems}
                    activeKey={nodeActiveKey}
                    onChange={onChange}
                  />
                </div>
                <div style={{ display: nodeEdge !== 'Node' ? '' : 'none' }}>
                  <Tabs
                    // defaultActiveKey={'edge0'}
                    tabBarStyle={{ borderLeft: 0 }}
                    tabPosition="left"
                    items={edgeitems}
                    activeKey={edgeActiveKey}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
          </Col>
          <Col span={10}>
            <GraphIn isAlert={params == 'detail'} graphData={[]} />
          </Col>
        </Row>
        {params == 'detail' ? null : (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                history.back();
              }}
            >
              上一页
            </Button>
            <Button
              type="primary"
              onClick={() => {
                history.push('/instance/create/confirm-info',nodeList);
              }}
            >
              下一页
            </Button>
          </Space>
        )}
      </Card>
    </>
  );
};
export default CreateInstance;
