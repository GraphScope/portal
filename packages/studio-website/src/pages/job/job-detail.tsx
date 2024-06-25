import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getJobById } from './service';
import { Utils, useThemeContainer } from '@graphscope/studio-components';
const { getUrlParams } = Utils;

const Detail: React.FunctionComponent = () => {
  console.log(getUrlParams());

  const { jobId } = getUrlParams() || '';
  const [detailData, setDetailData] = useState<string>('');
  const { jobDetailBorder, jobDetailColor } = useThemeContainer();
  /** 获取详情job */
  useEffect(() => {
    const fetchJobDetails = async () => {
      const response = await getJobById(jobId);
      const { log } = response;
      setDetailData(log);
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);
  /** code style */
  const containerStyles = {
    margin: '12px 0px',
    border: `${jobDetailBorder} 1px solid`,
    borderRadius: '6px',
    padding: '12px',
    color: jobDetailColor,
  };
  return (
    <div style={{ padding: '12px 24px' }}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <a href="/job">作业管理</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <FormattedMessage id="Detail" />
        </Breadcrumb.Item>
      </Breadcrumb>
      <pre style={containerStyles}>
        <code style={{ whiteSpace: 'pre-wrap' }}>{detailData}</code>
      </pre>
    </div>
  );
};

export default Detail;
