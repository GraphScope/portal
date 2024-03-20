import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { FormattedMessage } from 'react-intl';
import { getJobById } from './service';
import { searchParamOf } from '@/components/utils';
import { useContext } from '@/layouts/useContext';
type IDetail = {};
const Detail: React.FunctionComponent<IDetail> = props => {
  const jobId: string = searchParamOf('jobId') || '';
  const [detailData, setDetailData] = useState('');
  const { store } = useContext();
  const { mode } = store;
  useEffect(() => {
    getJobByIdDetail();
  }, []);
  /** 获取详情job */
  const getJobByIdDetail = async () => {
    const res = await getJobById(jobId);
    const { log } = res;
    setDetailData(log);
  };
  //@ts-ignore
  const myTheme = createTheme({
    theme: mode === 'defaultAlgorithm' ? 'light' : 'dark',
    settings: {
      background: mode === 'defaultAlgorithm' ? '#fff' : '#000',
      backgroundImage: '',
      foreground: mode === 'defaultAlgorithm' ? '#212121' : '#FFF',
      gutterBackground: mode === 'defaultAlgorithm' ? '#fff' : '#000',
    },
  });
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
        style={{
          margin: '12px 0px',
          height: 'calc(100vh - 120px)',
          overflow: 'scroll',
          border: `1px solid ${mode === 'defaultAlgorithm' ? '#efefef' : '#323232'}`,
          borderRadius: '6px',
        }}
        value={detailData}
        readOnly={true}
        theme={myTheme}
      />
    </div>
  );
};

export default Detail;
