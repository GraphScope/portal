import React, { memo } from 'react';

import Section from '@/components/section';

import { useContext } from '@/layouts/useContext';
import ChooseEnginetype from './choose-enginetype';
import { Form, Button, Result } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
import { SplitSection } from '@graphscope/studio-components';

import { history } from 'umi';
const { GS_ENGINE_TYPE } = window;
const Create: React.FC = () => {
  const { store, updateStore } = useContext();
  const { draftId } = store;
  const [form] = Form.useForm();
  const handleCreate = async () => {
    console.log('form', form.getFieldsValue());
    const { graphName, storeType } = form.getFieldsValue();
    form.validateFields().then(() => {
      const draftGraph = {
        id: draftId,
        name: graphName,
        status: 'Draft',
        schema: {
          //@ts-ignore
          vertices: [],
          //@ts-ignore
          edges: [],
        },
        storeType,
      };
      updateStore(draft => {
        draft.graphId = draftId;
        draft.draftGraph = draftGraph;
        draft.currentnNav = '/modeling';
      });
      history.push(`/modeling?graph_id=${draftId}`);
      Utils.storage.set('DRAFT_GRAPH', draftGraph);
    });
  };

  return (
    <Section
      breadcrumb={[
        {
          title: 'navbar.graphs',
        },
        {
          title: 'Creating instance',
        },
      ]}
      desc="Choose the appropriate GraphScope computing engine and start creating graph instances"
    >
      <SplitSection
        leftSide={<ChooseEnginetype form={form} />}
        rightSide={<Result status="404" subTitle={<FormattedMessage id="Introduction video to GraphScope" />} />}
        splitText=""
      />

      <Button type="primary" onClick={handleCreate} style={{ minWidth: '100px' }}>
        <FormattedMessage id="Create Graph" />
      </Button>
    </Section>
  );
};

export default memo(Create);
