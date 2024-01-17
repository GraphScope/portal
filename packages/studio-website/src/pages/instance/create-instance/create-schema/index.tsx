import React, { useEffect } from 'react';
import { Card, Tabs, Row, Col, Tooltip ,Button, Space, Upload } from 'antd';
import { cloneDeep } from 'lodash';
import { useContext, initialStore } from '../useContext';
import GraphInsight from './graph-view';
import Schema from './schema';
import AddLabel from './add-label';
import { download, prop } from './utils';

interface ICreateInstanceProps {
  graphData?: any;
  isAlert?: boolean;
}
const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = () => {
  const { store, updateStore } = useContext();
  const { nodeList, edgeList, currentType, nodeActiveKey, edgeActiveKey, nodeItems, edgeItems ,isAlert} = store;
  useEffect(() => {
    nodeChangeEdge(nodeList[0]?.key);
    /** 首次创建初始化变量 */
    updateStore(draft => {
      Object.keys(initialStore).forEach(key => {
        draft[key] = initialStore[key];
      });
    });
  }, []);
  useEffect(() => {
    const data: { [x: string]: { label: string } } = cloneDeep(nodeItems);
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
        children: <Schema newActiveKey={key[0]} deleteNode={deleteNode} data={key[1]} />,
        key: key[0],
      });
      nodearr.push({
        value: key[1].label,
        label: key[1].label,
      });
    });
    updateStore(draft => {
      draft.option = nodearr;
      draft.nodeList = arr;
    });
  }, [nodeItems]);
  useEffect(() => {
    const data: { [x: string]: { label: string } } = cloneDeep(edgeItems);
    let arr: { label: any; children: JSX.Element; key: string }[] = [];
    Object.entries(data).map(key => {
      arr.push({
        label: (
          <div style={{ width: '60px', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" title={key[1].label || 'undefine'}>
              {key[1].label || 'undefine'}
            </Tooltip>
          </div>
        ),
        children: <Schema newActiveKey={key[0]} deleteNode={deleteNode} data={key[1]} />,
        key: key[0],
      });
    });
    const nodedata: { [x: string]: { label: string } } = cloneDeep(nodeItems);
    let nodearr: { value: any; label: any }[] = [];
    Object.entries(nodedata).map(key => {
      nodearr.push({
        value: key[1].label,
        label: key[1].label,
      });
    });
    updateStore(draft => {
      draft.edgeList = arr;
      draft.option = nodearr;
    });
  }, [edgeItems]);
 /** del node or edge*/
  const deleteNode = (val: string, key: string) => {
    let data = val == 'node' ? cloneDeep(nodeList) : cloneDeep(edgeList);
    const newPanes = data.filter(pane => pane.key !== key);
    if (val == 'node') {
      const nodedata: { [x: string]: { label: string } } = cloneDeep(nodeItems);
      Object.entries(nodedata).map((keys, i) => {
        if (keys[0] == key) {
          delete nodedata[key];
        }
      });
      const activeKey = Object.keys(nodedata)[Object.keys(nodedata).length - 1];
      updateStore(draft => {
        draft.nodeList = newPanes;
        draft.nodeItems = nodedata;
        draft.nodeActiveKey = activeKey;
      });
    } else {
      const edgedata: { [x: string]: { label: string } } = cloneDeep(edgeItems);
      Object.entries(edgedata).map((keys, i) => {
        if (keys[0] == key) {
          delete edgedata[key];
        }
      });
      const activeKey = Object.keys(edgedata)[Object.keys(edgedata).length - 1];
      updateStore(draft => {
        draft.edgeList = newPanes;
        draft.edgeItems = edgedata;
        draft.edgeActiveKey = activeKey;
      });
    }
  };
  /** 点/边 切换 */
  const nodeChangeEdge = (key: string) => {
    if (currentType == 'node') {
      updateStore(draft => {
        draft.nodeActiveKey = key;
      });
    } else {
      updateStore(draft => {
        draft.edgeActiveKey = key;
      });
    }
  };
  /** 图头部组件 */
  const GraphViewTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <h3>Graph Schema View</h3>
      {!isAlert ? (
        <Space>
          <Upload {...prop} showUploadList={false}>
            <Button type="dashed">Import</Button>
          </Upload>
          <Button type="dashed" onClick={() => download(`xxx.json`, '')}>
            Export
          </Button>
        </Space>
      ) : null}
    </div>
  );
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
            <AddLabel />
            <div>
              <div style={{ display: currentType == 'node' ? '' : 'none' }}>
                <Tabs
                  tabBarStyle={{ borderLeft: 0 }}
                  tabPosition="left"
                  items={[...cloneDeep(nodeList)]}
                  activeKey={nodeActiveKey}
                  onChange={nodeChangeEdge}
                />
              </div>
              <div style={{ display: currentType !== 'node' ? '' : 'none' }}>
                <Tabs
                  tabBarStyle={{ borderLeft: 0 }}
                  tabPosition="left"
                  items={[...cloneDeep(edgeList)]}
                  activeKey={edgeActiveKey}
                  onChange={nodeChangeEdge}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col span={10}>
          <GraphInsight children={GraphViewTitle} />
        </Col>
      </Row>
    </Card>
  );
};
export default CreateInstance;
