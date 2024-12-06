import { Flex, Typography, theme, Divider } from 'antd';
import * as React from 'react';
import type { NodeData, EdgeData } from '../../index';
import { useContext } from '../../index';

import Legend from '../StyleSetting/legend';
import { Utils } from '@graphscope/studio-components';

interface IPropertyInfoProps {
  data: EdgeData | NodeData;
  style: React.CSSProperties;
  type: 'node' | 'edge';
}

const PropertyInfo: React.FunctionComponent<IPropertyInfoProps> = props => {
  const { data, style, type } = props;
  const { store, updateStore } = useContext();
  const { nodeStyle } = store;

  const { id, label, properties = {}, source, target } = data as EdgeData;
  const elementStyle = nodeStyle[id] || nodeStyle[label];
  const title = type === 'node' ? 'Vertex Properties' : 'Edge Properties';

  const onChange = val => {
    const { properties, ...params } = val;
    updateStore(draft => {
      const newNodeStyle = {
        ...draft.nodeStyle,
        [id]: params,
      };
      draft.nodeStyle = newNodeStyle;
      Utils.storage.set(`GRAPH_${store.graphId}_STYLE`, {
        nodeStyle: newNodeStyle,
        edgeStyle: { ...draft.edgeStyle },
      });
    });
  };

  return (
    <Flex style={style} vertical gap={12}>
      <Typography.Title level={5} style={{ margin: '0px' }}>
        {title}
      </Typography.Title>
      {/* <Divider style={{ margin: '0px' }} /> */}
      <Flex justify="space-between">
        <Typography.Text type="secondary" italic>
          id
        </Typography.Text>
        <Typography.Text italic>{id}</Typography.Text>
      </Flex>
      <Flex justify="space-between">
        <Typography.Text type="secondary" italic>
          label
        </Typography.Text>
        <Legend
          {...elementStyle}
          label={label}
          type={type as 'node' | 'edge'}
          //@ts-ignore
          properties={properties}
          onChange={onChange}
        />
      </Flex>
      {source && (
        <Flex justify="space-between">
          <Typography.Text type="secondary" italic>
            source
          </Typography.Text>
          <Typography.Text italic>{source}</Typography.Text>
        </Flex>
      )}
      {target && (
        <Flex justify="space-between">
          <Typography.Text type="secondary" italic>
            target
          </Typography.Text>
          <Typography.Text italic>{target}</Typography.Text>
        </Flex>
      )}
      <Divider style={{ margin: '0px' }} />

      <Flex vertical gap={12}>
        {Object.keys(properties).map(key => {
          return (
            <Flex key={key} vertical gap={6}>
              <Typography.Text type="secondary">{key}</Typography.Text>
              <Typography.Text>{properties[key] || '-'}</Typography.Text>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default PropertyInfo;
