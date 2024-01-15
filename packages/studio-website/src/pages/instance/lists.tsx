import React, { useState } from 'react';
import { Flex, Card, Button, Row, Col, Tag, Modal, Form, Input, message } from 'antd';
import { history } from 'umi';
import copy from 'copy-to-clipboard';
import InstanceCard from '../../components/InstanceCard';
import {
  createFromIconfontCN,
  DeploymentUnitOutlined,
  SearchOutlined,
  MoreOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { useContext } from '@/pages/instance/create-instance/useContext';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_8fiw2wn073a.js',
});
const Lists: React.FC = () => {
  const [form] = Form.useForm();
  const { updateStore } = useContext();
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const bindEndpoint = () => {
    form.validateFields().then(res => {
      console.log(res);
    });
  };
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>GraphScope Instance</h3>
        <Flex wrap="wrap" gap="small">
          <Button
            type="primary"
            onClick={() => {
              history.push('/instance/create');
              updateStore(draft => {
                draft.detail = false;
              });
            }}
          >
            创建图实例
          </Button>
          <Button onClick={() => setisModalOpen(true)}>绑定</Button>
        </Flex>
      </div>
      {<InstanceCard instanceData={{}} />}
      <Modal title="绑定实例" open={isModalOpen} onOk={bindEndpoint} onCancel={() => setisModalOpen(false)}>
        <div style={{ padding: '16px', backgroundColor: '#F5F5F5', border: '1px dashed #ccc' }}>
          <Form name="modal-basic" labelCol={{ span: 12 }} form={form}>
            <Form.Item<{ endpoint: string }>
              label="Endpoint URL"
              name="endpoint"
              tooltip="Endpoint URL"
              rules={[{ required: true, message: '' }]}
              style={{ marginBottom: '0px' }}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Lists;
