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
import { FormattedMessage } from 'react-intl';

import type { IStudioQueryProps } from './context';
import { v4 as uuidv4 } from 'uuid';
import { formatCypherStatement } from './utils';
import { Utils, ThemeProvider, Section } from '@graphscope/studio-components';
const { getSearchParams } = Utils;

import Container from './container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faClockFour, faServer, faRobot, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import locales from '../locales';

const StudioQuery: React.FunctionComponent<IStudioQueryProps> = props => {
  const {
    queryInfo,
    queryGraphData,
    handleCancelQuery,
    queryGraphSchema,
    onBack,
    displaySidebarPosition = 'left',
    displaySidebarType = 'Sidebar',
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
    connectComponent,
  } = props;

  const { store, updateStore } = useContext();
  const { graphId, isReady, collapse, activeNavbar, statements, schemaData, language } = store;
  const enable = !!enableAbsolutePosition && statements.length > 0;

  const navbarOptions = [
    {
      key: 'recommended',
      title: <FormattedMessage id="Recommended" />,
      icon: <FontAwesomeIcon icon={faLightbulb} />, //<DeploymentUnitOutlined />,
      children: <RecommendedStatements schemaData={schemaData} schemaId={graphId} />,
    },
    {
      key: 'saved',
      title: <FormattedMessage id="Saved" />,
      icon: <FontAwesomeIcon icon={faBookmark} />, //  <BookOutlined />,
      children: <SavedStatements deleteStatements={ids => deleteStatements('saved', ids)} />,
    },
    {
      key: 'history',
      title: <FormattedMessage id="History" />,
      icon: <FontAwesomeIcon icon={faClockFour} />, //<HistoryOutlined />,//<FontAwesomeIcon icon={faTimesCircle} />
      children: <HistoryStatements deleteHistoryStatements={ids => deleteStatements('history', ids)} />,
    },
    {
      key: 'store-procedure',
      title: <FormattedMessage id="Stored Procedures" />,
      icon: <FontAwesomeIcon icon={faServer} />, //<DatabaseOutlined />,
      children: <StoreProcedure deleteStatements={ids => deleteStatements('store-procedure', ids)} />,
    },
    {
      key: 'copilot',
      title: <FormattedMessage id="Copilot" />,
      icon: <FontAwesomeIcon icon={faRobot} />, //<RedditOutlined />,
      children: <GPTStatements schemaData={schemaData} />,
    },
  ];

  useEffect(() => {
    (async () => {
      //@ts-ignore

      const graph_name = getSearchParams('graph_name');
      const graphId = getSearchParams('graph_id') || '';
      const activeNavbar = getSearchParams('nav') || 'saved';
      const language = getSearchParams('language') || props.language;
      let globalScript = getSearchParams('global_script') || props.globalScript;
      const displayMode = getSearchParams('display_mode') || localStorage.getItem(localStorageVars.mode) || 'flow';
      let autoRun = getSearchParams('auto_run') === 'true' ? true : false;
      const info = await queryInfo(graphId || '');

      const schemaData = await queryGraphSchema(graphId);
      const historyStatements = await queryStatements('history');
      const savedStatements = await queryStatements('saved');
      const storeProcedures = await queryStatements('store-procedure');
      const _hack = location.pathname === '/query-app' && location.search === '?graph_algo';
      // 临时的需求，后续删除
      if (_hack) {
        globalScript = `MATCH (a)-[b:Belong]->(c) RETURN a,b,c;`;
        autoRun = true;
      }

      updateStore(draft => {
        draft.isReady = true;
        draft.graphId = graphId;
        draft.graphId = graphId;
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
      // storage.set('STUDIO_QUERY_THEME', theme);
    })();
  }, []);

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
    const side =
      displaySidebarPosition === 'left'
        ? {
            leftSide: <Sidebar items={navbarOptions} type={displaySidebarType} />,
          }
        : {
            rightSide: <Sidebar items={navbarOptions} type={displaySidebarType} />,
          };
    return (
      <ThemeProvider locales={locales}>
        <Section
          style={{ height: 'calc(100vh - 50px)' }}
          {...side}
          defaultCollapsed={{
            leftSide: true,
            rightSide: true,
          }}
          leftSideStyle={{
            width: '320px',
            padding: '0px',
          }}
          rightSideStyle={{
            width: '320px',
            padding: '0px',
          }}
          splitBorder
        >
          <Content
            displaySidebarPosition={displaySidebarPosition}
            connectComponent={connectComponent}
            handleCancelQuery={handleCancelQuery}
            createStatements={createStatements}
            queryGraphData={handleQuery}
            enableImmediateQuery={enableImmediateQuery}
          />
        </Section>
      </ThemeProvider>
    );
  }
  return null;
};

export default StudioQuery;
