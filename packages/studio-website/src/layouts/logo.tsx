import * as React from 'react';
import styles from './styles';
import { Space } from 'antd';

interface ILogoProps {}

const Logo: React.FunctionComponent<ILogoProps> = props => {
  return (
    <div style={{ paddingLeft: '24px', height: '100px', lineHeight: '100px' }}>
      <Space>
        <img
          style={{
            height: '40px',
          }}
          src="https://img.alicdn.com/imgextra/i3/O1CN01DaSVLB1lD7ZIbDOi2_!!6000000004784-2-tps-256-257.png"
          alt=""
        />
        <div style={{}}>GraphScope</div>
      </Space>
    </div>
  );
};

export default Logo;
