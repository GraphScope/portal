import * as React from 'react';
import { Tag, Typography, theme } from 'antd';
import { transGraphSchema } from '../../../statement/result/graph';
import { getStyleConfig } from '@graphscope/studio-graph';
import { useContext } from '../../context';
import Section from '../section';
import { FormattedMessage } from 'react-intl';

const { Title } = Typography;
const { useToken } = theme;
interface IRecommendedStatementsProps {
  schemaData: any;
  schemaId: string;
}
const getPropertyKeys = (schema: any): string[] => {
  const keys = new Set<string>();

  // 提取节点属性键
  schema.nodes.reduce((acc, item) => acc.concat(item.properties || []), [])
    .forEach(property => Object.keys(property).forEach(key => keys.add(key)));

  // 提取边属性键
  schema.edges.reduce((acc, item) => acc.concat(item.properties || []), [])
    .forEach(property => Object.keys(property).forEach(key => keys.add(key)));

  return [...keys.values()];
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
  const { token } = useToken();
  const { updateStore, store } = useContext();
  const { language } = store;
  const graphSchema = transGraphSchema(schemaData);
  const configMap = getStyleConfig(schemaData, schemaId);
  const { nodes, edges } = schemaData;
  const keys = getPropertyKeys(graphSchema);
  const handleClick = (label: string, type: 'nodes' | 'edges' | 'property') => {
    let script = '';

    if (language === 'cypher') {
      if (type === 'nodes') {
        script = `MATCH (n:${label}) RETURN n LIMIT 25`;
      }
      if (type === 'edges') {
        script = `MATCH (a)-[b:${label}]->(c) RETURN a,b,c LIMIT 25;`;
      }
      if (type === 'property') {
        script = `MATCH(a) where a.${label} IS NOT NULL AND a.${label} <> ""
      WITH a.${label} as ${label}
      RETURN ${label} , COUNT(${label}) as ${label}_COUNT
      ORDER BY ${label}_COUNT DESC
      `;
      }
    }
    if (language === 'gremlin') {
      if (type === 'nodes') {
        script = `g.V().hasLabel('${label}').limit(25)`;
      }
      if (type === 'edges') {
        script = `g.V().outE('${label}').limit(25)`;
      }
      if (type === 'property') {
        script = `g.V().has('${label}').groupCount().by('${label}').order().by(select(values), desc)`;
      }
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
          /** 如果属性中没有color 就报错 */
          const { color } = configMap.nodeStyle[label] ?? { color: '#000' };
          return (
            <Tag
              key={label}
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
          return (
            <Tag
              key={label}
              style={{ borderRadius: '8px', cursor: 'pointer',margin: '4px', color: token.colorText }}
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
              key={item}
              style={{
                borderRadius: '8px',
                cursor: 'pointer',
                margin: '4px',
                color: token.colorText,
              }}
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
