import { Segmented, theme } from 'antd';
import * as React from 'react';
import { ReactNode } from 'react';
import { getSearchParams, setSearchParams } from '../Utils';

export interface SegmentedTabsProps {
  items: { key: string; children: ReactNode; label?: React.ReactNode; icon?: ReactNode }[];
  queryKey?: string;
  rootStyle?: React.CSSProperties;
  tabStyle?: React.CSSProperties;
  tableHeight?: number;
  defaultActive?: string;
  block?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const SegmentedTabs: React.FunctionComponent<SegmentedTabsProps> = props => {
  const {
    items,
    tableHeight = 40,
    queryKey = 'tab',
    rootStyle = {},
    tabStyle = {},
    defaultActive,
    block,
    value,
    onChange,
  } = props;
  //@ts-ignore
  const [state, setState] = React.useState<{ active: string }>(() => {
    const defaultKey = getSearchParams(queryKey);
    const active = defaultKey || defaultActive || items[0]?.key || '';
    return {
      active,
    };
  });

  const styles: Record<string, React.CSSProperties> = {
    tabs: {
      height: '100%',
      padding: '12px 0px',
      boxSizing: 'border-box',
    },
    appear: {
      display: 'block',
      padding: '0px 6px',
      height: `calc(100% - ${tableHeight}px)`,
    },
    hidden: {
      display: 'none',
      padding: '0px 6px',
      height: `calc(100% - ${tableHeight}px)`,
    },
  };

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
  const { token } = theme.useToken();

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
        value={val}
        onChange={handleChange}
        block={block}
        style={{ marginBottom: '12px', ...tabStyle }}
      />
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
