import * as React from 'react';
import { Radio, Table, Row, Col, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useContext } from './useContext';
import ReactJson from 'react-json-view';
interface IImportDataProps {}
interface DataType {
  key: string;
  label_type: string;
  label_name?: number;
  source_label?: string;
  target_label?: string;
  property_name: string;
  property_type: string;
  primary_keys: string;
}
const ConfigInfo: React.FunctionComponent<IImportDataProps> = props => {
  const { store, updateStore } = useContext();
  const { checked } = store;
  const nodeEdgeChange = (e: { target: { value: string } }) => {
    updateStore(draft => {
      draft.checked = e.target.value;
    });
  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'label_type',
      dataIndex: 'label_type',
      key: 'label_type',
      render: text => <a>{text}</a>,
    },
    {
      title: 'label_name',
      dataIndex: 'label_name',
      key: 'label_name',
    },
    {
      title: 'source_label',
      dataIndex: 'source_label',
      key: 'source_label',
    },
    {
      title: 'target_label',
      dataIndex: 'target_label',
      key: 'target_label',
    },
    {
      title: 'property_name',
      dataIndex: 'property_name',
      key: 'property_name',
    },
    {
      title: 'property_type',
      dataIndex: 'property_type',
      key: 'property_type',
    },
    {
      title: 'primary_keys',
      dataIndex: 'primary_keys',
      key: 'primary_keys',
    },
  ];
  return (
    <div style={{ backgroundColor: '#fff', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p>
          恭喜你已经完成图实例的创建，图实例名称为 <Tag color="green">DEFAULT GRAPH</Tag>，类型为{' '}
          <Tag color="green">Interactive</Tag>, 有2 种类型的点，1 种类型的边
        </p>
        <Radio.Group defaultValue="Nodes" onChange={nodeEdgeChange}>
          <Radio.Button value="table">Table</Radio.Button>
          <Radio.Button value="json">Json</Radio.Button>
          <Radio.Button value="graph">Graph</Radio.Button>
        </Radio.Group>
      </div>
      <div style={{ padding: '16px', border: '1px dashed #000' }}>
        {checked == 'table' ? (
          <>
            <Table columns={columns?.filter(item => !['source_label','target_label'].includes(item?.title))} dataSource={[]} />
            <Table columns={columns?.filter(item =>item?.title !== 'label_name' )} dataSource={[]} />
          </>
        ) : (
          <Row>
            <Col span={24}>
              <ReactJson src={{}} />
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default ConfigInfo;
