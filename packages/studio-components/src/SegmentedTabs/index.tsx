import React, { useMemo, useCallback } from 'react';
import { Segmented, theme } from 'antd';
import { getSearchParams, setSearchParams } from '../Utils';

/**
 * SegmentedTabs 组件的属性接口
 */
export interface SegmentedTabsProps {
  /** 选项卡项配置 */
  items: {
    /** 选项卡的唯一标识 */
    key: string;
    /** 选项卡内容 */
    children: React.ReactNode;
    /** 选项卡标签 */
    label?: React.ReactNode;
    /** 选项卡图标 */
    icon?: React.ReactNode;
  }[];
  /** URL 查询参数键名，用于保存当前激活的选项卡 */
  queryKey?: string;
  /** 根容器自定义样式 */
  rootStyle?: React.CSSProperties;
  /** 选项卡自定义样式 */
  tabStyle?: React.CSSProperties;
  /** 选项卡高度 */
  tableHeight?: number;
  /** 默认激活的选项卡 */
  defaultActive?: string;
  /** 是否块级显示 */
  block?: boolean;
  /** 受控模式下的当前值 */
  value?: string;
  /** 选项卡切换回调 */
  onChange?: (value: string) => void;
}

/**
 * 分段式选项卡组件
 * @description 基于 Ant Design Segmented 组件的选项卡，支持 URL 参数同步和自定义样式
 */
const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  items,
  tableHeight = 40,
  queryKey = 'tab',
  rootStyle = {},
  tabStyle = {},
  defaultActive,
  block,
  value,
  onChange,
}) => {
  const { token } = theme.useToken();

  // 初始化状态，从 URL 参数或默认值获取当前激活的选项卡
  const [activeTab, setActiveTab] = React.useState<string>(() => {
    const defaultKey = getSearchParams(queryKey);
    return defaultKey || defaultActive || items[0]?.key || '';
  });

  // 使用 useMemo 优化样式计算
  const styles = useMemo<Record<string, React.CSSProperties>>(
    () => ({
      tabs: {
        height: '100%',
        padding: `${token.padding}px 0px`,
        boxSizing: 'border-box',
      },
      appear: {
        display: 'block',
        padding: `0px ${token.paddingXS}px`,
        height: `calc(100% - ${tableHeight}px)`,
      },
      hidden: {
        display: 'none',
        padding: `0px ${token.paddingXS}px`,
        height: `calc(100% - ${tableHeight}px)`,
      },
    }),
    [token.padding, token.paddingXS, tableHeight],
  );

  // 使用 useMemo 优化选项计算
  const options = useMemo(
    () =>
      items.map(item => ({
        value: item.key,
        label: item.label,
        icon: item.icon,
      })),
    [items],
  );

  // 使用 useCallback 优化事件处理函数
  const handleChange = useCallback(
    (newValue: string) => {
      if (onChange) {
        onChange(newValue);
        return;
      }

      setSearchParams({
        [queryKey]: newValue,
      });

      setActiveTab(newValue);
    },
    [onChange, queryKey],
  );

  // 当前激活的选项卡值
  const currentValue = value || activeTab;

  return (
    <div
      style={{
        background: token.colorBgBase,
        ...styles.tabs,
        ...rootStyle,
      }}
    >
      <Segmented
        options={options}
        value={currentValue}
        onChange={handleChange}
        block={block}
        style={{ marginBottom: token.marginSM, ...tabStyle }}
      />
      <>
        {items.map(item => {
          const { key, children } = item;
          const isActive = key === currentValue;
          return (
            <div style={isActive ? styles.appear : styles.hidden} key={key}>
              {children}
            </div>
          );
        })}
      </>
    </div>
  );
};

export default SegmentedTabs;
