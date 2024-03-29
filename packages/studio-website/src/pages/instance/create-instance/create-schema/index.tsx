import React, { useEffect } from 'react';
import { Card, Tabs, Row, Col, Segmented } from 'antd';
import { useContext } from '../useContext';
import GraphInsight from './graph-view';
import Schema from './schema';
import AddLabel from './add-label';
import { FormattedMessage } from 'react-intl';
import { SegmentedValue } from 'antd/es/segmented';
import EmptyInfo from './empty-info';
import ExportConfig from './import-schema-config';
interface ICreateInstanceProps {
  graphData?: any;
  isAlert?: boolean;
}
const engineType = window.GS_ENGINE_TYPE;
const CreateInstance: React.FunctionComponent<ICreateInstanceProps> = props => {
  const { store, updateStore } = useContext();
  const { nodeList, edgeList, currentType, nodeActiveKey, edgeActiveKey, mode, graphName } = store;
  /** 初始化清空数据 */
  useEffect(() => {
    updateStore(draft => {
      draft.nodeList = [];
      draft.edgeList = [];
      draft.nodeActiveKey = '';
      draft.edgeActiveKey = '';
    });
  }, []);
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

  const nodeItems = nodeList?.map(item => {
    const { key, label } = item;
    const invalid = label === '';
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
          data={item}
          updateStore={updateStore}
          currentType="node"
          id={key}
          newActiveKey={key}
          shouldRender={nodeActiveKey === item.key}
          mode={mode}
          engineType={engineType}
          graphName={graphName}
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
          currentType="edge"
          id={key}
          data={item}
          newActiveKey={key}
          shouldRender={nodeActiveKey === key}
          mode={mode}
          engineType={engineType}
          graphName={graphName}
          nodeList={nodeList}
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
            marginRight: '12px',
            overflow: 'hidden',
          }}
        >
          <Card
            bodyStyle={{ minHeight: '550px', height: 'cacl(100vh - 150px)', padding: '0px' }}
            title={
              <Segmented
                value={currentType}
                options={[
                  { label: <FormattedMessage id="Vertex labels" />, value: 'node' },
                  { label: <FormattedMessage id="Edge labels" />, value: 'edge' },
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
                  style={{ minHeight: '550px', height: 'cacl(100vh - 150px)', padding: '12px' }}
                  tabBarStyle={{ borderLeft: 0, width: '120px' }}
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
                  style={{ minHeight: '550px', height: 'cacl(100vh - 150px)', padding: '12px' }}
                  tabBarStyle={{ borderLeft: 0, width: '120px' }}
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
          bodyStyle={{
            padding: '1px',
            minHeight: '550px',
            height: 'cacl(100vh - 150px)',
            overflow: 'hidden',
          }}
          title={<FormattedMessage id="Graph Model" />}
          extra={<ExportConfig />}
        >
          <GraphInsight />
        </Card>
      </Col>
    </Row>
  );
};
export default CreateInstance;
