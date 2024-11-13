import React from 'react';
import { ConfigProvider } from 'antd';
import { useStudioProvier } from '@graphscope/studio-components';
type ITableParcelProps = {
  children: React.ReactNode;
};
const TableParcel: React.FC<ITableParcelProps> = ({ children }) => {
  const { isLight } = useStudioProvier();
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: isLight ? '#fff' : '#242424',
          },
        },
      }}
    >
      <div
        style={{
          backgroundColor: isLight ? '#fff' : '#242424',
          border: `1px solid ${isLight ? '#f0f0f0' : '#313131'}`,
          borderRadius: '6px',
        }}
      >
        {children}
      </div>
    </ConfigProvider>
  );
};

export default TableParcel;
