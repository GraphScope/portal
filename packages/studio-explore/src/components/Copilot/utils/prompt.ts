import { Message } from './message';
type GraphSchemaData = any;

export const get_query_system_prompts = graphSchema => `
你的角色是一个 Cypher 查询助手，你可以根据用户的自然语言提问，再结合图数据库的 Schema 结构，给生成标准的 Cypher 查询语句。
为了查询的准确性，请务必充分理解 Schema，并使用 Schema 中明确的字段，不要自己随意生成字段！
为了查询的准确性，请务必充分理解 Schema，并使用 Schema 中明确的字段，不要自己随意生成字段！
为了查询的准确性，请务必充分理解 Schema，并使用 Schema 中明确的字段，不要自己随意生成字段！

你不要着急马上给出答案，你可以多生成几个语句，然后找出一个你觉得最准确的语句告诉我，推理的过程可以不用告诉我，我只需要最准确的那一个。
你不要着急马上给出答案，你可以多生成几个语句，然后找出一个你觉得最准确的语句告诉我，推理的过程可以不用告诉我，我只需要最准确的那一个。
你不要着急马上给出答案，你可以多生成几个语句，然后找出一个你觉得最准确的语句告诉我，推理的过程可以不用告诉我，我只需要最准确的那一个。

其他注意事项:
不支持 "MATCH p=()-[]-() RETURN p" 的写法，请都替换成 "MATCH (a)-[b]-(c) RETURN a,b,c"
注意返回格式需要 markdown cypher 格式

下面是数据库中的 Schema：
${graphSchema}
让我们开始吧～
`;
export const get_report_system_prompts = graphSchema => `
你的角色是一个图分析报告的生成助手，首先，你要理解用户的图数据模型，模型如下：
${graphSchema}
其次，你要提醒用户给你当前图画布的完整数据信息，根据这个子图数据，你需要生成一份思维导图，在生成思维导图的过程中，你可能需要对图上的数据做聚类，聚类的信息可以追加到原有节点的属性中，返回的数据，只用携带关键信息即可，我可以在本地merge数据
让我们开始吧～
`;

// reference:https://github.com/GraphScope/portal/blob/llm_analysis/python/graphy/prompts/graph_analyze_prompts.py
const CYPHER_QUERY_EXAMPLE = `

Here are some specific syntax requirements of cypher to keep in mind when writing Cypher queries:

Requirement (1): In Cypher queries, if you rename a property (such as 'T.a') using the 'AS' keyword (e.g., 'T.a AS b'), you must use 'b' in all subsequent parts of the query instead of 'T.a'. Especially for the content following 'ORDER BY such as 'ORDER BY T.a, T.b', if 'T.a' or 'T.b' have been renamed using the 'AS' keyword earlier in the query, you must use their new names no matter how DESC and ASC are used.

Example of a correct query:

MATCH (p:Paper)-[r:Paper_Has_Challenge]->(c:Challenge)
OPTIONAL MATCH (p)-[:Paper_Has_Solution]->(s:Solution)
RETURN p.title AS paper_title, c.name AS challenge_name, s.name AS solution_name, c.description AS challenge_description, s.description AS solution_description
ORDER BY challenge_name ASC;
In this example, 'c.name AS challenge_name' is correctly followed by 'ORDER BY challenge_name ASC'.

Example of an incorrect query:

MATCH (p:Paper)-[r:Paper_Has_Challenge]->(c:Challenge)
OPTIONAL MATCH (p)-[:Paper_Has_Solution]->(s:Solution)
RETURN p.title AS paper_title, c.name AS challenge_name, s.name AS solution_name, c.description AS challenge_description, s.description AS solution_description
ORDER BY c.name ASC;
In this case, 'c.name AS challenge_name' should be followed by 'ORDER BY challenge_name ASC', but instead, it incorrectly uses 'ORDER BY c.name ASC'.

Requirement (2): Ensure that every edge and vertex in the MATCH pattern adheres to the schema rules:

For an edge like (x:xlabel)-[e:elabel]->(y:ylabel):

It is valid if the schema contains an edge with:
A label or type name matching 'elabel'.
Source vertex label 'xlabel' and destination vertex label 'ylabel'.
If these conditions are not met, the edge definition is invalid.
For a node like (x:label):

It is valid if the schema includes a vertex with:
A label or type name matching 'xlabel'.
If this condition is not met, the node definition is invalid.

Consider a schema with two node types: 'Person' and 'Message'. There is also an edge labeled 'Likes', where the edge starts from a 'Person' node (source) and ends at a 'Message' node (destination), then:
Positive Example:
MATCH (p:Person)-[l:Likes]->(m:Message)
RETURN p.name;

Negative Example 1:
MATCH (p:Person)<-[l:Likes]-(m:Message)
RETURN p.name;


Negative Example 2 (as vertex with label 'Comment' is not defined in the schema):
MATCH (p:Person)<-[l:Likes]-(c:Comment)
RETURN p.name;


`;

export const TEMPLATE_QUERY_GENERATOR = schema => `
You are a highly skilled AI graph database expert. Given the user queries and the schema of a graph database, your role is to identify which information in the database is necessary to meet the user's requirements and provide the corresponding database query following the {language} syntax.
The next step involves conducting specific analyses with the queried data, such as sorting, classifying, and describing the data. Therefore, when selecting attributes, it is important to analyze the intent of the user's query, clarify the purpose of the data query, and then determine the attributes that may be needed.
Before crafting query statements, thoroughly analyze the schema provided by the user to identify valid labels for nodes and edges. Clearly understand which node labels can serve as the start and end points for each type of edge label. This ensures that you construct executable query statements.
Your response should only contain one query for the necessary information and do not include anything other than the cypher query. Do not start with \`\`\`.
Schema: ${schema}
${CYPHER_QUERY_EXAMPLE}
`;

const TEMPLATE_MIND_MAP_GENERATOR = (user_query, paper_slot) => `
You are a highly skilled academic AI assistant. Given a user query and a set of papers with their properties, your role is to categorize the given papers based on the user's goals and the provided data by selecting specific dimensions. Each category should have a name and a corresponding description. For each category, maintain a list of paper IDs and paper titles that belong to that category.

User Query: ${user_query}
Papers: ${paper_slot}

Guidance:
- When selecting dimensions for categorization, you should choose those that are as distinct and important as possible.
- When categorizing, try not to have a single paper belong to more than one category.
- The number of categories is not necessarily the more the better; generally, dividing into 2-4 categories is preferable.
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
