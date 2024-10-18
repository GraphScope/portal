import React, { memo, useEffect } from 'react';
import { Form, Input, Typography } from 'antd';

import { FormattedMessage, useIntl } from 'react-intl';
import SelectCards from '../../../components/select-cards';

export const storeType = window.GS_ENGINE_TYPE === 'groot' ? 'groot_store' : 'mutable_csr';
export type FieldType = {
  graphName?: string;
  storeType?: string;
  directed: boolean;
};

type ChooseEnginetypeProps = {
  form: any;
};

const gs_all_engines = [
  {
    id: 'mutable_csr',
    type: 'interactive',
    title: 'Interactive Engine',
    value: 'mutable_csr',
    desc: (
      <>
        <FormattedMessage id="graphs.engine.interactive.desc" />
        <br />
        <Typography.Link href="https://graphscope.io/docs/interactive_engine/graphscope_interactive" target="_blank">
          <FormattedMessage id="More details" />
        </Typography.Link>
      </>
    ),
  },
  {
    id: 'groot_store',
    type: 'groot',
    title: 'Groot Engine',
    value: 'mutable_csr',
    desc: (
      <>
        <FormattedMessage id="graphs.engine.interactive.desc" />
        <br />
        <Typography.Link href="https://graphscope.io/docs/interactive_engine/graphscope_interactive" target="_blank">
          <FormattedMessage id="More details" />
        </Typography.Link>
      </>
    ),
  },
  {
    id: 'gart_store',
    type: 'gart',
    title: 'Gart Engine',
    value: 'gart',
    desc: (
      <>
        <FormattedMessage id="graphs.engine.interactive.desc" />
        <br />
        <Typography.Link href="https://graphscope.io/docs/interactive_engine/graphscope_interactive" target="_blank">
          <FormattedMessage id="More details" />
        </Typography.Link>
      </>
    ),
  },
];

const engines = gs_all_engines.filter(item => {
  return item.type === window.GS_ENGINE_TYPE;
});

const ChooseEnginetype: React.FunctionComponent<ChooseEnginetypeProps> = props => {
  const { form } = props;

  const intl = useIntl();
  const chooseStoreType = (item: any) => {
    // updateStore(draft => {
    //   draft.storeType = item.id;
    // });
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
      return Promise.reject(
        intl.formatMessage({ id: 'Please input a valid string starting with an uppercase English letter.' }),
      );
    },
  });
  useEffect(() => {
    form.setFieldsValue({ graphName: '', storeType });
  }, []);
  console.log('storeType', storeType);

  return (
    <Form name="basic" form={form} layout="vertical" style={{ marginTop: '24px' }}>
      <Form.Item<FieldType>
        label={<FormattedMessage id="Graph instance name" />}
        name="graphName"
        rules={[{ required: true, message: '' }, validatePasswords]}
      >
        <Input placeholder={intl.formatMessage({ id: 'please name your graph instance.' })} />
      </Form.Item>

      <Form.Item<FieldType>
        label={<FormattedMessage id="Graph store type" />}
        name="storeType"
        tooltip=""
        rules={[{ required: true, message: '' }]}
      >
        {/**@ts-ignore */}
        <SelectCards val={storeType} items={engines} onChange={chooseStoreType} />
      </Form.Item>
    </Form>
  );
};

export default memo(ChooseEnginetype);
