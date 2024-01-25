import React, { useState, useEffect, memo } from 'react';
import { Form, Input, Row, Col, Avatar, Card, Select, theme } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import SelectCards from '@/components/select-cards';
import { useContext } from './useContext';
const { useToken } = theme;
export type FieldType = {
  inputname?: string;
  type?: string;
  directed: boolean;
};

type ChooseEnginetypeProps = {
  form: any;
};

const engines = [
  { id: 'interactive', title: 'Interactive', desc: ' Interactive 引擎介绍' },
  { id: 'insights', title: 'Insights', desc: 'Insights 引擎介绍' },
  { id: 'v6d', title: 'Vineyard', desc: 'Vineyard 引擎介绍' },
];

const ChooseEnginetype: React.FunctionComponent<ChooseEnginetypeProps> = props => {
  const { form } = props;
  const { store, updateStore } = useContext();
  const { engineType } = store;
  const changeEngineType = (item: any) => {
    updateStore(draft => {
      draft.engineType = item.id;
    });
  };

  return (
    <Form name="basic" form={form} layout="vertical" style={{ marginTop: '24px' }}>
      <Form.Item<FieldType>
        label={<FormattedMessage id="Input Name" />}
        name="inputname"
        tooltip=" "
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        rules={[{ required: true, message: '' }]}
      >
        <Input placeholder="Please Enter Input Name." />
      </Form.Item>

      <Form.Item<FieldType>
        label={<FormattedMessage id="Choose Engine Type" />}
        name="type"
        tooltip=" "
        rules={[{ required: true, message: '' }]}
      >
        <SelectCards items={engines} value={engineType} onChange={changeEngineType} />
      </Form.Item>
      <Form.Item<FieldType>
        label={<FormattedMessage id="Directed" />}
        name="directed"
        tooltip=" "
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        rules={[{ required: true, message: '' }]}
      >
        <Select
          options={[
            { value: true, label: 'true' },
            { value: false, label: 'false' },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

export default memo(ChooseEnginetype);
