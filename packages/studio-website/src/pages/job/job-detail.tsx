import React, { useCallback, useEffect, useState } from 'react';
import { Collapse, Flex } from 'antd';
import { useHistory } from '../../hooks';
import { getJobById } from './service';
import { Utils } from '@graphscope/studio-components';
import Section from '../../components/section';
const { getSearchParams } = Utils;

const Detail: React.FunctionComponent = () => {
  const history = useHistory();
  const jobId = getSearchParams('jobId') || '';
  const [state, updateState] = useState<{
    log: string;
    info: { [key: string]: string };
    isLog: boolean;
    activeKey: string | string[];
  }>({
    log: '',
    info: {},
    isLog: false,
    activeKey: [''],
  });
  const { log, info, isLog, activeKey } = state;
  /** 获取详情job */
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await getJobById(jobId);
        //@ts-ignore
        const { log, detail } = response;
        updateState(preset => {
          return {
            ...preset,
            log: log,
            info: detail,
            isLog: log !== 'None',
            activeKey: log === 'None' ? ['infoKey'] : [''],
          };
        });
      } catch (error) {
        history.push('/job');
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);
  const handleCollapseChange = useCallback(evt => {
    updateState(prevState => ({
      ...prevState,
      activeKey: evt,
    }));
  }, []);

  return (
    <Section
      breadcrumb={[
        {
          title: 'Jobs',
        },
        {
          title: jobId,
        },
      ]}
      desc={{ id: 'The jobid of the running state of the graph model is {jobId} verbose logs.', values: { jobId } }}
    >
      <Flex vertical gap={6}>
        <Collapse
          size="small"
          activeKey={activeKey}
          expandIconPosition="end"
          onChange={handleCollapseChange}
          items={[
            {
              key: 'infoKey',
              label: 'Info',
              children: JsonShow(info),
            },
          ]}
        />
        {isLog && (
          <Collapse
            size="small"
            defaultActiveKey={['logKey']}
            expandIconPosition="end"
            items={[
              {
                key: 'logKey',
                label: 'log',
                children: (
                  <pre>
                    <code style={{ whiteSpace: 'pre-wrap' }}>{log}</code>
                  </pre>
                ),
              },
            ]}
          />
        )}
      </Flex>
    </Section>
  );
};

export default Detail;

const JsonShow = (data, size = '12px', textIndent = '-8px') => (
  <>
    {'{'}
    {Object.entries(data).map(([key, value]) => (
      <div
        style={{
          paddingLeft: '16px',
          overflowWrap: 'break-word',
          wordBreak: 'normal',
          whiteSpace: 'pre-wrap',
        }}
        key={key}
      >
        <span style={{ color: '#F9822F', paddingLeft: size }}>"{key}" :</span>
        <span style={{ paddingLeft: '6px', textIndent }}>
          {typeof value === 'object' && value !== null ? (
            <>
              {'{'}
              {JsonShow(value, '24px', '16px')}
              {'}'}
            </>
          ) : (
            JSON.stringify(value, null, 2)
          )}
        </span>
      </div>
    ))}
    {'}'}
  </>
);
