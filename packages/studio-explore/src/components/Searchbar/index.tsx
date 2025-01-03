import React, { useEffect, useState } from 'react';

import { Flex, Input, List, Divider, Spin, Space, Tag, Button, theme } from 'antd';
import { SearchOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Utils, useDynamicStyle } from '@graphscope/studio-components';
import Highlighter from 'react-highlight-words';
import { useContext, GraphData, useApis } from '@graphscope/studio-graph';
import CascaderSearch from './CascaderSearch';
import cssStyle from './css';
import PropertyChart from './PropertyChart';

const { debounce } = Utils;
interface ISearchbarProps {}

export interface IbreadcrumbItem {
  meta?: { color?: string; icon?: React.ReactNode };
  label: React.ReactNode;
  value: string;
  type: 'type' | 'label' | 'property';
}
export interface IQuerySearch {
  id: 'querySearch';
  query: (params: { config: IbreadcrumbItem[]; value: string }) => Promise<any>;
}

export interface ISearchbarState {
  isLoading: boolean;
  words: string;
  lists: any[];
  onEnter: boolean;
  onLeave: boolean;
  breadcrumb: IbreadcrumbItem[];
  data: GraphData;
}
const Searchbar: React.FunctionComponent<ISearchbarProps> = props => {
  const { store, updateStore } = useContext();
  const { emitter, getService } = store;
  const { token } = theme.useToken();
  const { focusNodes } = useApis();

  useDynamicStyle(
    `
    .search-list-item {
        cursor:pointer;
    }
    .search-list-item:hover {
        background-color: ${token.colorBgTextHover};
        cursor: pointer;
    }
    `,
    'explore-search-bar',
  );
  const [state, setState] = useState<ISearchbarState>({
    isLoading: false,
    words: '',
    lists: [],
    onEnter: false,
    onLeave: false,
    breadcrumb: [],
    data: {
      nodes: [],
      edges: [],
    },
  });
  const { breadcrumb } = state;
  const handleClear = () => {
    setState(preState => {
      return {
        ...preState,
        words: '',
        onEnter: false,
        onLeave: true,
      };
    });
  };
  useEffect(() => {
    if (emitter) {
      emitter.on('canvas:click', handleClear);
    }
    return () => {
      emitter?.off('canvas:click', handleClear);
    };
  }, [emitter]);
  const onChange = async e => {
    const { value } = e.target;
    if (value === '') {
      if (words === '') {
        return;
      }
      setState(preState => {
        return {
          ...preState,
          isLoading: false,
          words: value,
        };
      });
      return;
    }

    setState(preState => {
      return {
        ...preState,
        isLoading: true,
        words: value,
      };
    });

    const data = await getService<IQuerySearch>('querySearch')({
      config: breadcrumb,
      value,
    });
    const { value: property } = breadcrumb.find(item => item.type === 'property') || { value: '' };

    setState(preState => {
      return {
        ...preState,
        isLoading: false,
        lists: data.nodes.map(item => {
          const { id, properties } = item;
          return {
            id,
            title: properties[property],
          };
        }),
        data: data,
      };
    });
    return data;
  };
  const { isLoading, words, lists } = state;

  const handleClick = id => {
    const node = state.data.nodes.find((item: any) => item.id === id);
    updateStore(draft => {
      const _nodes = Utils.uniqueElementsBy([...draft.data.nodes, node], (a, b) => {
        return a.id === b.id;
      });
      draft.data.nodes = _nodes;
      draft.source.nodes = _nodes;
      if (node) {
        draft.selectNodes = [node];
        draft.nodeStatus = {
          [node.id]: {
            selected: true,
          },
        };
        focusNodes([node.id]);
      }
    });
    handleClear();
  };

  const onClick = e => {
    setState(preState => {
      return {
        ...preState,
        onEnter: true,
      };
    });
    onChange(e);
  };
  const handleCloseTag = e => {
    setState(preState => {
      return {
        ...preState,
        breadcrumb: preState.breadcrumb.filter(item => item !== e),
        lists: [],
      };
    });
  };
  const handleQuery = async () => {
    updateStore(draft => {
      draft.isLoading = true;
    });
    const data = await getService<IQuerySearch>('querySearch')({
      config: breadcrumb,
      value: '',
    });

    updateStore(draft => {
      draft.source = data;
      draft.data = data;
      draft.isLoading = false;
    });
    focusNodes(data.nodes.map(item => item.id));
  };
  const prefix = (
    <Space size="small">
      {breadcrumb.map(item => {
        const { meta = {}, value } = item;

        return (
          <Tag
            {...meta}
            bordered={false}
            closable
            key={value}
            onClose={() => {
              handleCloseTag(item);
            }}
          >
            {value}
          </Tag>
        );
      })}
    </Space>
  );

  return (
    <Flex justify="center" vertical gap={8}>
      <Input
        variant="borderless"
        placeholder="Search for graph data..."
        style={{ width: '100%' }}
        onChange={debounce(onChange, 500)}
        onPressEnter={handleQuery}
        onClick={onClick}
        prefix={prefix}
        suffix={<Button onClick={handleQuery} icon={<PlayCircleOutlined />} type="text" />}
      />

      {state.onEnter && (
        <Flex
          justify="center"
          vertical
          style={{ padding: '0px 12px 12px 12px', overflowY: 'scroll', maxHeight: '80vh' }}
        >
          <>
            <Divider style={{ margin: '0px' }} />
            <CascaderSearch breadcrumb={breadcrumb} updateState={setState} />
            {words.length > 0 && lists.length > 0 && (
              <Spin tip="Searching..." spinning={isLoading}>
                <List
                  pagination={{ position: 'bottom', align: 'end', size: 'small' }}
                  dataSource={lists}
                  renderItem={item => {
                    //@ts-ignore
                    const { id, title } = item;
                    return (
                      <List.Item className="search-list-item" onClick={() => handleClick(id)}>
                        <Highlighter searchWords={[words]} autoEscape={true} textToHighlight={title} />
                      </List.Item>
                    );
                  }}
                />
              </Spin>
            )}
            {state.breadcrumb.length === 3 && words === '' && (
              <Flex style={{ padding: '12px 0px' }} vertical>
                <PropertyChart label={breadcrumb[1].value} property={breadcrumb[2].value} />
              </Flex>
            )}
          </>
        </Flex>
      )}
    </Flex>
  );
};

export default Searchbar;
