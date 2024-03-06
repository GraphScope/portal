import React, { useEffect } from 'react';
import Content from './content';
import SavedStatements from './sidebar/saved-statements';
import GPTStatements from './sidebar/gpt-statements';
import RecommendedStatements from './sidebar/recommended-statements';
import StoreProcedure from './sidebar/store-procedure';
import HistoryStatements from './sidebar/history-statements';
import './index.css';
import { useContext, localStorageVars } from './context';
import type { IStatement } from './context';
import Sidebar from './sidebar';
import {
  RedditOutlined,
  DeploymentUnitOutlined,
  DatabaseOutlined,
  BookOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import type { IStudioQueryProps } from './context';
import { v4 as uuidv4 } from 'uuid';
import { getSearchParams, searchParamOf, formatCypherStatement } from './utils';

import Container from './container';

const StudioQuery: React.FunctionComponent<IStudioQueryProps> = props => {
  const {
    queryInfo,
    queryGraphData,
    queryGraphSchema,
    onBack,
    displaySidebarPosition = 'left',
    enableAbsolutePosition,
    /** statements */
    queryStatements,
    deleteStatements,
    createStatements,
    enableImmediateQuery,
    enableCollapseSidebar,
  } = props;
  const { store, updateStore } = useContext();
  const { graphName, isReady, collapse, activeNavbar, statements, schemaData } = store;
  const enable = !!enableAbsolutePosition && statements.length > 0;
  const navbarOptions = [
    {
      id: 'recommended',
      name: 'recommended',
      icon: <DeploymentUnitOutlined />,
      children: <RecommendedStatements schemaData={schemaData} schemaId={graphName} />,
    },
    {
      id: 'saved',
      name: 'saved',
      icon: <BookOutlined />,
      children: <SavedStatements deleteStatements={ids => deleteStatements('saved', ids)} />,
    },
    {
      id: 'history',
      name: 'History',
      icon: <HistoryOutlined />,
      children: <HistoryStatements deleteHistoryStatements={ids => deleteStatements('history', ids)} />,
    },
    {
      id: 'store-procedure',
      name: 'store-procedure',
      icon: <DatabaseOutlined />,
      children: <StoreProcedure deleteStatements={ids => deleteStatements('store-procedure', ids)} />,
    },
    {
      id: 'qwen',
      name: 'qwen',
      icon: <RedditOutlined />,
      children: <GPTStatements schemaData={schemaData} />,
    },
  ];

  useEffect(() => {
    (async () => {
      //@ts-ignore

      const graph_name = searchParamOf('graph_name');
      const activeNavbar = searchParamOf('nav') || 'saved';
      let globalScript = searchParamOf('cypher') || 'Match (n) return n limit 10';
      const displayMode = searchParamOf('display_mode') || localStorage.getItem(localStorageVars.mode) || 'flow';
      let autoRun = searchParamOf('auto_run') === 'true' ? true : false;
      const info = await queryInfo();
      let graphName = info?.graph_name || graph_name || '';
      const schemaData = await queryGraphSchema(graphName);
      const historyStatements = await queryStatements('history');
      const savedStatements = await queryStatements('saved');
      const storeProcedures = await queryStatements('store-procedure');
      const _hack = location.pathname === '/query-app' && location.search === '?graph_algo';
      // 临时的需求，后续删除
      if (_hack) {
        globalScript = `MATCH (p)-[e]-(s) return p,e,s`;
        autoRun = true;
        graphName = `graph_algo`;
      }

      updateStore(draft => {
        draft.isReady = true;
        draft.graphName = graphName;
        draft.schemaData = schemaData;
        draft.historyStatements = historyStatements;
        draft.savedStatements = savedStatements;
        draft.storeProcedures = storeProcedures;
        //@ts-ignore
        draft.activeNavbar = activeNavbar;
        draft.autoRun = autoRun;
        draft.globalScript = formatCypherStatement(globalScript);
        draft.mode = displayMode as 'flow' | 'tabs';
      });
    })();
  }, []);

  const handleChangeNavbar = value => {
    updateStore(draft => {
      if (draft.activeNavbar === value.id) {
        draft.collapse = !draft.collapse;
      } else {
        draft.activeNavbar = value.id;
        draft.collapse = false;
      }
    });
  };
  const handleQuery = (value: IStatement) => {
    /** 查询的时候，就可以存储历史记录了 */
    //@ts-ignore

    const { script, id: statementId } = value;
    const queryId = uuidv4();
    const timestamp = new Date().getTime();
    const params = {
      id: queryId,
      timestamp,
      script,
    };

    console.log('newParams', params);
    updateStore(draft => {
      draft.historyStatements.push(params);
    });
    /** 正式查询 */
    return queryGraphData(params);
  };
  if (enableCollapseSidebar) {
  }

  if (isReady) {
    return (
      <Container
        displaySidebarPosition={displaySidebarPosition}
        enableAbsolutePosition={enable}
        sidebar={
          <Sidebar
            title={graphName}
            options={navbarOptions}
            value={activeNavbar}
            collapse={enableCollapseSidebar && collapse}
            onChange={handleChangeNavbar}
            onBack={onBack}
          />
        }
        content={
          <Content
            createStatements={createStatements}
            queryGraphData={handleQuery}
            enableImmediateQuery={enableImmediateQuery}
          />
        }
        collapse={enableCollapseSidebar && collapse}
      ></Container>
    );
  }
  return null;
};

export default StudioQuery;
