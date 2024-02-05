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

import Container from './container';

const StudioQuery: React.FunctionComponent<IStudioQueryProps> = props => {
  const {
    queryInfo,
    createStatement,
    queryGraphData,
    queryGraphSchema,
    onBack,
    displaySidebarPosition = 'left',
    enableAbsolutePosition,
    /** statements */
    queryHistoryStatements = () => [],
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
      children: <HistoryStatements />,
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

  useEffect(() => {
    (async () => {
      const info = await queryInfo();
      const schemaData = await queryGraphSchema(info.name);
      const historyStatements = await queryHistoryStatements('');

      updateStore(draft => {
        draft.isReady = true;
        draft.graphName = info.name;
        draft.schemaData = schemaData;
        //@ts-ignore
        draft.historyStatements = historyStatements;
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
  const handleQuery = (params: IStatement) => {
    /** 查询的时候，就可以存储历史记录了 */
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
            createStatement={createStatement}
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
