import React, { memo, useEffect } from 'react';
import { Form, Input, Typography } from 'antd';

import { FormattedMessage, useIntl } from 'react-intl';
import SelectCards from '@/components/select-cards';
import { useContext } from './useContext';
import { useContext as useContextMap } from '@/layouts/useContext';

export type FieldType = {
  graphName?: string;
  type?: string;
  directed: boolean;
};

type ChooseEnginetypeProps = {
  form: any;
};

const gs_all_engines = [
  {
    id: 'mutable_csr',
    title: 'Interactive Engine',
    value: 'interactive',
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
    title: 'Groot Engine',
    value: 'groot',
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
  return item.value === window.GS_ENGINE_TYPE;
});

const ChooseEnginetype: React.FunctionComponent<ChooseEnginetypeProps> = props => {
  const { form } = props;
  const { store, updateStore } = useContext();
  const { graphName, storeType, mode } = store;
  const {
    store: { locale },
  } = useContextMap();
  const intl = useIntl();
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
    form.setFieldsValue({ graphName, storeType });
  }, [graphName, storeType]);

  console.log(graphName, storeType);

  return (
    <Form name="basic" form={form} layout="vertical" style={{ marginTop: '24px' }}>
      <Form.Item<FieldType>
        label={<FormattedMessage id="Graph instance name" />}
        name="graphName"
        wrapperCol={{ span: 8 }}
        rules={[{ required: true, message: '' }, validatePasswords]}
      >
        <Input
          defaultValue={graphName}
          placeholder={intl.formatMessage({ id: 'please name your graph instance.' })}
          disabled={mode === 'view'}
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
