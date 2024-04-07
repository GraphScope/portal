import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getJobById } from './service';
import { searchParamOf } from '@/components/utils';
import { useContext } from '@/layouts/useContext';

const Detail: React.FunctionComponent = () => {
  const jobId: string = searchParamOf('jobId') || '';
  const [detailData, setDetailData] = useState('');
  const { store } = useContext();
  const { mode } = store;
  /** 获取详情job */
  const getJobByIdDetail = async () => {
    const res = await getJobById(jobId);
    const { log } = res;
    setDetailData(log);
  };

  useEffect(() => {
    getJobByIdDetail();
  }, []);

  return (
    <div style={{ padding: '12px 24px' }}>
      <Breadcrumb
        items={[
          {
            title: <a href="/job">作业管理</a>,
          },
          {
            title: <FormattedMessage id="Detail" />,
          },
        ]}
      />
      <pre
        style={{
          margin: '12px 0px',
          height: 'calc(100vh - 120px)',
          overflow: 'scroll',
          border: `1px solid ${mode === 'defaultAlgorithm' ? '#efefef' : '#323232'}`,
          color: mode === 'defaultAlgorithm' ? '#1F1F1F' : '#808080',
          borderRadius: '6px',
          padding: '12px',
        }}
      >
        <code style={{ whiteSpace: 'pre-wrap' }}>{detailData}</code>
      </pre>
    </div>
  );
};

export default Detail;
