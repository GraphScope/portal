import React, { useState } from 'react';
import { Select } from 'antd';
import { useContext, useCluster } from '@graphscope/studio-graph';
import { query } from '../FetchGraph/service';
import { Utils } from '@graphscope/studio-components';
import { LikeOutlined } from '@ant-design/icons';
interface IFilterClusterProps {}

export function get(obj, path) {
  if (obj == null || typeof path !== 'string') return undefined;

  let keys = 0,
    key = '',
    len = path.length,
    result = obj;

  while (keys < len) {
    const char = path[keys];
    if (char === '.') {
      result = result[key];
      if (result == null) return undefined;
      key = '';
    } else {
      key += char;
    }
    keys++;
  }

  return result[key];
}

const FilterCluster: React.FunctionComponent<IFilterClusterProps> = props => {
  const { store, updateStore } = useContext();
  const { source } = store;
  const [state, setState] = useState({
    options: [],
  });
  const { options } = state;

  const { enableCluster } = useCluster();
  React.useEffect(() => {
    const entityId = Utils.getSearchParams('entityId') || '';
    const groups = Utils.groupBy(source.nodes, node => {
      return get(node, 'properties.cluster_id');
    });
    console.log(groups);
    query({
      name: entityId,
      type: 'cluster',
    }).then(res => {
      console.log('res', res);
      const topIds = res.map(item => item.cluster_id);
      const topOptions = res.map(item => {
        return {
          label: (
            <>
              <LikeOutlined style={{ color: 'lightgreen', marginRight: '8px' }} /> {item.cluster_id}
            </>
          ),
          value: item.cluster_id,
        };
      });
      const options = Object.keys(groups)
        .map(key => {
          console.log(key);
          return {
            label: key,
            value: key,
          };
        })
        .filter(item => {
          return topIds.indexOf(item.value) === -1;
        });
      //@ts-ignore
      setState(preState => {
        return {
          ...preState,
          options: [...topOptions, ...options],
        };
      });
    });
  }, [source]);

  const handleChange = (ids: string[]) => {
    console.log(ids);
    if (ids.length === 0) {
      updateStore(draft => {
        //@ts-ignore
        draft.data = source;
      });
      return;
    }
    const validNodes = new Set();
    const newNodes = source.nodes.filter(item => {
      //@ts-ignore
      const { cluster_id = '' } = item.properties;
      const match = ids.indexOf(cluster_id) !== -1;
      if (match) {
        validNodes.add(item.id);
        return true;
      }
    });
    const newEdges = source.edges.filter(item => {
      const { source, target } = item;
      const match = validNodes.has(source) && validNodes.has(target);
      if (match) {
        return true;
      }
    });
    updateStore(draft => {
      draft.data = {
        nodes: newNodes,
        edges: newEdges,
      };
    });
    console.log('newNodes', newNodes, newEdges);
  };
  return (
    <Select
      mode="multiple"
      placeholder="Please select cluster"
      defaultValue={[]}
      onChange={handleChange}
      style={{ width: '100%' }}
      options={options}
    />
  );
};

export default FilterCluster;
