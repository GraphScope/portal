import React, { memo, ReactNode } from 'react';

import { RollbackOutlined, PicLeftOutlined, SlidersOutlined } from '@ant-design/icons';
import { Space, Button, theme, Flex, Typography, Tooltip, Divider, Tag } from 'antd';

import { setSearchParams, getSearchParams } from '../Utils';

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
  items: { key: string; children: ReactNode; label?: string; icon?: ReactNode }[];
  queryKey?: string;
  style?: React.CSSProperties;
  defaultActive?: string;
  block?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBack?: () => void;
  logo?: string;
  width?: number;
}

const getStyles: (token: any) => Record<string, React.CSSProperties> = token => {
  return {
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
};

const SideTabs: React.FunctionComponent<SidebarProps> = props => {
  const {
    items,
    queryKey = 'tab',
    style = {},
    defaultActive,
    block,
    value,
    onChange,
    onBack,
    logo,
    width = 320,
  } = props;
  const { token } = useToken();
  const collapse = false;
  const collapsedWidth = 50;

  const [state, setState] = React.useState<{ active: string }>(() => {
    const defaultKey = getSearchParams(queryKey);
    const active = defaultKey || defaultActive || items[0]?.key || '';
    return {
      active,
    };
  });
  const { active } = state;

  const handleChange = value => {
    if (onChange) {
      onChange(value);
      return;
    }
    setSearchParams({
      [queryKey]: value,
    });
    setState(preState => {
      return {
        ...preState,
        active: value,
      };
    });
  };
  const val = value || active;
  const activeOption = items.find(item => item.key === val);
  console.log('active', activeOption, val);

  const styles: Record<string, React.CSSProperties> = getStyles(token);
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
          {items.map(opt => {
            const { icon, key, label } = opt;
            const isActive = key === val;
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
                key={key}
                onClick={() => {
                  handleChange(key);
                }}
              >
                <Tooltip title={label} placement="right">
                  <Button type={'text'} icon={icon} style={activeIcon} size="large"></Button>
                </Tooltip>
              </li>
            );
          })}
        </ul>

        <div style={{ flex: 1, overflow: 'hidden', height: '100%', position: 'relative' }}>
          {activeOption?.children}
        </div>
      </div>
    </div>
  );
};

export default memo(SideTabs);
