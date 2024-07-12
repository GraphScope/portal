import React from 'react';
import { history } from 'umi';
import { Result, Typography, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useContext } from '@/layouts/useContext';
type IRightSide = {
  status?: 'error' | 'success';
  message?: string;
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
  const { status, message } = props;
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
        {isSuccess && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Button
              style={{ width: '128px' }}
              type="primary"
              onClick={() => {
                history.push('/job');
                updateStore(draft => {
                  draft.currentnNav = '/job';
                });
              }}
            >
              <FormattedMessage id="Goto Jobs" />
            </Button>
          </div>
        )}
      </>
    </div>
  );
};

export default RightSide;
