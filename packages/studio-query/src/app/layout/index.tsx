import React, { useState } from 'react';
import { RollbackOutlined, PicLeftOutlined, SlidersOutlined } from '@ant-design/icons';
import { Space } from 'antd';
interface ContainerProps {
  children: React.ReactNode;
  left: React.ReactNode;
}

const calStyles = (
  collapse: boolean,
): Record<'sidebar' | 'right' | 'header' | 'collapseIcon' | 'queryHeader' | 'modeIcon', React.CSSProperties> => {
  return {
    header: {
      position: 'absolute',
      top: '0px',
      left: '0px',
      height: '50px',
      lineHeight: '50px',
      width: collapse ? '50px' : '300px',
      background: '#fafafa',
      textAlign: 'center',
      transition: 'width ease 0.3s',
    },
    sidebar: {
      position: 'absolute',
      top: '50px',
      bottom: '0px',
      width: collapse ? '50px' : '300px',
      transition: 'width ease 0.3s',
    },
    right: {
      position: 'absolute',
      top: '0px',
      left: collapse ? '50px' : '300px',
      right: '0px',
      bottom: '0px',
      background: '#f1f1f1',
      transition: 'left ease 0.3s',
    },
    collapseIcon: {
      position: 'absolute',
      width: '50px',
      height: '50px',
      right: '0px',
      top: '0px',
    },
    queryHeader: {
      position: 'relative',
      minHeight: '50px',
      lineHeight: '50px',
    },
    modeIcon: {
      position: 'absolute',
      width: '50px',
      height: '50px',
      right: '0px',
      top: '0px',
    },
  };
};

const Container: React.FunctionComponent<ContainerProps> = props => {
  const { children, left } = props;
  const [collapse, setCollapse] = useState(false);
  const styles = calStyles(collapse);
  return (
    <div>
      <div>
        <div style={styles.header}>
          <Space>
            <RollbackOutlined />
            <div>default movies</div>
          </Space>
          <div style={styles.collapseIcon}>
            <PicLeftOutlined
              onClick={() => {
                setCollapse(!collapse);
              }}
            />
          </div>
        </div>
        <div style={styles.sidebar}>{left}</div>
      </div>
      <div style={styles.right}>{children}</div>
    </div>
  );
};

export default Container;
