import React, { useState, memo } from 'react';
import Statement from '../../statement';
import Header from './header';
import { Segmented, Empty } from 'antd';
import { useContext } from '../context';
import type { IStudioQueryProps } from '../context';
interface IContentProps {
  createStatement: IStudioQueryProps['createStatement'];
  queryGraphData: IStudioQueryProps['queryGraphData'];
}
const styles: Record<string, React.CSSProperties> = {
  empty: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Content: React.FunctionComponent<IContentProps> = props => {
  const { createStatement, queryGraphData } = props;
  const { store, updateStore } = useContext();
  const { activeId, mode, statements, savedStatements } = store;
  const savedIds = savedStatements.map(item => item.id);

  const statementStyles =
    mode === 'tabs'
      ? ({
          position: 'absolute',
          top: '',
        } as React.CSSProperties)
      : ({} as React.CSSProperties);
  const handleChangeTab = value => {
    updateStore(draft => {
      draft.activeId = value;
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

  const onSave = ({ id, script }) => {
    console.log('save', id, script);
    updateStore(draft => {
      const saveIds = draft.savedStatements.map(item => item.id);
      const HAS_SAVED = saveIds.indexOf(id) !== -1;
      if (HAS_SAVED) {
        draft.savedStatements.forEach(item => {
          if (item.id === id) {
            item.script = script;
          }
        });
      } else {
        draft.savedStatements.push({ id, script, name: id });
        // fetch server
        createStatement && createStatement({ id, script, name: id });
      }
    });
  };
  const onClose = id => {
    updateStore(draft => {
      draft.statements = draft.statements.filter(item => {
        return item.id !== id;
      });
      draft.activeId = draft.statements[0] && draft.statements[0].id;
    });
  };
  const isEmpty = statements.length === 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f6f6' }}>
      <div style={{ minHeight: '50px', background: '#fff', padding: '0px 12px', borderBottom: '1px solid #ddd' }}>
        <Header />
        {mode === 'tabs' && queryOptions.length !== 0 && (
          <div style={{ padding: '8px 0px' }}>
            <Segmented options={queryOptions} onChange={handleChangeTab} value={activeId} />
          </div>
        )}
      </div>

      <div style={{ overflowY: 'scroll', flex: '1' }}>
        {isEmpty && (
          <div style={styles.empty}>
            <Empty
              imageStyle={{ width: '80vw', height: '100%' }}
              image="https://img.alicdn.com/imgextra/i3/O1CN01ioBjPd24ALzvMY66U_!!6000000007350-55-tps-915-866.svg"
              description={<div style={styles.empty}>please input your statements and query graph data</div>}
            />
          </div>
        )}
        {statements.map(item => {
          const { id, script } = item;
          return (
            <div
              key={id}
              style={{ ...statementStyles, visibility: id === activeId || mode === 'flow' ? 'visible' : 'hidden' }}
            >
              <Statement
                mode={mode}
                active={id === activeId}
                saved={savedIds.indexOf(id) !== -1}
                id={id}
                script={script}
                onQuery={queryGraphData}
                onClose={onClose}
                onSave={onSave}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Content);
