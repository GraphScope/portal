import React, { memo, useState } from 'react';

import Section from '../../../components/section';

import { useContext } from '../../../layouts/useContext';
import ChooseEnginetype from './choose-enginetype';
import { Form, Button, Result, Modal, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
import { SplitSection } from '@graphscope/studio-components';

import { useHistory } from '../../../hooks';
import { PlusOutlined } from '@ant-design/icons';
const { GS_ENGINE_TYPE } = window;
const Create: React.FC = () => {
  const history = useHistory();
  const { store, updateStore } = useContext();
  const [open, setOpen] = useState(false);

  const { draftId } = store;
  const [form] = Form.useForm();
  const handleCreate = async () => {
    const { graphName, storeType } = form.getFieldsValue();
    form.validateFields().then(() => {
      const draftGraph = {
        id: draftId,
        name: graphName,
        status: 'Draft',
        schema: {
          //@ts-ignore
          vertex_types: [],
          //@ts-ignore
          edge_types: [],
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

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleClick}>
        <FormattedMessage id="Create instance" />
      </Button>
      <Modal
        width={600}
        title={<FormattedMessage id="Create instance" />}
        open={open}
        onClose={handleClose}
        onCancel={handleClose}
        footer={[
          <Button key="back" onClick={handleClose}>
            <FormattedMessage id="Cancel" />
          </Button>,
          <Button type="primary" onClick={handleCreate} style={{ minWidth: '100px' }}>
            <FormattedMessage id="Create Graph" />
          </Button>,
        ]}
      >
        <ChooseEnginetype form={form} />
      </Modal>
    </>
  );
};

export default memo(Create);
