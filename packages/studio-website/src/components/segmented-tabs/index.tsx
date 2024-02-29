import { Card, Segmented, Tabs } from 'antd';
import * as React from 'react';
import { ReactNode } from 'react';
import { getSearchParams } from '@/pages/utils';
// import TabAction from './tab-action';
import './index.less';
interface SegmentedTabsProps {
  items: { key: string; children: ReactNode; label: string; icon?: ReactNode }[];
  queryKey?: string;
  style?: React.CSSProperties;
  extra?: ReactNode;
  defaultActive?: string;
  segmentedTabsChange(val: string): void;
}

const SegmentedTabs: React.FunctionComponent<SegmentedTabsProps> = props => {
  const { items, queryKey = 'tab', style = {}, extra = <></>, defaultActive, segmentedTabsChange } = props;
  const [state, setState] = React.useState<{ active: string }>(() => {
    const { searchParams, path } = getSearchParams(window.location);
    const active = searchParams.get(queryKey) || defaultActive || items[0]?.key || '';
    return {
      active,
    };
  });

  const { active } = state;
  const options = items.map(item => {
    return {
      value: item.key,
      label: item.label,
      icon: item.icon,
    };
  });
  const tabItems = items.map(item => {
    return {
      key: item.key,
      label: item.label,
    };
  });

  const onChange = value => {
    const { searchParams, path } = getSearchParams(window.location);
    searchParams.set(queryKey, value);
    window.location.hash = `${path}?${searchParams.toString()}`;
    setState(preState => {
      return {
        ...preState,
        active: value,
      };
    });
    segmentedTabsChange(value);
  };
  /**
   * Tabs or Segmented
   */
  const CardTitle =
    queryKey === 'tab' ? (
      // <TabAction tabItems={options} tabChange={onChange} />
      <Tabs activeKey={active} items={tabItems} onChange={onChange} />
    ) : (
      <Segmented options={options} value={active} onChange={onChange} />
    );
  return (
    <Card
      style={{ borderRadius: '8px', height: '100%', background: 'var(--background-color-transparent)' }}
      bodyStyle={{
        // width: 'calc(100vw - 300px)',
        height: 'calc(100vh - 180px)',
        overflow: 'auto',
        padding: '12px 12px',
        ...style,
      }}
      title={<>{CardTitle}</>}
      extra={extra}
    >
      <div className="gi-segmented-tabs">
        {items.map(item => {
          const { key, children } = item;
          const isActive = key === active;
          return (
            <div className={isActive ? 'appear' : 'hidden'} key={key}>
              {children}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SegmentedTabs;
