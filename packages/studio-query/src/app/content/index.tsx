import React, { useState } from 'react';
import Statement from '../../statement';
import Header from './header';
import { Segmented } from 'antd';
import './index.less';

interface IContentProps {}

interface IContentState {
  /** 单击选中的语句 */
  activeId: string;
  /** 需要额外对比的语句 */
  queryIds: string[];
  /** 展示的模式 */
  mode: 'flow' | 'tabs';
}

const Content: React.FunctionComponent<IContentProps> = props => {
  const [state, updateState] = useState<IContentState>({
    activeId: 'query-1',
    queryIds: ['query-1', 'query-2', 'query-3', 'query-4'],
    mode: 'tabs',
  });
  const { queryIds, activeId, mode } = state;
  const instances = [...queryIds];
  const statementStyles =
    mode === 'tabs'
      ? ({
          position: 'absolute',
          top: '',
        } as React.CSSProperties)
      : ({} as React.CSSProperties);
  const handleChangeTab = value => {
    console.log('value', value);
    updateState(preState => {
      return {
        ...preState,
        activeId: value,
      };
    });
  };
  const onChangeMode = value => {
    console.log('value', value);
    updateState(preState => {
      return {
        ...preState,
        mode: value,
      };
    });
  };

  React.useEffect(() => {}, []);

  console.log('mode', mode, activeId);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f6f6' }}>
      <div style={{ minHeight: '100px', background: 'red' }}>
        <Header onChangeMode={onChangeMode} />
        {mode === 'tabs' && <Segmented size="small" options={queryIds} onChange={handleChangeTab} />}
      </div>

      <div style={{ overflowY: 'scroll', flex: '1' }}>
        {instances.map(id => {
          return (
            <div
              key={id}
              style={{ ...statementStyles, visibility: id === activeId || mode === 'flow' ? 'visible' : 'hidden' }}
            >
              <Statement activeId={id} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Content;
