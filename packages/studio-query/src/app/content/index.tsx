import React, { useState, memo } from 'react';
import Statement from '../../statement';
import Header from './header';
import { Segmented } from 'antd';
import { useContext } from '../context';
import type { IStudioQueryProps } from '../context';
import Empty from './empty';
interface IContentProps {
  createStatements: IStudioQueryProps['createStatements'];
  queryGraphData: IStudioQueryProps['queryGraphData'];
  enableImmediateQuery: boolean;
}

const Content: React.FunctionComponent<IContentProps> = props => {
  const { createStatements, queryGraphData, enableImmediateQuery } = props;
  const { store, updateStore } = useContext();
  const { activeId, mode, statements, savedStatements, schemaData, graphName } = store;
  const savedIds = savedStatements.map(item => item.id);

  const statementStyles =
    mode === 'tabs'
      ? ({
          position: 'absolute',
          width: '100%',
        } as React.CSSProperties)
      : ({} as React.CSSProperties);
  const handleChangeTab = value => {
    updateStore(draft => {
      draft.activeId = value;
    });
  };

  React.useEffect(() => {}, []);

  const queryOptions = statements.map(item => {
    return {
      label: item.id,
      value: item.id,
    };
  });

  const onSave = ({ id, script, name }) => {
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
        draft.savedStatements.push({ id, script, name });
        // fetch server
        createStatements && createStatements('saved', { id, script, name });
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ minHeight: '50px', background: '#fff', padding: '0px 12px', borderBottom: '1px solid #ddd' }}>
        <Header />
        {mode === 'tabs' && queryOptions.length !== 0 && (
          <div style={{ padding: '8px 0px' }}>
            <Segmented options={queryOptions} onChange={handleChangeTab} value={activeId} />
          </div>
        )}
      </div>

      <div style={{ overflowY: 'scroll', flex: '1', position: 'relative' }}>
        {isEmpty && <Empty />}
        {statements.map(item => {
          const { id, script, timestamp } = item;
          return (
            <div
              key={id}
              style={{
                ...statementStyles,
                visibility: id === activeId || mode === 'flow' ? 'visible' : 'hidden',
                flex: 1,
              }}
            >
              <Statement
                enableImmediateQuery={enableImmediateQuery}
                mode={mode}
                active={id === activeId}
                saved={savedIds.indexOf(id) !== -1}
                id={id}
                timestamp={timestamp}
                graphName={graphName}
                schemaData={schemaData}
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
