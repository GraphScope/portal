import React from 'react';
import { Form, Row, Col, DatePicker, Space, Button } from 'antd';
const SearchForm = () => {
  const [form] = Form.useForm();
  return (
    <Form name="basic" wrapperCol={{ span: 24 }} labelCol={{ flex: '100px' }} labelAlign="right" form={form}>
      <Row>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingRight: '24px' }}>
          <Col span={8}>
            <Form.Item label="Start time" name="start_date">
              <DatePicker placeholder="" style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="End time" name="end_date">
              <DatePicker placeholder="" style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col>
            <Space>
              <Button>Reset</Button>
              <Button type="primary">Search</Button>
            </Space>
          </Col>
        </div>
      </Row>
    </Form>
  );
};

export default SearchForm;
