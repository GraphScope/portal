import React, { useState } from 'react';
import { Button, Select, Form, Row, Col, Result, Flex, Typography, Card } from 'antd';
import { useContext as useImporting } from '@graphscope/studio-importor';
export type FieldType = {
  type?: string;
  delimiter?: string;
  import_option?: string;
  header_row: boolean;
};

interface IModalType {
  isImportFinish: boolean;
  handleFinish: (values: FieldType) => void;
  handleColse: () => void;
}
const { Text } = Typography;
const ModalType: React.FC<IModalType> = props => {
  const { isImportFinish, handleFinish, handleColse } = props;
  const [form] = Form.useForm();
  const { store: importingStore } = useImporting();
  const { nodes, edges } = importingStore;
  const [state, updateState] = useState({
    finish: false,
  });
  const { finish } = state;
  const handleClick = () => {
    updateState(preset => {
      return {
        ...preset,
        finish: true,
      };
    });
    const data = form.getFieldsValue();
    handleFinish(data);
  };
  const nodes_bind = nodes.length;
  const edges_bind = nodes.length;
  return (
    <Row justify={'space-between'} gutter={[16, 0]}>
      <Col span={12}>
        <Card style={{ height: '500px' }}>
          <Form name="modal_type" layout="vertical" labelCol={{ span: 8 }} form={form}>
            <Form.Item<FieldType> label="Type" name="type">
              <Select
                allowClear
                options={[
                  { label: 'csv', value: 'csv' },
                  { label: 'odps', value: 'odps' },
                ]}
              />
            </Form.Item>
            <Form.Item<FieldType> label="Delimiter" name="delimiter">
              <Select
                allowClear
                options={[
                  { label: '|', value: '|' },
                  { label: ',', value: ',' },
                  { label: ';', value: ';' },
                  { label: <>\t</>, value: '\t' },
                  { label: ' ', value: ' ' },
                  { label: ':', value: ':' },
                ]}
              />
            </Form.Item>
            <Form.Item<FieldType> label="Header Row" name="header_row">
              <Select
                allowClear
                options={[
                  { label: 'true', value: true },
                  { label: 'false', value: false },
                ]}
              />
            </Form.Item>
            <Form.Item<FieldType> label="Import Option" name="import_option">
              <Select
                allowClear
                options={[
                  { label: 'overwrite', value: 'overwrite' },
                  { label: 'init', value: 'init' },
                ]}
              />
            </Form.Item>
          </Form>

          <>
            {finish ? (
              <Flex vertical align="end" gap={12}>
                <Button
                  style={{ width: '240px' }}
                  type="primary"
                  onClick={() => {
                    handleFinish;
                  }}
                >
                  Goto Jobs
                </Button>
                <Button style={{ width: '240px' }} onClick={handleColse}>
                  Close
                </Button>
              </Flex>
            ) : (
              <Flex vertical align="end">
                <Button style={{ width: '240px' }} type="primary" onClick={handleClick}>
                  Load data
                </Button>
              </Flex>
            )}
          </>
        </Card>
      </Col>
      <Col span={12}>
        <Card style={{ height: '500px' }}>
          {finish ? (
            <>
              {isImportFinish ? (
                <Result status="403" subTitle="Sorry, you are not authorized to access this page." />
              ) : (
                <Text>导入数据需要一点时间，请耐心等待，您可以前往任务中心查看进展</Text>
              )}
            </>
          ) : (
            <Text>
              您此时需要导入 {nodes_bind} 份点文件，{edges_bind} 份边文件，共计 {nodes_bind + edges_bind}{' '}
              份文件，一共300MB
            </Text>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default ModalType;
