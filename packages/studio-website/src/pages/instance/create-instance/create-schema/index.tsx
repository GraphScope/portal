import React from 'react';
import { Card, Tabs, Row, Col, Tooltip, Button, Space, Upload, Segmented } from 'antd';
import { useContext } from '../useContext';
import GraphInsight from './graph-view';
import Schema from './schema';
import AddLabel from './add-label';
import { download, prop } from './utils';
import { FormattedMessage } from 'react-intl';
import { SegmentedValue } from 'antd/es/segmented';
import EmptyInfo from './empty-info';
interface ICreateInstanceProps {
  graphData?: any;
  isAlert?: boolean;
}
const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = () => {
  const { store, updateStore } = useContext();
  const { nodeList, edgeList, currentType, nodeActiveKey, edgeActiveKey, isAlert } = store;

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
            <Tooltip title="导入提示，待确认">
              <Button>
                <FormattedMessage id="Import" />
              </Button>
            </Tooltip>
          </Upload>
          <Tooltip title="导出提示，待确认">
            <Button onClick={() => download(`xxx.json`, '')}>
              <FormattedMessage id="Export" />
            </Button>
          </Tooltip>
        </Space>
      ) : null}
    </div>
  );

  const nodeEdgeChange = (val: SegmentedValue) => {
    updateStore(draft => {
      draft.currentType = val as 'node' | 'edge';
    });
    if (currentType == 'edge') {
      updateStore(draft => {
        draft.edgeActiveKey = edgeList[0]?.key;
      });
    }
  };

  let nodeOptions: { label: string; value: string }[] = [];

  const nodeItems = nodeList.map(item => {
    const { key, label } = item;
    const invalid = label === 'undefined' || label === '';
    if (!invalid) {
      nodeOptions.push({
        label,
        value: key,
      });
    }
    return {
      key: key,
      label: label,
      children: (
        <Schema
          updateStore={updateStore}
          currentType={currentType}
          id={key}
          newActiveKey={key}
          shouldRender={nodeActiveKey === item.key}
        />
      ),
    };
  });

  const edgeItems = edgeList.map(item => {
    const { key, label } = item;
    return {
      key: key,
      label: label,
      children: (
        <Schema
          nodeOptions={nodeOptions}
          updateStore={updateStore}
          currentType={currentType}
          id={key}
          newActiveKey={key}
          shouldRender={nodeActiveKey === key}
        />
      ),
    };
  });
  const IS_NODES_EMPTY = nodeList.length === 0;
  const IS_EDGES_EMPTY = edgeList.length === 0;
  const extra = (currentType == 'node' ? nodeList.length : edgeList.length) > 0 ? <AddLabel /> : null;

  return (
    <Row style={{ marginTop: '16px' }}>
      <Col span={16}>
        <div
          style={{
            backgroundColor: '#fff',
            marginRight: '12px',
            overflow: 'hidden',
          }}
        >
          <Card
            bodyStyle={{ height: '500px', padding: '0px' }}
            title={
              <Segmented
                value={currentType}
                options={[
                  { label: <FormattedMessage id="Node labels" />, value: 'node' },
                  { label: <FormattedMessage id="Edge Labels" />, value: 'edge' },
                ]}
                onChange={(value: SegmentedValue) => nodeEdgeChange(value)}
              />
            }
            extra={extra}
          >
            <div style={{ display: currentType === 'node' ? '' : 'none' }}>
              {IS_NODES_EMPTY ? (
                <EmptyInfo />
              ) : (
                <Tabs
                  style={{ height: '500px', marginBottom: '12px' }}
                  tabBarStyle={{ borderLeft: 0, width: '80px' }}
                  tabPosition="left"
                  items={nodeItems}
                  activeKey={nodeActiveKey}
                  onChange={tabsChange}
                />
              )}
            </div>
            <div style={{ display: currentType === 'edge' ? '' : 'none' }}>
              {IS_EDGES_EMPTY ? (
                <EmptyInfo />
              ) : (
                <Tabs
                  style={{ height: '500px', marginBottom: '12px' }}
                  tabBarStyle={{ borderLeft: 0, width: '80px' }}
                  tabPosition="left"
                  items={edgeItems}
                  activeKey={edgeActiveKey}
                  onChange={tabsChange}
                />
              )}
            </div>
          </Card>
        </div>
      </Col>
      <Col span={8}>
        <Card
          bodyStyle={{ padding: '0px', height: '500px', marginBottom: '18px', overflow: 'hidden' }}
          title={<FormattedMessage id="Graph Model" />}
          extra={GraphViewTitle}
        >
          <GraphInsight />
        </Card>
      </Col>
    </Row>
  );
};
export default CreateInstance;
