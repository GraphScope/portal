import * as React from 'react';
import { Button, Form, Radio, Tabs, Steps, Alert, Row, Col, Space } from 'antd';
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
  activeKey: string;
  nodeEdge: string;
  graphData: [];
}
const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = props => {
  const { graphData } = props;
  const { store, updateStore } = useContext();
  const { isAlert, nodeList, edgeList } = store;
  const params = useLocation().state;

  const [state, updateState] = useImmer<Istate>({
    nodeitems: [],
    edgeitems: [],
    activeKey: '0',
    nodeEdge: 'Node',
    graphData: graphData || [],
  });
  const { activeKey, nodeEdge, nodeitems, edgeitems } = state;
  React.useEffect(()=>{
    const data = cloneDeep(getLocalData('nodeList'))
    let arr = []
    Object.entries(data).map((key)=>{
      arr.push(
        {
          label: key[1].label,
          children: (
            <CreateSchema
              nodeEdge={nodeEdge}
              isEdit={params == 'detail'}
              newActiveKey={key[0]}
              deleteNode={deleteNode}
              data = {key[1]}
            />
          ),
          key: key[0],
        }
      )
    })
    console.log(arr);
    
    updateState(draft=>{
      draft.nodeitems = arr
    })
  },[])
  const add = () => {
    if (nodeEdge == 'Node') {
      const newActiveKey = uuidv4();
      updateState(draft => {
        draft.nodeitems = [
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
        draft.activeKey = newActiveKey;
      });
    } else {
      const newActiveKey = uuidv4();
      updateState(draft => {
        draft.edgeitems = [
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
        draft.activeKey = newActiveKey;
      });
    }
  };
  // del node or edge
  const deleteNode = (val: string, key: string) => {
    let data = val == 'Node' ? nodeitems : edgeitems;
    const newPanes = data.filter(pane => pane.key !== key);
    if (val == 'Node') {
      const data = cloneDeep(getLocalData('nodeList'))
      Object.entries(data).map((keys,i)=>{
        if(keys[0] == key){
          delete data[key]
        }
      })
      setLocalData('nodeList',data)
      updateState(draft => {
        draft.nodeitems = newPanes;
      });
    } else {
      const data = cloneDeep(getLocalData('edgeList'))
      Object.entries(data).map((keys,i)=>{
        if(keys[0] == key){
          delete data[key]
        }
      })
      setLocalData('nodeList',data)
      updateState(draft => {
        draft.edgeitems = newPanes;
      });
    }
  };
  const onChange = (key: string) => {
    updateState(draft => {
      draft.activeKey = key;
    });
  };
  const nodeEdgeChange = (e: { target: { value: string } }): void => {
    updateState(draft => {
      draft.nodeEdge = e.target.value;
    });
  };
  return (
    <>
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
                  defaultActiveKey={'node0'}
                  tabBarStyle={{ borderLeft: 0 }}
                  tabPosition="left"
                  items={nodeitems}
                  // activeKey={activeKey}
                  // onChange={onChange}
                />
              </div>
              <div style={{ display: nodeEdge !== 'Node' ? '' : 'none' }}>
                <Tabs
                  defaultActiveKey={'edge0'}
                  tabBarStyle={{ borderLeft: 0 }}
                  tabPosition="left"
                  items={edgeitems}
                  // activeKey={activeKey}
                  // onChange={onChange}
                />
              </div>
            </div>
            {/* <Tabs
              defaultActiveKey={nodeEdge == 'Node' ? 'node0' : 'edge0'}
              tabBarStyle={{ borderLeft: 0 }}
              tabPosition="left"
              items={nodeEdge == 'Node' ? nodeitems : edgeitems}
              activeKey={activeKey}
              onChange={onChange}
            /> */}
          </div>
        </Col>
        <Col span={10}>
          <GraphIn isAlert={params == 'detail'} />
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
              history.push('/instance/create/result');
            }}
          >
            下一页
          </Button>
        </Space>
      )}
    </>
  );
};
export default CreateInstance;
