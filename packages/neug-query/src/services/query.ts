import type { IStatement, StatementType } from '@graphscope/studio-query';
import { message } from 'antd';
import localforage from 'localforage';
import { transformSchema } from '../utils/schema';
import { CypherSchemaData } from '@graphscope/studio-query';

// 创建 localforage 实例，与 website 包保持一致
const DB_QUERY_HISTORY = localforage.createInstance({
  name: 'DB_QUERY_HISTORY',
});

const DB_QUERY_SAVED = localforage.createInstance({
  name: 'DB_QUERY_SAVED',
});

// QueryService 类 - 将原来的 website 服务逻辑适配到这里，使用 localforage
export class QueryService {
  private language: 'cypher' | 'gremlin';
  private apiBaseUrl: string;

  constructor(language: 'cypher' | 'gremlin' = 'gremlin') {
    this.language = language;
    // 在开发环境使用相对路径以利用 Vite 代理，生产环境使用环境变量
    if (import.meta.env.DEV) {
      this.apiBaseUrl = ''; // 使用相对路径，让 Vite 代理处理
    } else {
      this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    }
  }

  // 查询图数据 - 基于 website 包的逻辑，去掉 Browser 模式
  async queryGraphData(params: IStatement) {
    // 首先保存到历史记录
    await this.createStatements('history', params);
    const _params = {
      script: params.script,
      language: 'cypher',
    };
    try {
      const response = await fetch(`${this.apiBaseUrl}/cypherv2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: params.script,
      });
      if (response.status !== 200) {
        const errorText = await response.text();
        message.error(errorText);
        return {
          nodes: [],
          edges: [],
          mode: 'error',
          raw: { message: errorText },
        };
      }
      const result = await response.json();
      return (
        result || {
          nodes: [],
          edges: [],
        }
      );
    } catch (error) {
      message.error('查询失败，请检查服务是否可用');
      return {
        nodes: [],
        edges: [],
      };
    }
  }

  // 查询图模式
  async queryGraphSchema() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/schema`);
      const result = await response.json();
      if (result) {
        const { schema } = result;
        // 转换 schema 格式以适配前端使用
        const cypherSchema = transformSchema(schema);
        return cypherSchema as CypherSchemaData;
      }
      message.error('查询失败，请检查服务是否可用');
      return { nodes: [], edges: [] };
    } catch (error) {
      console.error('Query schema error:', error);
      message.error('查询失败，请检查服务是否可用');
      return { nodes: [], edges: [] };
    }
  }

  // 创建语句 - 基于 website 包的逻辑，使用 localforage
  async createStatements(type: StatementType, params: IStatement): Promise<boolean> {
    console.log('Creating statement:', type, params);
    try {
      if (type === 'history') {
        await DB_QUERY_HISTORY.setItem(params.id, params);
        return true;
      }

      if (type === 'saved') {
        await DB_QUERY_SAVED.setItem(params.id, params);
        message.success(`Statement saved to ${type}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error creating statement:', error);
      message.error('保存语句失败');
      return false;
    }
  }

  // 查询语句 - 基于 website 包的逻辑，使用 localforage
  async queryStatements(type: StatementType): Promise<IStatement[]> {
    console.log('Querying statements of type:', type);

    if (type === 'history') {
      const result: IStatement[] = [];
      try {
        await DB_QUERY_HISTORY.iterate((item: IStatement) => {
          if (item) {
            result.push(item);
          }
        });
        return result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      } catch (error) {
        console.error('Error querying history:', error);
        return [];
      }
    }

    if (type === 'saved') {
      const result: IStatement[] = [];
      try {
        await DB_QUERY_SAVED.iterate((item: IStatement) => {
          if (item) {
            result.push(item);
          }
        });
        return result;
      } catch (error) {
        console.error('Error querying saved:', error);
        return [];
      }
    }
    // 暂时neug-query不支持存储过程的查询，返回模拟数据
    if (type === 'store-procedure') {
      // 返回模拟的存储过程数据
      const mockStoreProcedures: IStatement[] =
        this.language === 'gremlin'
          ? [
              { id: 'sp1', script: 'g.V().groupCount().by(label)', name: 'Label Distribution', language: 'gremlin' },
              { id: 'sp2', script: 'g.V().hasLabel("Person").count()', name: 'Person Count', language: 'gremlin' },
            ]
          : [
              { id: 'sp1', script: 'CALL db.schema.visualization()', name: 'Schema Visualization', language: 'cypher' },
              { id: 'sp2', script: 'CALL db.labels()', name: 'Node Labels', language: 'cypher' },
            ];

      return mockStoreProcedures;
    }

    return [];
  }

  // 删除语句 - 基于 website 包的逻辑，使用 localforage
  async deleteStatements(type: StatementType, ids: string[]): Promise<boolean> {
    console.log('Deleting statements:', type, ids);

    try {
      if (type === 'history') {
        for (const id of ids) {
          await DB_QUERY_HISTORY.removeItem(id);
        }
        message.success(`Deleted ${ids.length} statement(s) from ${type}`);
        return true;
      }

      if (type === 'saved') {
        for (const id of ids) {
          await DB_QUERY_SAVED.removeItem(id);
        }
        message.success(`Deleted ${ids.length} statement(s) from ${type}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting statements:', error);
      message.error('删除语句失败');
      return false;
    }
  }
}
