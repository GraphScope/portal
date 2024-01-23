import React, { useEffect } from 'react';
import { Card, Tabs, Row, Col, Tooltip, Button, Space, Upload, Segmented } from 'antd';
import { cloneDeep } from 'lodash';
import { useContext, initialStore } from '../useContext';
import GraphInsight from './graph-view';
import Schema from './schema';
import AddLabel from './add-label';
import { download, prop } from './utils';
import { FormattedMessage } from 'react-intl';
interface ICreateInstanceProps {
  graphData?: any;
  isAlert?: boolean;
}
const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = () => {
  const { store, updateStore } = useContext();
  const { nodeList, edgeList, currentType, nodeActiveKey, edgeActiveKey, nodeItems, edgeItems, isAlert, detail } =
    store;
  useEffect(() => {
    tabsChange(nodeList[0]?.key);
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
  const tabsChange = (key: string) => {
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
      {!isAlert ? (
        <Space>
          <Upload {...prop} showUploadList={false}>
            <Button><FormattedMessage id='import'/></Button>
          </Upload>
          <Button onClick={() => download(`xxx.json`, '')}><FormattedMessage id='export'/></Button>
        </Space>
      ) : null}
    </div>
  );
  /** 切换 node/edge */
  const nodeEdgeChange:(val:string)=>void = (val) => {
    updateStore(draft => {
      draft.currentType = val == 'node' ? 'node' : 'edge';
    });
    if (currentType == 'edge') {
      updateStore(draft => {
        draft.edgeActiveKey = edgeList[0]?.key;
      });
    }
  };
  return (
    <Row style={{ marginTop: '16px' }}>
      <Col span={14}>
        <div
          style={{
            backgroundColor: '#fff',
            marginRight: '12px',
            overflow: 'hidden',
          }}
        >
          <Card
            bodyStyle={{ height: '65vh' }}
            title={<Segmented options={[{label:<FormattedMessage id='node-type'/>, value:'node'},{label:<FormattedMessage id='edge-type'/>,value:'edge'}]} onChange={e => nodeEdgeChange(e)} />}
            extra={<>{(currentType == 'node' ? nodeList.length : edgeList.length) >0 ? <AddLabel /> : null}</>}
          >
            <div>
              <div style={{ display: currentType == 'node' ? '' : 'none' }}>
                {nodeList.length == 0 ? (
                  <AddLabel />
                ) : (
                  <Tabs
                    tabBarStyle={{ borderLeft: 0 }}
                    tabPosition="left"
                    items={[...cloneDeep(nodeList)]}
                    activeKey={nodeActiveKey}
                    onChange={tabsChange}
                  />
                )}
              </div>
              <div style={{ display: currentType !== 'node' ? '' : 'none' }}>
                {edgeList.length == 0 ? (
                  <AddLabel />
                ) : (
                  <Tabs
                    tabBarStyle={{ borderLeft: 0 }}
                    tabPosition="left"
                    items={[...cloneDeep(edgeList)]}
                    activeKey={edgeActiveKey}
                    onChange={tabsChange}
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      </Col>
      <Col span={10}>
        <Card title={<FormattedMessage id='graph-model'/>} extra={GraphViewTitle}>
          <GraphInsight />
        </Card>
      </Col>
    </Row>
  );
};
export default CreateInstance;
