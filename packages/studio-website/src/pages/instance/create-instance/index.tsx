import * as React from 'react';
import { Button, Card, Radio, Tabs, Steps, Alert, Row, Col, Space, Tooltip } from 'antd';
import { history } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { useContext } from '../../../valtio/createGraph';
import GraphIn from './graph-in';
import CreateSchema from './create-schema';
interface ICreateInstanceProps {
  graphData?: any;
  isAlert?: boolean;
}
const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = props => {
  const { store, updateStore } = useContext();
  const { isAlert, nodeList, edgeList ,nodeEdge,nodeActiveKey,edgeActiveKey,nodeItems,edgeItems,detail} = store;
  React.useEffect(() => {
    onChange(nodeList[0]?.key);
    updateStore(draft=>{
      draft.nodeEdge = 'Node'
    })
  }, []);
  React.useEffect(() => {
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
            nodeEdge={'Node'}
            isEdit={detail}
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
            nodeEdge={'Edge'}
            isEdit={detail}
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
    updateStore(draft => {
      draft.edgeList = arr;
      draft.option = nodearr
    });
  }, [edgeItems]);
  const add = () => {
    if (nodeEdge == 'Node') {
      const newActiveKey = uuidv4();
      const node = [
        ...nodeList,
        {
          label: 'undefine',
          children: (
            <CreateSchema
              nodeEdge={nodeEdge}
              isEdit={detail}
              newActiveKey={newActiveKey}
              deleteNode={deleteNode}
            />
          ),
          key: newActiveKey,
        },
      ];
      updateStore(draft => {
        draft.nodeActiveKey = newActiveKey;
        draft.nodeList = node
      });
    } else {
      const newActiveKey = uuidv4();
      const node = [
        ...edgeList,
        {
          label: 'undefine',
          children: (
            <CreateSchema
              nodeEdge={nodeEdge}
              isEdit={detail}
              newActiveKey={newActiveKey}
              deleteNode={deleteNode}
            />
          ),
          key: newActiveKey,
        },
      ];
      updateStore(draft => {
        draft.edgeActiveKey = newActiveKey;
        draft.edgeList = node
      });
    }
  };
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
      updateStore(draft => {
        draft.nodeList = newPanes;
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
        draft.edgeList = newPanes;
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
      updateStore(draft => {
        draft.edgeActiveKey = edgeList[0]?.key;
      });
    }
  };

  return (
    <>
      <Card>
        {isAlert || detail ? (
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
                {[...nodeList, ...edgeList].length > 0 ? (
                  <Button type="dashed" onClick={add}>
                    + Add {nodeEdge}
                  </Button>
                ) : null}
              </div>
              {[...nodeList, ...edgeList].length == 0 ? (
                <Button style={{ width: '100%', color: '#1650ff' }} type="dashed" onClick={add}>
                  + Add {nodeEdge}
                </Button>
              ) : null}
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
            <GraphIn isAlert={detail} graphData={[]} />
          </Col>
        </Row>
        {detail ? null : (
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
                console.log(nodeItems,edgeItems);
                history.push('/instance/create/confirm-info');
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
