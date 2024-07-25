import * as React from 'react';
import { Typography, Flex, Space } from 'antd';
const { Title } = Typography;
import { FormattedMessage } from 'react-intl';
import Legend from './legend';
import { useContext } from '../../hooks/useContext';
import { Utils } from '@graphscope/studio-components';

interface IOverviewProps {}

const StyleSetting: React.FunctionComponent<IOverviewProps> = props => {
  const { updateStore, store } = useContext();
  const { schema, nodeStyle, edgeStyle, graphId } = store;

  const onChange = value => {
    console.log('value', value);
    const { caption, color, label, size, type } = value;
    updateStore(draft => {
      if (type === 'node') {
        const newNodeStyle = {
          ...draft.nodeStyle,
          [label]: {
            color,
            size,
            caption,
          },
        };
        draft.nodeStyle = newNodeStyle;
        /** 持久化在本地 */
        Utils.storage.set(`GRAPH_${graphId}_STYLE`, {
          nodeStyle: newNodeStyle,
          edgeStyle: { ...draft.edgeStyle },
        });
      }
      if (type === 'edge') {
        const newEdgeStyle = {
          ...draft.edgeStyle,
          [label]: {
            color,
            size,
            caption,
          },
        };
        draft.edgeStyle = newEdgeStyle;
        /** 持久化在本地 */
        Utils.storage.set(`GRAPH_${graphId}_STYLE`, {
          nodeStyle: { ...draft.nodeStyle },
          edgeStyle: newEdgeStyle,
        });
      }
    });
  };
  const NODE_STYLES = schema.nodes.map(item => {
    return {
      ...item,
      style: nodeStyle[item.label],
    };
  });
  const EDGE_STYLES = schema.edges.map(item => {
    return {
      ...item,
      style: edgeStyle[item.label],
    };
  });
  console.log('Node', NODE_STYLES, schema);
  const noSchema = schema.nodes.length === 0 && schema.edges.length === 0;

  return (
    <div>
      <Title level={5} style={{ marginTop: '6px' }}>
        <FormattedMessage id="Vertex Labels" />
      </Title>
      <Space wrap size={[0, 6]}>
        {NODE_STYLES.map(item => {
          const { label, properties, style } = item;
          return (
            <Legend key={label} label={label} properties={properties} {...style} type="node" onChange={onChange} />
          );
        })}
      </Space>
      <Title level={5}>
        <FormattedMessage id="Edge Labels" />
      </Title>
      <Space wrap size={[0, 6]}>
        {EDGE_STYLES.map(item => {
          const { label, properties, style } = item;
          return (
            <Legend key={label} label={label} properties={properties} {...style} type="edge" onChange={onChange} />
          );
        })}
      </Space>
    </div>
  );
};

export default React.memo(StyleSetting);
