import { Message } from './message';
type GraphSchemaData = any;

const CYPHER_QUERY_EXAMPLE = `

Query Example:
Positive Example:
MATCH (p:Paper)-[r:Paper_Has_Challenge]->(c:Challenge)
OPTIONAL MATCH (p)-[:Paper_Has_Solution]->(s:Solution)
RETURN p.title AS paper_title, c.name AS challenge_name, s.name AS solution_name, c.description AS challenge_description, s.description AS solution_description
ORDER BY challenge_name ASC

Negatve Example:
MATCH (p:Paper)-[r:Paper_Has_Challenge]->(c:Challenge)
OPTIONAL MATCH (p)-[:Paper_Has_Solution]->(s:Solution)
RETURN p.title AS paper_title, c.name AS challenge_name, s.name AS solution_name, c.description AS challenge_description, s.description AS solution_description
ORDER BY c.name ASC

`;

const TEMPLATE_QUERY_GENERATOR = (user_query, schema) => `
You are a highly skilled AI graph database expert. Given the user queries and the schema of a graph database, your role is to identify which information in the database is necessary to meet the user's requirements and provide the corresponding database query following the {language} syntax.
The next step involves conducting specific analyses with the queried data, such as sorting, classifying, and describing the data. Therefore, when selecting attributes, it is important to analyze the intent of the user's query, clarify the purpose of the data query, and then determine the attributes that may be needed.
Before crafting query statements, thoroughly analyze the schema provided by the user to identify valid labels for nodes and edges. Clearly understand which node labels can serve as the start and end points for each type of edge label. This ensures that you construct executable query statements.
Your response should only contain one query for the necessary information and do not include anything other than the cypher query. Do not start with \`\`\`.

User Query: ${user_query}
Schema: ${schema}
${CYPHER_QUERY_EXAMPLE}
`;

export const defaultWelcome = `您好！我是 GraphScope 查询助理，您有任何关于 Cypher 查询的问题都可以随时问我`;
/**
 * 转换图的数据信息为自然语言
 */

export function getWelcomeMessage(welcome: string) {
  return [
    welcome &&
      new Message({
        status: 'success',
        role: 'assistant',
        content: welcome,
        timestamp: Date.now(),
        reserved: true,
      }),
  ].filter(Boolean) as Message[];
}
