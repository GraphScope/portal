import { z } from 'zod';
import { getDriver } from '../helpers';
import resource from '../resource';

const query_from_graphdb = {
  name: 'query_from_graphdb',
  description: '查询图数据',
  parameters: {
    script: z.string().default('Match (n) return n limit 10'),
  },
  execute: async ({ script }: { script: string }) => {
    try {
      const driver = getDriver();
      const result = await driver.query(script);
      console.log('result', result);
      return {
        content: [{ type: 'text', text: result }],
      };
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `xxxx: ${error.message}` }],
      };
    }
  },
};

const nl_to_cypher = {
  name: 'nl-to-cypher',
  description: '自然语言转换为 Cypher 查询语句',
  parameters: {
    query: z.string().describe(''),
  },
  execute: async ({ query }: { query: string }) => {
    try {
      // 获取图schema
      const schemaResult = await resource.schema.execute(new URL('schema://main'));

      const graphSchema = schemaResult.contents[0].text;

      // 使用DeepSeek进行转换
      const prompt = `你是一个Cypher查询专家。根据以下图schema：
                      ${graphSchema}

                      将下面的自然语言查询转换为Cypher语句：
                      ${query}
                      注意，仅返回一个你认为最准确的 Cypher 语句，不要解释，不要返回其他内容，不要返回 \`\`\`cypher
                      `;

      // 调用DeepSeek API
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });
      const data = await response.json();
      const cypher_statement = data.choices[0].message.content;
      console.log('cypher_statement', cypher_statement);
      return {
        content: [{ type: 'text', text: cypher_statement }],
      };
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `转换失败: ${error.message}` }],
      };
    }
  },
};

const portal_query_data = {
  name: 'portal_query_data',
  description: '通过自然语言查询 GraphScope Interactive 中的数据',
  parameters: {
    query: z.string().describe(''),
  },
  execute: async ({ query }: { query: string }) => {
    try {
      // 自然语言转 Cypher
      const { content } = await nl_to_cypher.execute({ query });
      const script = content[0].text;
      // 根据 Cypher 查询图数据
      const query_result_data = await query_from_graphdb.execute({ script });
      console.log('query_result_data', query_result_data);
      return {
        ...query_result_data,
      };
    } catch (error: any) {
      return {
        content: [{ type: 'text', text: `转换失败: ${error.message}` }],
      };
    }
  },
};

export default {
  portal_query_data,
};
