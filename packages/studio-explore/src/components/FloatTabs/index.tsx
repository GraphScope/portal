import * as React from 'react';
import { Button, Flex, Divider, theme, Typography } from 'antd';
import { Icons } from '@graphscope/studio-components';
import { CaretLeftOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Toolbar } from '@graphscope/studio-components';
interface IFloatTabsProps {
  direction?: 'vertical' | 'horizontal';
  posotion?: 'left' | 'right' | 'top' | 'bottom';
  items: {
    key: string;
    icon: React.ReactNode;
    label?: React.ReactNode;
    children: React.ReactNode;
  }[];
  tools?: React.ReactNode;
  searchbar?: React.ReactNode;
}
const getRootStyle = (
  position: IFloatTabsProps['posotion'],
  direction: IFloatTabsProps['direction'],
): React.CSSProperties => {
  const directionStyle: { flexDirection: React.CSSProperties['flexDirection'] } =
    direction === 'vertical'
      ? {
          flexDirection: 'row-reverse',
        }
      : {
          flexDirection: 'column',
        };
  if (position === 'left') {
    return {
      ...directionStyle,
      top: '0px',
      left: '0px',
      bottom: '0px',
    };
  }
  if (position === 'bottom') {
    return {
      ...directionStyle,
      bottom: '0px',
      left: '0px',
      right: '0px',
    };
  }
  if (position === 'top') {
    return {
      ...directionStyle,
      top: '0px',
      right: '0px',
      width: '400px',
    };
  }
  // if (position === 'right') {
  return {
    ...directionStyle,
    top: '0px',
    right: '0px',
  };
};

const FloatTabs: React.FunctionComponent<IFloatTabsProps> = props => {
  const { items, direction = 'horizontal', tools, posotion = 'left', searchbar } = props;
  const { token } = theme.useToken();
  const [state, setState] = React.useState({
    visible: false,
    activeKey: items[0].key,
  });
  const { visible } = state;
  const handleToggle = () => {
    setState(preState => {
      return {
        ...preState,
        visible: !preState.visible,
      };
    });
  };
  const rootStyle: React.CSSProperties = getRootStyle(posotion, direction);
  const barStyle: React.CSSProperties =
    direction === 'vertical'
      ? {
          flexDirection: 'column',
        }
      : {
          flexDirection: 'row-reverse',
        };

  const panelStyle: React.CSSProperties =
    direction === 'vertical'
      ? {
          width: visible ? '300px' : '0px',
          overflowY: 'scroll',
          // transition: 'all 0.3s ease-in-out',
          background: token.colorBgContainer,
          boxShadow: token.boxShadow,
          padding: visible ? 12 : 0,
          borderRadius: token.borderRadius,
        }
      : {
          maxHeight: visible ? (posotion === 'bottom' ? '300px' : 'unset') : 0,
          //   height: visible ? '300px' : '0px',
          overflowY: 'scroll',
          //   transition: 'all 0.3s ease-in-out',
          background: token.colorBgContainer,
          boxShadow: token.boxShadow,
          padding: visible ? 12 : 0,
          borderRadius: token.borderRadius,
        };
  const icon = direction == 'vertical' ? <CaretLeftOutlined /> : <CaretDownOutlined />;
  const searchStyle: React.CSSProperties =
    posotion === 'left'
      ? {
          position: 'absolute',
          top: '12px',
          left: visible ? '400px' : '66px',
          width: 500,
        }
      : {
          position: 'absolute',
          top: '12px',
          right: visible ? '400px' : '66px',
          width: 500,
        };
  return (
    <Flex
      style={{
        position: 'absolute',
        padding: 12,
        boxSizing: 'border-box',
        zIndex: 999,
        ...rootStyle,
      }}
      gap={visible ? 12 : 0}
    >
      <Flex style={barStyle} gap={12}>
        <Flex
          gap={12}
          justify="center"
          align="center"
          style={{
            ...barStyle,
            boxShadow: token.boxShadow,
            padding: '6px',
            borderRadius: token.borderRadius,
            background: token.colorBgContainer,
            height: 'unset',
          }}
        >
          <Button icon={icon} type="text" onClick={handleToggle} />
          <Divider style={{ margin: '0px' }} type={direction === 'vertical' ? 'horizontal' : 'vertical'} />
          {items.map(item => {
            const { key } = item;
            const isActive = key === state.activeKey;
            const iconStyle: React.CSSProperties = {
              color: isActive ? token.colorBgBase : token.colorText,
            };
            const isMatch = item.key === state.activeKey;
            return (
              <Button
                key={item.key}
                icon={item.icon}
                style={iconStyle}
                type={isMatch ? 'primary' : 'text'}
                onClick={() => {
                  setState(preState => {
                    return {
                      ...preState,
                      activeKey: item.key,
                      visible: isMatch ? !preState.visible : true,
                    };
                  });
                }}
              />
            );
          })}
        </Flex>
        {tools && (
          <Flex
            gap={12}
            justify="center"
            align="center"
            style={{
              ...barStyle,
              boxShadow: token.boxShadow,
              padding: '6px',
              borderRadius: token.borderRadius,
              background: token.colorBgContainer,
              height: 'unset',
            }}
          >
            {tools}
          </Flex>
        )}
      </Flex>

      <Flex vertical style={panelStyle}>
        {items.map(item => {
          const { key, children, label } = item;
          const isActive = key === state.activeKey;
          const style: React.CSSProperties = {
            display: isActive ? 'block' : 'none',
          };

          return (
            <Flex key={key} style={style}>
              {label && <Typography.Title level={3}>{label}</Typography.Title>}
              {children}
            </Flex>
          );
        })}
      </Flex>
      {searchbar && (
        <Toolbar direction="horizontal" style={searchStyle} noSpace>
          {searchbar}
        </Toolbar>
      )}
    </Flex>
  );
};

export default FloatTabs;
