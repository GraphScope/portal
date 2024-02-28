import { Message } from './message';
type GraphSchemaData = any;

const CYPHER_CASE = `
注意要以JSON的格式返回结果：
Right Cases:
querys1: 列举出鲁迅的一个别名可以吗？
answer1: "match (:ENTITY{name:'鲁迅'})<--(h)-[:Relationship{name:'别名'}]->(q) return distinct q.name limit 1"

querys2: 我们常用的301SH不锈钢带的硬度公差是多少，你知道吗？ 
answers2: "match(p:ENTITY{name:'301SH不锈钢带'})-[:Relationship{name:'硬度公差'}]-> (q) return q.name"
Wrong Cases:
querys: 12344加油这首歌真好听，你知道歌曲原唱是谁吗？ answers: MATCH (a:Actor)-[:ACTED_IN]->(m:Movie) WHERE m.name = '12345加油' RETURN a.name
querys: 七宗梦是什么时候上映的？ answers: MATCH (a:Actor)-[:ACTED_IN]->(m:Movie) WHERE m.name = '七宗梦' RETURN a.name LIMIT 30
`;
const CASE_SCHEMA = {
  nodes: [
    {
      label: 'Paper',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
        },
        {
          name: 'conference',
          type: 'DT_STRING',
        },
        {
          name: 'CCFRank',
          type: 'DT_STRING',
        },
        {
          name: 'CCFField',
          type: 'DT_STRING',
        },
        {
          name: 'year',
          type: 'DT_SIGNED_INT32',
        },
        {
          name: 'paper',
          type: 'DT_STRING',
        },
      ],
      primary: 'id',
    },
    {
      label: 'Challenge',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
        },
        {
          name: 'challenge',
          type: 'DT_STRING',
        },
      ],
      primary: 'id',
    },
    {
      label: 'Topic',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
        },
        {
          name: 'category',
          type: 'DT_STRING',
        },
      ],
      primary: 'id',
    },
    {
      label: 'Task',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
        },
        {
          name: 'task',
          type: 'DT_STRING',
        },
      ],
      primary: 'id',
    },
    {
      label: 'Solution',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
        },
        {
          name: 'solution',
          type: 'DT_STRING',
        },
      ],
      primary: 'id',
    },
    {
      label: 'CCFField',
      properties: [
        {
          name: 'id',
          type: 'DT_SIGNED_INT64',
        },
        {
          name: 'field',
          type: 'DT_STRING',
        },
      ],
      primary: 'id',
    },
  ],
  edges: [
    {
      label: 'WorkOn',
      properties: [],
      primary: 'WorkOn',
      constraints: [['Paper', 'Task']],
    },
    {
      label: 'Resolve',
      properties: [],
      primary: 'Resolve',
      constraints: [['Paper', 'Challenge']],
    },
    {
      label: 'Target',
      properties: [
        {
          name: 'number',
          type: 'DT_SIGNED_INT32',
        },
      ],
      primary: 'Target',
      constraints: [['Task', 'Challenge']],
    },
    {
      label: 'Belong',
      properties: [],
      primary: 'Belong',
      constraints: [['Task', 'Topic']],
    },
    {
      label: 'Use',
      properties: [],
      primary: 'Use',
      constraints: [['Paper', 'Solution']],
    },
    {
      label: 'ApplyOn',
      properties: [],
      primary: 'ApplyOn',
      constraints: [['Solution', 'Challenge']],
    },
    {
      label: 'HasField',
      properties: [],
      primary: 'HasField',
      constraints: [['Paper', 'CCFField']],
    },
    {
      label: 'Citation',
      properties: [],
      primary: 'Citation',
      constraints: [['Paper', 'Paper']],
    },
  ],
};
const CASE_RECOMMENDED = [
  {
    cypher: 'Match (n:Paper) return n limit 30',
    desc: '查询出 Paper 类型的节点',
  },
  {
    cypher: `MATCH (p:Paper)-[:WorkOn]->(a:Task),(a)-[:Belong]->(t: Topic) RETURN t.category,  COUNT(p)`,
    desc: '找出每个主题下的论文数量',
  },
  {
    cypher: `MATCH (t: Topic)<-[:Belong]-(a:Task),
      (a)<-[:WorkOn]-(p:Paper)-[:Use]->(s:Solution),
      (s)-[:ApplyOn]->(ch:Challenge)
  WHERE t.category = $topic_name
  RETURN t.category, ch.challenge, COUNT(p)`,
    desc: '检索特定主题下，每个挑战（Challenge）所应用的解决方案（Solution）中与论文（Paper）相关的数量',
  },
];

export const prompt1 = `
你的角色是一个 Cypher 查询助手，你可以根据 Schema 结构，给用户推荐你任务最重要的5条 Cypher 查询语句

任务1: 根据 Schema 结构，自动推荐出关联性最大，最利于用户分析的 10 条Cypher查询语句
Schema：
${JSON.stringify(CASE_SCHEMA, null, 2)}
Answers:
${JSON.stringify(CASE_RECOMMENDED, null, 2)}

任务2: 根据 Schema 结构和用户的输入，生成 Cypher 查询语句，用于图数据库查询
${CYPHER_CASE}

Instructions:
Note: Do not include any explanations or apologies in your responses.
Do not respond to any questions that might ask anything else than for you to construct a Cypher statement.
Do not include any text except the generated Cypher statement.
You must use the relaship or property shown in the schema!!! do not use other keys!!!
You must use the relaship or property shown in the schema!!! do not use other keys!!!
You must use the relaship or property shown in the schema!!! do not use other keys!!!
你必须使用Sechema中出现的关键词！！！

当前会话中图的 Schema 结构如下：

{graphSchema}

你需要根据用户的提问，自动切换到上述两个任务中，并且给出正确返回，让我们开始吧！

`;

export const prompt = `
你的角色是一个 Cypher 查询助手，你可以根据用户的自然语言提问，再结合图数据库的 Schema 结构，给生成标准的 Cypher 查询语句。
为了查询的准确性，请务必使用 Schema 中明确的字段，不要自己随意生成字段！
为了查询的准确性，请务必使用 Schema 中明确的字段，不要自己随意生成字段！
为了查询的准确性，请务必使用 Schema 中明确的字段，不要自己随意生成字段！

下面是数据库中的 Schema：
{graphSchema}

注意返回格式需要 markdown 格式,其他注意事项:不支持 "MATCH p=()-[]-() RETURN p" 的写法，请都替换成 "MATCH (a)-[b]-(c) RETURN a,b,c"
让我们开始吧～
`;
export const defaultWelcome = `您好！我是 GraphScope 查询助理，您有任何关于 Cypher 查询的问题都可以随时问我`;
/**
 * 转换图的数据信息为自然语言
 */
export function schemaToNL(schema: GraphSchemaData) {
  return JSON.stringify(schema, null, 2);
}

export function getPrompt(prompt: string, schema: GraphSchemaData) {
  const graphSchema = schemaToNL(schema);

  return prompt.replace(/\{graphSchema\}/g, graphSchema);
}

export function getWelcomeMessage(welcome: string, prompt: string, schema: GraphSchemaData) {
  return [
    prompt &&
      new Message({
        status: 'success',
        role: 'system',
        content: getPrompt(prompt, schema),
        timestamp: Date.now(),
        reserved: true,
      }),
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
