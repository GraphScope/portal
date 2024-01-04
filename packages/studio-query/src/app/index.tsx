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

interface Info {
  name: string;
  connect_url: string;
  home_url: string;
}

interface IGraphData {
  nodes: { id: string; label: string; properties: { [key: string]: any } }[];
  edges: { id: string; label: string; properties: { [key: string]: any }; source: string; target: string }[];
}
interface IGraphSchema {
  nodes: { id: string; label: string; properties: { [key: string]: any } }[];
  edges: { id: string; label: string; properties: { [key: string]: any }; source: string; target: string }[];
}
interface IStudioQueryProps {
  queryInfo: () => Promise<Info>;
  /**  查询语句列表 */
  queryStatement: () => Promise<IStatement[]>;
  /**  更新语句 */
  updateStatement: (statement: IStatement) => Promise<IStatement>;
  /** 创建语句 */
  createStatement: (statement: IStatement) => Promise<IStatement>;
  /** 删除语句 */
  deleteStatement: (id: string) => Promise<boolean>;
  /** 查询图数据 */
  queryGraphData: (params: { statement: IStatement; instanceId: string }) => Promise<IGraphData>;
  /** 查询Schema */
  queryGraphSchema: (instanceId: string) => Promise<IGraphSchema>;
  /** 语句的类型 */
  type: 'gremlin' | 'cypher' | 'iso_gql';
}

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
  const { queryInfo } = props;
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
          <Content />
        </div>
      </div>
    );
  }
  return null;
};

export default StudioQuery;
