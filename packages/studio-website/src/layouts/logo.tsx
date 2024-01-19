import * as React from 'react';
import styles from './styles';
import { Space } from 'antd';

interface ILogoProps {}

const Logo: React.FunctionComponent<ILogoProps> = props => {
  return (
    <div
      style={{
        height: '80px',
        lineHeight: '80px',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      <img
        style={{
          height: '40px',
        }}
        src="https://img.alicdn.com/imgextra/i3/O1CN01DaSVLB1lD7ZIbDOi2_!!6000000004784-2-tps-256-257.png"
        alt=""
      />
      <h3 style={{}}>GraphScope</h3>
    </div>
  );
};

export default Logo;
