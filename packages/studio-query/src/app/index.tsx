import React, { useEffect } from 'react';
import Content from './content';
import SavedStatements from './sidebar/saved-statements';
import GPTStatements from './sidebar/gpt-statements';
import RecommendedStatements from './sidebar/recommended-statements';
import StoreProcedure from './sidebar/store-procedure';
import './index.less';
import { useContext } from './context';
import type { IStatement } from './context';
import Sidebar from './sidebar';
import {
  RedditOutlined,
  DeploymentUnitOutlined,
  DatabaseOutlined,
  BgColorsOutlined,
  BranchesOutlined,
  BookOutlined,
} from '@ant-design/icons';
import type { IStudioQueryProps } from './context';
import Container from './container';
export const navbarOptions = [
  {
    id: 'saved',
    name: 'saved',
    icon: <BookOutlined />,
    children: <SavedStatements />,
  },
  {
    id: 'recommended',
    name: 'recommended',
    icon: <DeploymentUnitOutlined />,
    children: <RecommendedStatements />,
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

const StudioQuery: React.FunctionComponent<IStudioQueryProps> = props => {
  const { queryInfo, createStatement, queryGraphData, onBack, displaySidebarPosition } = props;
  const { store, updateStore } = useContext();
  const { graphName, isReady, collapse, activeNavbar } = store;

  useEffect(() => {
    (async () => {
      const info = await queryInfo();
      updateStore(draft => {
        draft.isReady = true;
        draft.graphName = info.name;
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

  if (isReady) {
    return (
      <Container
        displaySidebarPosition={displaySidebarPosition}
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
        content={<Content createStatement={createStatement} queryGraphData={queryGraphData} />}
        collapse={collapse}
      ></Container>
    );
  }
  return null;
};

export default StudioQuery;
