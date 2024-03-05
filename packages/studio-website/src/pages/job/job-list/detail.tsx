import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { FormattedMessage } from 'react-intl';
import { getJobById } from '../service';
import { getSearchParams } from '@/components/utils';
type IDetail = {};
const Detail: React.FunctionComponent<IDetail> = props => {
  const { searchParams } = getSearchParams(window.location);
  const JobId: string = searchParams.get('JobID') || '';
  const [detailData, setDetailData] = useState('');
  console.log(JobId);
  useEffect(() => {
    getJobByIdDetail();
  }, []);
  /** 获取详情job */
  const getJobByIdDetail = async () => {
    const res = await getJobById(JobId);
    const { log } = res;
    setDetailData(log);
  };
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
      <CodeMirror
        style={{ margin: '12px 0px', height: 'calc(100% - 30px)', overflow: 'scroll' }}
        value={detailData}
        readOnly={true}
      />
    </div>
  );
};

export default Detail;
