import React, { memo, useEffect } from 'react';
import { Form, Input, Typography } from 'antd';

import { FormattedMessage } from 'react-intl';
import SelectCards from '@/components/select-cards';
import { useContext } from './useContext';

export type FieldType = {
  graphName?: string;
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
      <>
        <FormattedMessage
          id="Interactive engine is designed to handle concurrent graph queries at an impressive speed. Its primary goal is to
        process as many queries as possible within a given timeframe, emphasizing a high query throughput rate."
        />
        <br />
        <Typography.Link href="https://graphscope.io/docs/interactive_engine/graphscope_interactive" target="_blank">
          <FormattedMessage id="More details" />
        </Typography.Link>
      </>
    ),
  },
];

const ChooseEnginetype: React.FunctionComponent<ChooseEnginetypeProps> = props => {
  const { form } = props;
  const { store, updateStore } = useContext();
  const { engineType, graphName, storeType } = store;
  const chooseStoreType = (item: any) => {
    updateStore(draft => {
      draft.storeType = item.id;
    });
  };

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
  useEffect(() => {
    form.setFieldsValue({ graphName: graphName });
  }, []);

  return (
    <Form name="basic" form={form} layout="vertical" style={{ marginTop: '24px' }}>
      <Form.Item<FieldType>
        label={<FormattedMessage id="Graph instance name" />}
        name="graphName"
        wrapperCol={{ span: 8 }}
        rules={[{ required: true, message: '' }, validatePasswords]}
      >
        <Input
          placeholder="please name your graph instance"
          onChange={e =>
            updateStore(draft => {
              draft.graphName = String(e.target.value || 'unkown');
            })
          }
        />
      </Form.Item>

      <Form.Item<FieldType>
        label={<FormattedMessage id="Graph store type" />}
        name="type"
        tooltip=""
        rules={[{ required: true, message: '' }]}
      >
        <SelectCards val={storeType} items={engines} onChange={chooseStoreType} />
      </Form.Item>
    </Form>
  );
};

export default memo(ChooseEnginetype);
