import React from 'react';
import { history } from 'umi';
import { Result, Typography, Button, Flex } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '@/layouts/useContext';
type IRightSide = {
  status?: 'error' | 'success';
  message?: string;
  jobId?: string;
  onColse: () => void;
};
const { Text } = Typography;
const rightSVG = (
  <>
    <svg width="45px" height="45px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path fill="#fff" d="M819.2 511.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z" />
      <path fill="#fff" d="M512 511.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z" />
      <path fill="#fff" d="M204.8 511.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z" />
    </svg>
  </>
);
const RightSide: React.FC<IRightSide> = props => {
  const { status, message, jobId, onColse } = props;
  const { updateStore } = useContext();
  const isSuccess = status === 'success';

  return (
    <div style={{ marginLeft: '-36px' }}>
      <>
        <Result
          status="404"
          subTitle={
            <>
              <Text type={isSuccess ? 'secondary' : 'danger'}>{message}</Text>
            </>
          }
        />

        <Flex justify="center" gap={12}>
          {isSuccess && (
            <Button
              style={{ width: '128px' }}
              type="primary"
              onClick={() => {
                history.push(`/job/detail?jobId=${jobId}`);
                updateStore(draft => {
                  draft.currentnNav = '/job';
                });
              }}
            >
              <FormattedMessage id="Goto Jobs" />
            </Button>
          )}
          <Button style={{ width: '128px' }} onClick={onColse}>
            <FormattedMessage id="Close" />
          </Button>
        </Flex>
      </>
    </div>
  );
};

export default RightSide;
