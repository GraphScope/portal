import React, { useEffect, useState } from 'react';
import { Flex, Input, Skeleton, List, Divider, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';
import Highlighter from 'react-highlight-words';
import './index.css';
import { useContext } from '@graphscope/studio-graph';
import { IQueryServices } from '../../service';

const { getSearchParams, debounce } = Utils;
interface ISearchbarProps {
  queryCypher: IQueryServices['queryCypher'];
}

const Searchbar: React.FunctionComponent<ISearchbarProps> = props => {
  const { store, updateStore } = useContext();
  const { emitter } = store;
  const { queryCypher } = props;
  const [state, setState] = useState({
    isLoading: false,
    words: '',
    lists: [],
    nodes: [],
  });
  useEffect(() => {
    const handleClear = () => {
      setState(preState => {
        return {
          ...preState,
          words: '',
        };
      });
    };
    if (emitter) {
      emitter.on('canvas:click', handleClear);
    }
    return () => {
      emitter?.off('canvas:click', handleClear);
    };
  }, [emitter]);
  const onChange = async e => {
    const { value } = e.target;

    setState(preState => {
      return {
        ...preState,
        isLoading: true,
        words: value,
      };
    });

    const script = `match (p: Paper) where p.title CONTAINS "${value}" return p `;
    const data = await queryCypher({ script });

    setState(preState => {
      return {
        ...preState,
        isLoading: false,

        lists: data.nodes.map(item => {
          const { id, properties } = item;
          return {
            id,
            title: properties.title,
          };
        }),
        nodes: data.nodes,
      };
    });
    return data;
  };
  const { isLoading, words, lists } = state;

  const handleClick = id => {
    const node = state.nodes.find((item: any) => item.id === id);
    updateStore(draft => {
      draft.data.nodes = Utils.uniqueElementsBy([...draft.data.nodes, node], (a, b) => {
        return a.id === b.id;
      });
    });
  };

  const onClick = e => {
    onChange(e);
  };

  return (
    <Flex justify="center" vertical gap={8}>
      <Input
        variant="borderless"
        placeholder="Search for a paper..."
        style={{ width: '100%' }}
        onChange={debounce(onChange, 500)}
        onClick={onClick}
        suffix={
          <SearchOutlined
            style={
              {
                // color: 'rgba(0,0,0,.45)'
              }
            }
          />
        }
      />
      {words.length !== 0 && (
        <Flex justify="center" vertical style={{ padding: '0px 12px 12px 12px' }}>
          <>
            <Divider style={{ margin: '0px' }} />
            <Spin tip="Searching..." spinning={isLoading}>
              <List
                pagination={{ position: 'bottom', align: 'end', size: 'small' }}
                dataSource={lists}
                renderItem={item => {
                  const { id, title } = item;
                  return (
                    <List.Item className="search-list-item" onClick={() => handleClick(id)}>
                      <Highlighter searchWords={[words]} autoEscape={true} textToHighlight={title} />
                    </List.Item>
                  );
                }}
              />
            </Spin>
          </>
        </Flex>
      )}
    </Flex>
  );
};

export default Searchbar;
