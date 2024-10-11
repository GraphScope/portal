import React, { useEffect, useState } from 'react';
import { Button, Select, Form, Flex, Typography, notification, DatePicker } from 'antd';
import type { DataloadingJobConfigLoadingConfigImportOptionEnum } from '@graphscope/studio-server';
import { FormattedMessage, useIntl } from 'react-intl';
import { useContext as useImporting } from '@graphscope/studio-importor';
import { submitDataloadingJob } from './services';
import { useHistory } from '@/hooks';
import dayjs from 'dayjs';
export type FieldType = {
  type?: string;
  delimiter?: string;
  import_option?: DataloadingJobConfigLoadingConfigImportOptionEnum;
  header_row: boolean;
  quoting?: boolean;
  quote_char?: string;
  repeat?: 'once' | 'day' | 'week';
  schedule?: string;
};
type ILeftSide = {
  graphId: string;
  onColse: () => void;
  datatype?: string;
  delimiter?: string;
};
const { Title, Text } = Typography;

// const openNotification = (notify:any,message:string,description:string,onClick:any) => {
//   const key = `open${Date.now()}`;
//   const btn = (
//     <Space>
//       <Button style={{ width: '128px' }} type="primary" onClick={onClick}>
//         <FormattedMessage id="Load data" />
//       </Button>
//     </Space>
//   );
//   //@ts-ignore
//   notify({
//     message,
//     description
//     btn,
//     key,
//     onClose: close,
//   });
// };
const REPEATOPTIONS = [
  {
    value: 'once',
    label: 'No repeat',
  },
  {
    value: 'day',
    label: 'Every day on the same time',
  },
  {
    value: 'week',
    label: 'Every week on the same time',
  },
];
const { GS_ENGINE_TYPE } = window;
const styles: Record<string, string> = {
  visibility: GS_ENGINE_TYPE === 'groot' ? 'visible' : 'hidden',
};
const StartLoad: React.FC<ILeftSide> = props => {
  const { graphId, onColse } = props;
  const [state, updateState] = useState<{
    result?: {
      status: 'success' | 'error';
      message: string;
    };
    jobId: '';
  }>({
    result: undefined,
    jobId: '',
  });
  const [api, contextHolder] = notification.useNotification();

  const { store: importingStore } = useImporting();
  const { nodes, edges } = importingStore;

  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const firstNode = nodes[0];
    const { delimiter, datatype } = firstNode.data;
    form.setFieldsValue({
      type: datatype || 'csv',
      delimiter: delimiter || '|',
      import_option: 'overwrite',
      header_row: true,
      quoting: false,
      repeat: 'once',
      schedule: dayjs(),
    });
  }, []);

  const gotoJob = (jobId: string) => {
    history.push(`/job/detail?graph_id=${graphId}&jobId=${jobId}`);
  };

  const onFinish = async (values: FieldType) => {
    let _status = 'success';
    let _message = '';

    const job_id = await submitDataloadingJob(
      graphId || '',
      {
        nodes,
        edges,
      },
      values,
    )
      .then((res: any) => {
        if (res.status === 200) {
          _status = 'success';
          _message = `The data loading task has been successfully created. You can view detailed logs in the job center.`;
          return res.data && res.data.job_id;
        }
        _status = 'error';
        _message = res.message;
      })
      .catch(error => {
        _status = 'error';
        _message = GS_ENGINE_TYPE === 'interactive' ? error.response.data : error.response.data.detail;
      });

    const gotoBtn = (
      <Button style={{ width: '128px' }} type="primary" onClick={() => gotoJob(job_id)}>
        {/* <FormattedMessage id="Goto Jobs" /> */}
        Goto Jobs
      </Button>
    );
    //@ts-ignore
    notification[_status]({
      message: `load data ${_status}`,
      description: _message,
      btn: _status === 'success' ? gotoBtn : null,
    });

    onColse();
  };

  const handleClick = () => {
    const data = form.getFieldsValue();
    const grootValue = GS_ENGINE_TYPE === 'groot' && {
      repeat: 'once',
      schedule: data.schedule && dayjs(data.schedule).format('YYYY-MM-DD HH:mm:ss'),
    };
    onFinish({ ...data, ...grootValue });
  };

  return (
    <div style={{ padding: '12px 36px' }}>
      <Title level={2}>
        <FormattedMessage id="Configuration" />
      </Title>
      {/* <Text type="secondary">
        <FormattedMessage id="You have successfully bound the data source. Please complete the configuration to start importing data." />
      </Text> */}
      <Form
        name="modal_type"
        // layout="vertical"
        style={{ margin: '12px 12px 0px 0px' }}
        labelCol={{ span: 5 }}
        form={form}
      >
        <Form.Item<FieldType> label="Type" name="type">
          <Select
            allowClear
            options={[
              { label: 'csv', value: 'csv' },
              { label: 'odps', value: 'odps' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label="Delimiter" name="delimiter">
          <Select
            allowClear
            options={[
              { label: '|', value: '|' },
              { label: ',', value: ',' },
              { label: ';', value: ';' },
              { label: <>\t</>, value: '\t' },
              { label: ' ', value: ' ' },
              { label: ':', value: ':' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label="Header Row" name="header_row">
          <Select
            allowClear
            options={[
              { label: 'true', value: true },
              { label: 'false', value: false },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label="Import Option" name="import_option">
          <Select
            allowClear
            options={[
              { label: 'overwrite', value: 'overwrite' },
              { label: 'init', value: 'init' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label="Quoting" name="quoting">
          <Select
            allowClear
            options={[
              { label: 'true', value: true },
              { label: 'false', value: false },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType> label="Quote char" name="quote_char">
          <Select
            allowClear
            options={[
              { label: '"', value: '"' },
              { label: `'`, value: `'` },
            ]}
          />
        </Form.Item>
        <div style={styles}>
          <Form.Item label={<FormattedMessage id="Date" />} name="schedule">
            <DatePicker placeholder=" " showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={<FormattedMessage id="Repeat" />} name="repeat">
            <Select options={REPEATOPTIONS} />
          </Form.Item>
        </div>
        <Flex justify="end" gap={12}>
          <Button style={{ width: '128px' }} type="primary" onClick={handleClick}>
            <FormattedMessage id="Load data" />
          </Button>
          <Button style={{ width: '128px' }} onClick={onColse}>
            <FormattedMessage id="Close" />
          </Button>
        </Flex>
      </Form>
    </div>
  );
};

export default StartLoad;
