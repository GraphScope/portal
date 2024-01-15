import React, { useEffect, useState } from 'react';
import { Flex, Row, Col, Button, Modal, Form, Input } from 'antd';
import { history } from 'umi';
import InstaceItem from '../../components/instance-card';
import { createFromIconfontCN } from '@ant-design/icons';
import { useContext } from '@/pages/instance/create-instance/useContext';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_8fiw2wn073a.js',
});
const arr = [
  {
    user: '山果 / 东泽',
    version: '0.24.0',
    createtime: '2024-01-10',
    connecturl: 'xx.xxx.xxx.xxx:8787',
  },
  {
    user: '山果 / 东泽',
    version: '0.24.0',
    createtime: '2024-01-10',
    connecturl: 'xx.xxx.xxx.xxx:8787',
  },
  {
    user: '山果 / 东泽',
    version: '0.24.0',
    createtime: '2024-01-10',
    connecturl: 'xx.xxx.xxx.xxx:8787',
  },
];
export type InstaceList = {
  /** user 用户名 */
  user: string;
  /** version 版本号 */
  version: string;
  /** createtime 创建时间 */
  createtime: string;
  /** connecturl 实例链接 */
  connecturl: string;
};
const InstanceCard: React.FC = () => {
  const [form] = Form.useForm();
  const { updateStore } = useContext();
  const [state, updateState] = useState<{ isModalOpen?: boolean; instanceList?: InstaceList[] }>({
    isModalOpen: false,
    instanceList: [],
  });
  const { isModalOpen, instanceList } = state;
  const bindEndpoint = () => {
    form.validateFields().then(res => {
      console.log(res);
    });
  };
  useEffect(() => {
    getInstanceList();
  }, []);
  const getInstanceList = async () => {
    let data: any = [];
    data = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(arr);
      }, 500);
    });
    data && updateState({ instanceList: data });
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
          <Button onClick={() => updateState({ isModalOpen: true })}>绑定</Button>
        </Flex>
      </div>
      <Row>
        {instanceList &&
          instanceList.map((item, i) => (
            <Col span={12} key={i} style={{ marginTop: '6px' }}>
              <InstaceItem index={i} instanceLeftInfo={item} />
            </Col>
          ))}
      </Row>
      <Modal
        title="绑定实例"
        open={isModalOpen}
        onOk={bindEndpoint}
        onCancel={() => updateState({ isModalOpen: false })}
      >
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

export default InstanceCard;
