import { Segmented } from 'antd';
import * as React from 'react';
import { ReactNode } from 'react';
import { getSearchParams } from './utils';

export interface SegmentedTabsProps {
  items: { key: string; children: ReactNode; label?: string; icon?: ReactNode }[];
  queryKey?: string;
  style?: React.CSSProperties;
  defaultActive?: string;
  block?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
const styles: Record<string, React.CSSProperties> = {
  tabs: {
    height: '100%',
    padding: '12px 0px',
    boxSizing: 'border-box',
  },
  appear: {
    display: 'block',
    height: 'calc(100% - 60px)',
  },
  hidden: {
    display: 'none',
    height: 'calc(100% - 60px)',
  },
};

const SegmentedTabs: React.FunctionComponent<SegmentedTabsProps> = props => {
  const { items, queryKey = 'tab', style = {}, defaultActive, block, value, onChange } = props;

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

  const handleChange = value => {
    if (onChange) {
      onChange(value);
      return;
    }
    const { searchParams, path } = getSearchParams(window.location);
    searchParams.set(queryKey, value);
    window.location.hash = `${path}?${searchParams.toString()}`;
    setState(preState => {
      return {
        ...preState,
        active: value,
      };
    });
  };
  const val = value || active;

  return (
    <div style={styles.tabs}>
      <Segmented options={options} value={val} onChange={handleChange} block={block} style={{ marginBottom: '12px' }} />
      <>
        {items.map(item => {
          const { key, children } = item;
          const isActive = key === val;
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
