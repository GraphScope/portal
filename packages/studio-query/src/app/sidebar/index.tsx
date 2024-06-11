/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { memo } from 'react';
import { Utils } from '@graphscope/studio-components';
import { RollbackOutlined, PicLeftOutlined, SlidersOutlined } from '@ant-design/icons';
import { Space, Button, theme, Flex, Typography, Tooltip, Divider, Tag } from 'antd';
const { useToken } = theme;

interface Option {
  /** 导航图标 */
  icon: React.ReactElement;
  /** 导航ID */
  id: string;
  /** 导航名称 */
  name: string | React.ReactNode;
  children: React.ReactNode;
}
interface SidebarProps {
  title?: string;
  options: Option[];
  value: Option['id'];
  collapse?: boolean;
  onChange: (option: Option) => void;
  onBack: () => void;
  logo?: React.ReactNode;
}

const collapsedWidth = 50;
const width = 300;
const Sidebar: React.FunctionComponent<SidebarProps> = props => {
  const { options, collapse, onChange, title, onBack, logo } = props;
  const { token } = useToken();
  const nav = Utils.getSearchParams('nav') || 'recommended';
  const activeOption = options.find(item => {
    return item.id === nav;
  });

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
      borderBottom: `1px solid ${token.colorBorder}`,
      overflow: 'hidden',
    },
    ul: {
      flexBasis: '50px',
      width: '50px',
      height: '100%',
      borderRight: `1px solid ${token.colorBorder}`,
      margin: '0px',
      paddingInlineStart: '0px',
      flexShrink: 0,
    },
    li: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      margin: '12px 0px',
      cursor: 'pointer',
      listStyle: 'none',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    content: {},
  };
  return (
    <div
      style={{
        height: '100%',
        width: collapse ? `${collapsedWidth}px` : `${width}px`,
        transition: 'width ease 0.3s',
      }}
    >
      {onBack && (
        <Flex justify="space-between" align="center" style={styles.header}>
          <Flex align="center">
            <div onClick={onBack} style={{ cursor: 'pointer' }}>
              {logo}
            </div>
          </Flex>
        </Flex>
      )}
      <div style={styles.container}>
        <ul style={styles.ul}>
          {options.map(opt => {
            const { icon, id, name } = opt;
            const isActive = id === nav;
            const activeLi = isActive
              ? {
                  // borderLeft: `2px solid ${token.colorPrimary}`,
                }
              : {};
            const activeIcon = isActive
              ? {
                  fontWeight: '600',
                  background: token.colorPrimaryBg,
                  color: token.colorPrimary,
                }
              : {};
            const activeText: React.CSSProperties = isActive
              ? {
                  fontSize: '10px',
                  color: token.colorPrimary,
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: '0px 5px',
                }
              : {
                  fontSize: '10px',
                  textAlign: 'center',
                  padding: '0px 5px',
                };

            return (
              <li
                style={{ ...styles.li, ...activeLi }}
                key={id}
                onClick={() => {
                  Utils.setSearchParams({
                    nav: id,
                  });
                  onChange(opt);
                }}
              >
                <Tooltip title={name} placement="right">
                  <Button type={'text'} icon={icon} style={activeIcon} size="large"></Button>
                </Tooltip>
                {/* <span style={activeIcon}>{icon}</span> */}
                {/* <span style={activeText}>{name}</span> */}
              </li>
            );
          })}
        </ul>

        <div style={{ flex: 1, overflow: 'hidden', height: 'calc(100% - 60px)', position: 'relative' }}>
          {activeOption?.children}
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
