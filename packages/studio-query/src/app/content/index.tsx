import React, { useState } from 'react';
import Statement from '../../statement';
import Header from '../header';
import { Segmented } from 'antd';
import './index.less';
import { useContext } from '../context';
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
  const { store, updateStore } = useContext();
  const { activeId, mode, statements } = store;

  const statementStyles =
    mode === 'tabs'
      ? ({
          position: 'absolute',
          top: '',
        } as React.CSSProperties)
      : ({} as React.CSSProperties);
  const handleChangeTab = value => {
    console.log('value', value);

    updateStore(draft => {
      draft.activeId = value;
    });
  };
  const onChangeMode = value => {
    console.log('value', value);

    updateStore(draft => {
      draft.mode = value;
    });
  };

  React.useEffect(() => {}, []);

  console.log('mode', mode, activeId);
  const queryOptions = statements.map(item => {
    return {
      label: item.id,
      value: item.id,
    };
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f6f6' }}>
      <div style={{ minHeight: '100px', background: 'red' }}>
        <Header />
        {mode === 'tabs' && <Segmented size="small" options={queryOptions} onChange={handleChangeTab} />}
      </div>

      <div style={{ overflowY: 'scroll', flex: '1' }}>
        {statements.map(item => {
          const { id } = item;
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
