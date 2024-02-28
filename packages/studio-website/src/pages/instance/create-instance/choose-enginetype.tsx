import React, { memo } from 'react';
import { Form, Input, Select } from 'antd';

import { FormattedMessage } from 'react-intl';
import SelectCards from '@/components/select-cards';
import { useContext } from './useContext';

export type FieldType = {
  inputname?: string;
  type?: string;
  directed: boolean;
};

type ChooseEnginetypeProps = {
  form: any;
};

const engines = [
  {
    id: 'mutable_csr',
    title: 'Interactive',
    desc: (
      <FormattedMessage id="GraphScope Interactive is designed to process as many graph queries as possible within a given timeframe, emphasizing a high query throughput rate." />
    ),
  },
  // { id: 'insights', title: 'Insights', desc: 'Insights 引擎介绍', disabled: true },
  // { id: 'v6d', title: 'Vineyard', desc: 'Vineyard 引擎介绍', disabled: true },
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
  console.log('engineType', engineType, engines);
  /** 合法输入验证 */
  const validatePasswords = () => ({
    validator(rule: any, value: string) {
      /** 首字母英文 */
      const regl = /^[A-Za-z]+$/;
      /** 不包含非法字符 */
      const reg = /[@/'"#%&^*]+/g;
      if (!reg.test(value) && regl.test(value.charAt(0))) {
        return Promise.resolve();
      }
      return Promise.reject('请输入合法字符且首字母为英文.');
    },
  });

  return (
    <Form name="basic" form={form} layout="vertical" style={{ marginTop: '24px' }}>
      <Form.Item<FieldType>
        label={<FormattedMessage id="Input Name" />}
        name="inputname"
        tooltip=" "
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        rules={[{ required: true, message: '' }, validatePasswords]}
      >
        <Input
          placeholder="Please Enter Input Name."
          onChange={e =>
            updateStore(draft => {
              draft.engineInput = String(e.target.value || 'unkown');
            })
          }
        />
      </Form.Item>

      <Form.Item<FieldType>
        label={<FormattedMessage id="Choose Engine Type" />}
        name="type"
        tooltip=" "
        rules={[{ required: true, message: '' }]}
      >
        <SelectCards val={engineType} items={engines} onChange={changeEngineType} />
      </Form.Item>
      {/* <Form.Item<FieldType>
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
          onChange={checked =>
            updateStore(draft => {
              draft.engineDirected = checked;
            })
          }
        />
      </Form.Item> */}
    </Form>
  );
};

export default memo(ChooseEnginetype);
