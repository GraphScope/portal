import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import { useContext, IQueryStatement } from '@graphscope/studio-graph';
import { getOptionsBySchema, getOptionsByPath } from './utils';
import type { IbreadcrumbItem, ISearchbarState } from './index';
export interface IQuerySavedStatements {
  id: 'querySavedStaments';
  query: () => Promise<any>;
}
interface ICascaderSearchProps {
  breadcrumb: IbreadcrumbItem[];
  updateState: React.Dispatch<React.SetStateAction<ISearchbarState>>;
}

const CascaderSearch: React.FC<ICascaderSearchProps> = props => {
  const { breadcrumb, updateState } = props;
  const { store, updateStore } = useContext();
  const { schema, getService, nodeStyle, edgeStyle } = store;
  const [statements, setStatements] = useState<{ name: string; script: string }[]>([]);
  const options = getOptionsBySchema({ schema, statements, nodeStyle, edgeStyle });
  const _options = getOptionsByPath(
    options,
    breadcrumb.map(item => item.value),
  );
  useEffect(() => {
    (async () => {
      const savedStatements = await getService<IQuerySavedStatements>('querySavedStaments')();
      setStatements(savedStatements);
    })();
  }, []);

  const handleClick = async item => {
    const { children, value, label, type, meta } = item;
    updateState(preState => {
      return {
        ...preState,
        breadcrumb: [...preState.breadcrumb, { value, label, type, meta }],
      };
    });
    if (!children || children.length === 0) {
      if (!type) {
        updateStore(draft => {
          draft.isLoading = true;
        });
        //statements 没有type
        const data = await getService<IQueryStatement>('queryStatement')(value);
        updateStore(draft => {
          draft.data = data;
          draft.isLoading = false;
        });
      }
      return;
    }
  };
  if (_options.length === 0) {
    return null;
  }
  return (
    <List
      dataSource={_options}
      renderItem={item => {
        //@ts-ignore
        const { label } = item;
        return (
          <List.Item className="search-list-item" onClick={() => handleClick(item)}>
            {label}
          </List.Item>
        );
      }}
    />
  );
};

export default CascaderSearch;
