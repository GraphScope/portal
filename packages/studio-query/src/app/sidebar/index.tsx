/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { memo } from 'react';
import { getSearchParams } from '../utils';
import { RollbackOutlined, PicLeftOutlined, SlidersOutlined } from '@ant-design/icons';
import { Space, Button } from 'antd';

interface Option {
  /** 导航图标 */
  icon: React.ReactElement;
  /** 导航ID */
  id: string;
  /** 导航名称 */
  name: string;
  children: React.ReactNode;
}
interface SidebarProps {
  title?: string;
  options: Option[];
  value: Option['id'];
  collapse?: boolean;
  onChange: (option: Option) => void;
  onBack: () => void;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  header: {
    height: '50px',
    lineHeight: '50px',
    width: '100%',
    transition: 'width ease 0.3s',
    borderBottom: '1px solid #ddd',
    // borderRight: '1px solid #ddd',
    overflow: 'hidden',
  },
  ul: {
    flexBasis: '50px',
    width: '50px',
    height: '100%',
    borderRight: '1px solid #ddd',
    margin: '0px',
    paddingInlineStart: '0px',
    flexShrink: 0,
  },
  li: {
    display: 'flex',
    width: '100%',
    height: '54px',
    padding: '6px 0px',
    cursor: 'pointer',
    listStyle: 'none',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {},
};

const collapsedWidth = 50;
const width = 300;
const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const { options, collapse, onChange, title, onBack } = props;
  const { searchParams, path } = getSearchParams(window.location);
  const nav = searchParams.get('nav') || 'style';
  const activeOption = options.find(item => {
    return item.id === nav;
  });

  return (
    <div
      style={{
        height: '100%',
        width: collapse ? `${collapsedWidth}px` : `${width}px`,
        transition: 'width ease 0.3s',
      }}
    >
      {onBack && (
        <div style={styles.header}>
          <Button type="text" style={{ margin: '0px 10px' }} icon={<RollbackOutlined />} onClick={onBack} />
          <span style={{ padding: '0px 12px' }}>{title}</span>
        </div>
      )}
      <div style={styles.container}>
        <ul style={styles.ul}>
          {options.map(opt => {
            const { icon, id, name } = opt;
            const isActive = id === nav;
            const activeLi = isActive
              ? {
                  borderRight: '1px solid red',
                }
              : {};

            return (
              <li
                style={{ ...styles.li, ...activeLi }}
                key={id}
                onClick={() => {
                  searchParams.set('nav', id);
                  window.location.hash = `${path}?${searchParams.toString()}`;
                  onChange(opt);
                }}
              >
                <span>{icon}</span>
              </li>
            );
          })}
        </ul>
        <div style={{ flex: 1 }}>{activeOption?.children}</div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
