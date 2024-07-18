import React, { useState, memo, lazy, Suspense, useEffect } from 'react';
// import Statement from '../../statement';
const Statement = lazy(() => import('../../statement'));
// import Header from './header';
const Header = lazy(() => import('./header'));
import { Segmented, theme } from 'antd';
import { useContext } from '../context';
import type { IStatement, IStudioQueryProps } from '../context';
import { PlayCircleOutlined } from '@ant-design/icons';
import Welcome from './welcome';
import Empty from './empty';
interface IContentProps {
  createStatements: IStudioQueryProps['createStatements'];
  queryGraphData: IStudioQueryProps['queryGraphData'];
  handleCancelQuery: IStudioQueryProps['handleCancelQuery'];
  enableImmediateQuery: boolean;
  connectComponent?: IStudioQueryProps['connectComponent'];
  displaySidebarPosition?: IStudioQueryProps['displaySidebarPosition'];
}
const { useToken } = theme;

const Content: React.FunctionComponent<IContentProps> = props => {
  const {
    createStatements,
    queryGraphData,
    enableImmediateQuery,
    handleCancelQuery,
    connectComponent,
    displaySidebarPosition,
  } = props;
  const { store, updateStore } = useContext();
  const { activeId, mode, statements, savedStatements, schemaData, graphId, language, addStatements } = store;
  const savedIds = savedStatements.map(item => item.id);
  const { token } = useToken();

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

  const queryOptions = statements.map((item, index) => {
    return {
      label: `query-${index + 1}`, // item.id,
      value: item.id,
      // icon: <PlayCircleOutlined />,
    };
  });

  const onSave = ({ id, script, name, language }: IStatement) => {
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
        draft.savedStatements.push({ id, script, name, language });
        // fetch server
        createStatements && createStatements('saved', { id, script, name, language });
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
  /** addStatements 只有添加语句滚动至顶部，删除保持原来位置 */
  useEffect(() => {
    document.getElementById('statements-layout')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [addStatements]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          minHeight: '50px',
          background: token.colorBgBase,
          padding: '0px 12px',
          borderBottom: `1px solid ${token.colorBorder}`,
        }}
      >
        <Suspense>
          <Header connectComponent={connectComponent} displaySidebarPosition={displaySidebarPosition} />
        </Suspense>

        {mode === 'tabs' && queryOptions.length !== 0 && (
          <div style={{ overflowX: 'scroll', padding: '8px 0px' }}>
            <Segmented options={queryOptions} onChange={handleChangeTab} value={activeId} />
          </div>
        )}
      </div>

      <div id="statements-layout" style={{ overflowY: 'scroll', flex: '1', position: 'relative' }}>
        {isEmpty && <Empty />}
        <Welcome />
        {statements.map(item => {
          const { id, script, timestamp, language } = item;
          return (
            <div
              key={id}
              style={{
                ...statementStyles,
                visibility: id === activeId || mode === 'flow' ? 'visible' : 'hidden',
                flex: 1,
              }}
            >
              <Suspense>
                <Statement
                  language={language}
                  enableImmediateQuery={enableImmediateQuery}
                  mode={mode}
                  active={id === activeId}
                  id={id}
                  timestamp={timestamp}
                  graphId={graphId}
                  schemaData={schemaData}
                  script={script}
                  onQuery={queryGraphData}
                  onCancel={handleCancelQuery}
                  onClose={onClose}
                  onSave={onSave}
                />
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Content);
