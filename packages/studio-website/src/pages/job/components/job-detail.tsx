import React from 'react';
import { theme, Flex, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import Section from '../../../components/section';
import { useJobDetails } from '../hooks/useJobDetails';

const Detail: React.FunctionComponent = () => {
  const { token } = theme.useToken();
  const { colorBorder, colorText, colorBgContainer } = token;

  const { state, jobId } = useJobDetails();

  const handleClick = (): void => {
    if (state.reference) {
      window.open(state.reference);
    }
  };

  const containerStyles: React.CSSProperties = {
    border: `${colorBorder} 1px solid`,
    borderRadius: '6px',
    padding: '12px',
    color: colorText,
  };

  return (
    <Section
      style={{ backgroundColor: colorBgContainer }}
      breadcrumb={[{ title: 'Jobs' }, { title: jobId }]}
      desc={{
        id: 'The jobid of the running state of the graph model is {jobId} verbose logs.',
        values: { jobId },
      }}
    >
      <Flex vertical gap={12} justify="start">
        {state.reference && (
          <Button icon={<LinkOutlined />} onClick={handleClick} style={{ width: '200px' }} type="text">
            See more information
          </Button>
        )}
        <pre style={containerStyles}>
          <code style={{ whiteSpace: 'pre-wrap' }}>{state.content}</code>
        </pre>
      </Flex>
    </Section>
  );
};

export default Detail;
