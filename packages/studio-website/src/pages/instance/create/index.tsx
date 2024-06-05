import React, { memo } from 'react';

import Section from '@/components/section';

import { useContext } from '@/layouts/useContext';
import ChooseEnginetype from '../create-instance/choose-enginetype';
import { Form, Row, Col, Divider, Flex, Space, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { createGraph } from '../create-instance/service';

const { GS_ENGINE_TYPE } = window;
const Create: React.FC = () => {
  const { store } = useContext();
  const { mode } = store;
  const [form] = Form.useForm();
  const handleCreate = async () => {
    console.log('form', form.getFieldsValue());
    const { graphName, storeType } = form.getFieldsValue();
    const a = await createGraph('', graphName, storeType, [], []);
    console.log('a', a);
  };

  return (
    <Section
      breadcrumb={[
        {
          title: 'Graphs',
        },
        {
          title: 'Creating instance',
        },
      ]}
      title="navbar.graphs"
      desc="Choose the appropriate GraphScope computing engine and start creating graph instances"
    >
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <ChooseEnginetype form={form} />
        </Col>
        <Col span={12}>
          <Divider type="vertical" style={{ height: '100%' }}></Divider>
          video
        </Col>
      </Row>
      <Button type="primary" onClick={handleCreate} style={{ minWidth: '100px' }}>
        <FormattedMessage id="Create Graph" />
      </Button>
    </Section>
  );
};

export default memo(Create);
