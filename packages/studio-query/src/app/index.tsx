import React, { useEffect } from 'react';
import Content from './content';
import SavedStatements from './sidebar/saved-statements';
import GPTStatements from './sidebar/gpt-statements';
import RecommendedStatements from './sidebar/recommended-statements';
import StoreProcedure from './sidebar/store-procedure';
import HistoryStatements from './sidebar/history-statements';
import { useContext, localStorageVars } from './context';
import type { IStatement } from './context';
import Sidebar from './sidebar';
import Provider from './provider';
import { FormattedMessage } from 'react-intl';

import type { IStudioQueryProps } from './context';
import { v4 as uuidv4 } from 'uuid';
import { searchParamOf, formatCypherStatement } from './utils';
import { storage } from '../graph/utils';

import Container from './container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faClockFour, faServer, faRobot, faLightbulb } from '@fortawesome/free-solid-svg-icons';

const StudioQuery: React.FunctionComponent<IStudioQueryProps> = props => {
  const {
    queryInfo,
    queryGraphData,
    handleCancelQuery,
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
    logo,
    locale = 'zh-CN',
    theme,
  } = props;

  const { store, updateStore } = useContext();
  const { graphName, isReady, collapse, activeNavbar, statements, schemaData, language } = store;
  const enable = !!enableAbsolutePosition && statements.length > 0;
  const navbarOptions = [
    {
      id: 'recommended',
      name: <FormattedMessage id="Recommended" />,
      icon: <FontAwesomeIcon icon={faLightbulb} />, //<DeploymentUnitOutlined />,
      children: <RecommendedStatements schemaData={schemaData} schemaId={graphName} />,
    },
    {
      id: 'saved',
      name: <FormattedMessage id="Saved" />,
      icon: <FontAwesomeIcon icon={faBookmark} />, //  <BookOutlined />,
      children: <SavedStatements deleteStatements={ids => deleteStatements('saved', ids)} />,
    },
    {
      id: 'history',
      name: <FormattedMessage id="History" />,
      icon: <FontAwesomeIcon icon={faClockFour} />, //<HistoryOutlined />,//<FontAwesomeIcon icon={faTimesCircle} />
      children: <HistoryStatements deleteHistoryStatements={ids => deleteStatements('history', ids)} />,
    },
    {
      id: 'store-procedure',
      name: <FormattedMessage id="Stored Procedures" />,
      icon: <FontAwesomeIcon icon={faServer} />, //<DatabaseOutlined />,
      children: <StoreProcedure deleteStatements={ids => deleteStatements('store-procedure', ids)} />,
    },
    {
      id: 'copilot',
      name: <FormattedMessage id="Copilot" />,
      icon: <FontAwesomeIcon icon={faRobot} />, //<RedditOutlined />,
      children: <GPTStatements schemaData={schemaData} />,
    },
  ];

  useEffect(() => {
    (async () => {
      //@ts-ignore

      const graph_name = searchParamOf('graph_name');
      const activeNavbar = searchParamOf('nav') || 'saved';
      const language = searchParamOf('language') || props.language;
      let globalScript = searchParamOf('global_script') || props.globalScript;
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
        globalScript = `MATCH (a)-[b:Belong]->(c) RETURN a,b,c;`;
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
        draft.language = language as 'gremlin' | 'cypher';
      });

      storage.set('STUDIO_QUERY_THEME', theme);
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

    const { script, id: statementId, language } = value;
    const queryId = uuidv4();
    const timestamp = new Date().getTime();
    const params = {
      id: queryId,
      timestamp,
      script,
      language,
    };

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
      <Provider locale={locale} theme={theme}>
        <Container
          displaySidebarPosition={displaySidebarPosition}
          enableAbsolutePosition={enable}
          sidebar={
            <Sidebar
              logo={logo}
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
              handleCancelQuery={handleCancelQuery}
              createStatements={createStatements}
              queryGraphData={handleQuery}
              enableImmediateQuery={enableImmediateQuery}
            />
          }
          collapse={enableCollapseSidebar && collapse}
        ></Container>
      </Provider>
    );
  }
  return null;
};

export default StudioQuery;
