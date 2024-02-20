import React, { useEffect } from 'react';
import Content from './content';
import SavedStatements from './sidebar/saved-statements';
import GPTStatements from './sidebar/gpt-statements';
import RecommendedStatements from './sidebar/recommended-statements';
import StoreProcedure from './sidebar/store-procedure';
import HistoryStatements from './sidebar/history-statements';
import './index.less';
import { useContext } from './context';
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
  } = props;
  const { store, updateStore } = useContext();
  const { graphName, isReady, collapse, activeNavbar, statements } = store;
  const enable = !!enableAbsolutePosition && statements.length > 0;
  const navbarOptions = [
    {
      id: 'recommended',
      name: 'recommended',
      icon: <DeploymentUnitOutlined />,
      children: <RecommendedStatements />,
    },
    {
      id: 'saved',
      name: 'saved',
      icon: <BookOutlined />,
      children: <SavedStatements />,
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
      children: <StoreProcedure />,
    },
    {
      id: 'qwen',
      name: 'qwen',
      icon: <RedditOutlined />,
      children: <GPTStatements />,
    },
  ];

  console.log("searchParamOf('nav')", searchParamOf('nav'));
  useEffect(() => {
    (async () => {
      //@ts-ignore

      const graphName = searchParamOf('graph_name');
      const activeNavbar = searchParamOf('nav') || 'saved';
      const globalScript = searchParamOf('cypher') || 'Match (n) return n limit 10';

      const displayMode = (searchParamOf('display_mode') || 'flow') as 'flow' | 'tabs';
      const autoRun = searchParamOf('auto_run') === 'true' ? true : false;

      const info = await queryInfo();
      const schemaData = await queryGraphSchema(info.name);
      const historyStatements = await queryStatements('history');
      const savedStatements = await queryStatements('saved');
      const storeProcedures = await queryStatements('store-procedure');
      console.log(globalScript);
      console.log(formatCypherStatement(globalScript));

      updateStore(draft => {
        draft.isReady = true;
        draft.graphName = graphName || info.name;
        draft.schemaData = schemaData;
        draft.historyStatements = historyStatements;
        draft.savedStatements = savedStatements;
        draft.storeProcedures = storeProcedures;
        //@ts-ignore
        draft.activeNavbar = activeNavbar;
        draft.autoRun = autoRun;
        draft.globalScript = formatCypherStatement(globalScript);
        draft.mode = displayMode;
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
            collapse={collapse}
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
        collapse={collapse}
      ></Container>
    );
  }
  return null;
};

export default StudioQuery;
