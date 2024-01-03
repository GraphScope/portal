import * as React from 'react';
import { Button, Form, Radio, Tabs, Steps, Alert, Row, Col ,Space} from 'antd';
import { useImmer } from 'use-immer';
import { useLocation, history } from 'umi';
import { useSnapshot } from 'valtio';
import { creategraphdata } from '@/valtio/createGraph';
import GraphIn from './graph-in';
import CreateSchema from './create-schema';

interface ICreateInstanceProps {
  graphData?: any;
  isAlert?: boolean;
}
const { useRef } = React;
const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = props => {
  const { graphData } = props;
  const { isAlert } = useSnapshot(creategraphdata);
  const params = useLocation().state;
  const [form] = Form.useForm();
  const newTabIndex = useRef(0);
  const [state, updateState] = useImmer({
    nodeitems: [],
    edgeitems: [],
    activeKey: '0',
    nodeEdge: 'Node',
    graphData: graphData || [],
  });
  const { activeKey, nodeEdge, nodeitems, edgeitems } = state;
  const add = async () => {
    if (nodeEdge == 'Node') {
      const newActiveKey = `node${newTabIndex.current++}`;
      updateState(draft => {
        draft.nodeitems = [
          ...nodeitems,
          {
            label: 'undefine',
            children: <CreateSchema nodeEdge={nodeEdge} isEdit={params == 'detail'} />,
            key: newActiveKey,
          },
        ];
        draft.activeKey = newActiveKey;
      });
    } else {
      const newActiveKey = `edge${newTabIndex.current++}`;
      updateState(draft => {
        draft.edgeitems = [
          ...edgeitems,
          {
            label: 'undefine',
            children: <CreateSchema nodeEdge={nodeEdge} isEdit={params == 'detail'} />,
            key: newActiveKey,
          },
        ];
        draft.activeKey = newActiveKey;
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
            <Tabs
              defaultActiveKey="newTab0"
              tabBarStyle={{ borderLeft: 0 }}
              tabPosition="left"
              items={nodeEdge == 'Node' ? nodeitems : edgeitems}
              activeKey={activeKey}
              onChange={onChange}
              onTabClick={(key,event)=>{console.log(111111,key,event);
              }}
            />
          </div>
        </Col>
        <Col span={10}>
          <GraphIn isAlert={params == 'detail'} />
        </Col>
      </Row>
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
    </>
  );
};
export default CreateInstance;
