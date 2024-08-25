import * as React from 'react';
import { Spin } from 'antd';
import { useContext } from '../../hooks/useContext';

interface ILoadingProps {}

const Loading: React.FunctionComponent<ILoadingProps> = props => {
  const { store } = useContext();
  const { isLoading } = store;
  if (isLoading) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          bottom: '0px',
          right: '0px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.1)',
        }}
      >
        <Spin />
      </div>
    );
  }
  return null;
};

export default Loading;
