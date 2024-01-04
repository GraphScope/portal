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
import { AppstoreOutlined, BgColorsOutlined, BranchesOutlined } from '@ant-design/icons';
import type { IStudioQueryProps } from './context';
export const navbarOptions = [
  {
    id: 'saved',
    name: 'saved',
    icon: <BgColorsOutlined />,
    children: <SavedStatements />,
  },
  {
    id: 'recommended',
    name: 'recommended',
    icon: <BranchesOutlined />,
    children: <RecommendedStatements />,
  },
  {
    id: 'store-procedure',
    name: 'store-procedure',
    icon: <AppstoreOutlined />,
    children: <StoreProcedure />,
  },
  {
    id: 'qwen',
    name: 'qwen',
    icon: <AppstoreOutlined />,
    children: <GPTStatements />,
  },
];

const StudioQuery: React.FunctionComponent<IStudioQueryProps> = props => {
  const { queryInfo, createStatement, queryGraphData } = props;
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
      <div>
        <Sidebar
          title={graphName}
          options={navbarOptions}
          value={activeNavbar}
          collapse={collapse}
          onChange={handleChangeNavbar}
        />
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: collapse ? '50px' : '300px',
            right: '0px',
            bottom: '0px',
            background: '#f1f1f1',
            transition: 'left ease 0.3s',
          }}
        >
          <Content createStatement={createStatement} queryGraphData={queryGraphData} />
        </div>
      </div>
    );
  }
  return null;
};

export default StudioQuery;
