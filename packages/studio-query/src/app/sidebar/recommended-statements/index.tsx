import * as React from 'react';
import { Tag, Typography, Flex } from 'antd';
import { transGraphSchema } from '../../../statement/result/graph';
import { getConfig } from '../../../graph/utils';
import { useContext } from '../../context';
const { Title, Text } = Typography;
import Section from '../section';
import { FormattedMessage } from 'react-intl';
interface IRecommendedStatementsProps {
  schemaData: any;
  schemaId: string;
}
const getPropertyKeys = schema => {
  const keys = new Set();
  schema.nodes.forEach(item => {
    Object.keys(item.properties || {}).forEach(key => {
      keys.add(key);
    });
  });
  schema.edges.forEach(item => {
    Object.keys(item.properties || {}).forEach(key => {
      keys.add(key);
    });
  });
  return [...keys.values()] as string[];
};

const styles = {
  title: {
    marginTop: '12px',
    fontSize: '14px',
    fontWeight: 400,
  },
};
const RecommendedStatements: React.FunctionComponent<IRecommendedStatementsProps> = props => {
  const { schemaData, schemaId } = props;
  const { updateStore } = useContext();
  const graphSchema = transGraphSchema(schemaData);
  const configMap = getConfig(schemaData, schemaId);
  const { nodes, edges } = schemaData;
  const keys = getPropertyKeys(graphSchema);

  const handleClick = (label: string, type: 'nodes' | 'edges' | 'property') => {
    let script = '';
    if (type === 'nodes') {
      script = `MATCH (n:${label}) RETURN n LIMIT 25`;
    }
    if (type === 'edges') {
      script = `MATCH (a)-[b:${label}]->(c) RETURN a,b,c LIMIT 25;`;
    }
    if (type === 'property') {
      script = `MATCH(a) where a.${label} IS NOT NULL return a.${label}`;
    }
    updateStore(draft => {
      draft.globalScript = script;
      draft.autoRun = true;
    });
  };
  return (
    <Section title="Recommended">
      <div style={{ padding: '0px 12px' }}>
        <Title level={5} style={styles.title}>
          <FormattedMessage id="Vertex Labels" />
        </Title>
        {nodes.map(item => {
          const { label } = item;
          const { color } = configMap.get(label) || { color: '#ddd' };
          return (
            <Tag
              style={{ borderRadius: '8px', backgroundColor: color, cursor: 'pointer', margin: '4px' }}
              bordered={false}
              onClick={() => {
                handleClick(label, 'nodes');
              }}
            >
              {label}
            </Tag>
          );
        })}
        <Title level={5} style={styles.title}>
          <FormattedMessage id="Edge Labels" />
        </Title>
        {edges.map(item => {
          const { label } = item;
          const { color } = configMap.get(label) || { color: '#ddd' };
          return (
            <Tag
              style={{ borderRadius: '8px', backgroundColor: color, cursor: 'pointer', margin: '4px' }}
              bordered={false}
              onClick={() => {
                handleClick(label, 'edges');
              }}
            >
              {label}
            </Tag>
          );
        })}
        <Title style={styles.title}>
          <FormattedMessage id="Property Keys" />
        </Title>
        {keys.map(item => {
          return (
            <Tag
              style={{ borderRadius: '8px', backgroundColor: '#000', cursor: 'pointer', margin: '4px', color: '#fff' }}
              bordered={false}
              onClick={() => {
                handleClick(item, 'property');
              }}
            >
              {item}
            </Tag>
          );
        })}
      </div>
    </Section>
  );
};

export default RecommendedStatements;
