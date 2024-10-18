import * as React from 'react';
import { Typography, Flex, Space } from 'antd';
const { Title, Text } = Typography;
import { FormattedMessage } from 'react-intl';
import Legend from './legend';
import { useContext } from '../../hooks/useContext';
import { Utils } from '@graphscope/studio-components';
import { InfoCircleOutlined } from '@ant-design/icons';

interface IOverviewProps {
  showHeader?: boolean;
}

const StyleSetting: React.FunctionComponent<IOverviewProps> = props => {
  const { updateStore, store } = useContext();
  const { schema, nodeStyle, edgeStyle, graphId } = store;
  const { showHeader } = props;

  const onChange = value => {
    console.log('value', value);
    const { caption, color, label, size, type, captionStatus } = value;
    updateStore(draft => {
      if (type === 'node') {
        const newNodeStyle = {
          ...draft.nodeStyle,
          [label]: {
            color,
            size,
            caption,
            captionStatus,
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
            captionStatus,
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

  return (
    <Flex vertical gap={12}>
      {showHeader && (
        <Title level={3} style={{ margin: '0px' }}>
          <FormattedMessage id="Style Setting" />
        </Title>
      )}
      <Text type="secondary">
        You can click on each label to set the color, size, and display text for vertices and edges.
      </Text>

      <Title level={5} style={{ margin: '0px' }}>
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
      <Title level={5} style={{ margin: '0px' }}>
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
    </Flex>
  );
};

export default React.memo(StyleSetting);
