import type { IStatement, StatementType, IGraphData, IGraphSchema, Info } from '@graphscope/studio-query';
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

  constructor(language: 'cypher' | 'gremlin' = 'gremlin') {
    this.language = language;
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
      const response = await fetch(`${window.location.origin}/queryGraphData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_params),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      }

      console.warn('查询失败，返回模拟数据');
    } catch (error) {
      console.error('Query error:', error);
      console.warn('查询请求失败，返回模拟数据');
    }

    // 查询失败或不是 Server 模式时返回模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      nodes: [
        { id: '1', label: 'Person', properties: { name: 'Alice', age: 30 } },
        { id: '2', label: 'Person', properties: { name: 'Bob', age: 25 } },
        { id: '3', label: 'City', properties: { name: 'New York', population: 8000000 } },
      ],
      edges: [
        { id: 'e1', label: 'KNOWS', properties: { since: 2020 }, source: '1', target: '2' },
        { id: 'e2', label: 'LIVES_IN', properties: { since: 2018 }, source: '1', target: '3' },
      ],
      raw: {
        records: [
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 0, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_3bc5b0706c3df8182f7784cafa0bd864c4a6d432266863609f1f5c22c47fa04b',
                  name: 'AS_3bc5b0706c',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '0',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 1, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_894a39aa8f6405a82567c5c1832fd3a6b110552c2fe84eafa929a3e603fc4387',
                  name: 'AS_894a39aa8f',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '1',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 2, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_a86c15455bcb9b7967833d13f513d8b030183a92137f02f26f9a0d6415521224',
                  name: 'AS_a86c15455b',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '2',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 3, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_d4df4808b721a2daba0101a5592c424a0b91fb5aa96b4ebf5fdd36de94e5ec25',
                  name: 'AS_d4df4808b7',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '3',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 4, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_bfe47d08b0915207ce5f3b739e2bd60484069a0f0591adf4ca6baf9f5779d27a',
                  name: 'AS_bfe47d08b0',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '4',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 5, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_57947de9271fba76c1aac0ca90395c7c1b7cfb0a1b6774e756cb57d69def2091',
                  name: 'AS_57947de927',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '5',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 6, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_4eba77aac4cf89cf4d89ac512cebbaae9c589e31878d997f02bf320085cf07e0',
                  name: 'AS_4eba77aac4',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '6',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 7, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_75e02bbef97e7bdf67ef510c2717d87333629dca1bd6dd2a755f4c2a5be2cb6c',
                  name: 'AS_75e02bbef9',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '7',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 8, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_75ba4a34dea52d2eadce3512591061a5f1605fee57baa71a138ee248e377f7e2',
                  name: 'AS_75ba4a34de',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '8',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 9, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_dbe1cf79e0c9c058394928cf1fb2677174405772bf09cc4640206d15505a3535',
                  name: 'AS_dbe1cf79e0',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '9',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 10, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_f767fa23a48f6ac1e462cfdd6c56ddde1ba293cba073d161d0070265de46a9e9',
                  name: 'AS_f767fa23a4',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '10',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 11, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_645c789aee7c2ee6923a919af4a10f6876f171e2c8e55fa05547184ea0eccc17',
                  name: 'AS_645c789aee',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '11',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 12, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_71889ff77e767b6385c2e0c09548b2fa3754c01817eef98f7d761368b46dd247',
                  name: 'AS_71889ff77e',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '12',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 13, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_3ad52704428e21e02fb8698f3fb9e1a97aaff0d39a35787a4694f03f80179463',
                  name: 'AS_3ad5270442',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '13',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 14, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_53051d8a4a15b96ae9e994ffb8c7e701d7e6dd7acacb0f0422c74f2a757bbd9f',
                  name: 'AS_53051d8a4a',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '14',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 15, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_0e86a2b78aabbd210aae3b559ad518b1f1cf76fb3a7bc56b362e9ce534f0bfbe',
                  name: 'AS_0e86a2b78a',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '15',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 16, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_15885868a927b4333536dcd6e710e9c91afb64c59dbc005c7cbf4305565af5d6',
                  name: 'AS_15885868a9',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '16',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 17, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_48a445a17df14aa66fcda15118acfa5326bb4da6102ebad98ed2515e2ed98315',
                  name: 'AS_48a445a17d',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '17',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 18, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_8c658e457dcdcac0482fcc583bca9222dbde42b3b565f952419da46bd5a5d7af',
                  name: 'AS_8c658e457d',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '18',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 19, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_18e8bb2ed7b0cd0b90899cbeed167ab799142758f352b0910af4140d5907807e',
                  name: 'AS_18e8bb2ed7',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '19',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 20, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_a25b86a5f3b4ea23b6b00bdd6acde9926ffc932e19f8500cff06ba35fb8f3d7b',
                  name: 'AS_a25b86a5f3',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '20',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 21, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_99fdfffd6903a124519df33f4b37e1b45bc7234f26c783f7254f09235b9ca30f',
                  name: 'AS_99fdfffd69',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '21',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 22, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_3acb98d8043248d884b0236acff6e75a199b89dff521dcc142d59df236c7992e',
                  name: 'AS_3acb98d804',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '22',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 23, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_898b53b69fa098f6937b01726ce52368834ec00c34e1c7811cd293e99abb147c',
                  name: 'AS_898b53b69f',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '23',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 24, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_1d624c9be374e9b85d0105f3fc5e474a305c294f11402195edd43d093b9d4ab9',
                  name: 'AS_1d624c9be3',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '24',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 25, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_f76ae200753a4f3ab0cbc640c40432fac39758f49fe759f3886e9621c0631c55',
                  name: 'AS_f76ae20075',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '25',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 26, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_be98f3d98446e23a97c56062943febfd96f40b235915bad79dd9600375bda691',
                  name: 'AS_be98f3d984',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '26',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 27, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_e774bb32ba32a39fb57f1efcde1df426caed6d9cae712301b3383ac5d3f044ef',
                  name: 'AS_e774bb32ba',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '27',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 28, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_f89b33c4980faa7ab6d670ac01b496af281357344676626c914b478ba2c60602',
                  name: 'AS_f89b33c498',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '28',
              },
            ],
            _fieldLookup: { n: 0 },
          },
          {
            keys: ['n'],
            length: 1,
            _fields: [
              {
                identity: { low: 29, high: 0 },
                labels: ['ASN'],
                properties: {
                  id: 'ASN_d48a20cd8056c9b3ab24773a208c38b2732710abfe140d4a4434be5b2ea247cb',
                  name: 'AS_d48a20cd80',
                  type: 'ASN',
                  industry: '[]',
                },
                elementId: '29',
              },
            ],
            _fieldLookup: { n: 0 },
          },
        ],
        summary: {
          query: { text: 'Match (n) return n limit 30', parameters: {} },
          queryType: 'r',
          counters: {
            _stats: {
              nodesCreated: 0,
              nodesDeleted: 0,
              relationshipsCreated: 0,
              relationshipsDeleted: 0,
              propertiesSet: 0,
              labelsAdded: 0,
              labelsRemoved: 0,
              indexesAdded: 0,
              indexesRemoved: 0,
              constraintsAdded: 0,
              constraintsRemoved: 0,
            },
            _systemUpdates: 0,
          },
          updateStatistics: {
            _stats: {
              nodesCreated: 0,
              nodesDeleted: 0,
              relationshipsCreated: 0,
              relationshipsDeleted: 0,
              propertiesSet: 0,
              labelsAdded: 0,
              labelsRemoved: 0,
              indexesAdded: 0,
              indexesRemoved: 0,
              constraintsAdded: 0,
              constraintsRemoved: 0,
            },
            _systemUpdates: 0,
          },
          plan: false,
          profile: false,
          notifications: [],
          gqlStatusObjects: [
            {
              gqlStatus: '00000',
              statusDescription: 'note: successful completion',
              diagnosticRecord: { OPERATION: '', OPERATION_CODE: '0', CURRENT_SCHEMA: '/' },
              severity: 'UNKNOWN',
              classification: 'UNKNOWN',
              isNotification: false,
            },
          ],
          server: { address: '127.0.0.1:7687', agent: 'Neo4j/4.4.0', protocolVersion: 4.4 },
          resultConsumedAfter: { low: 27, high: 0 },
          resultAvailableAfter: { low: 70, high: 0 },
          database: { name: 'neo4j' },
        },
      },
      table: []
    };
  }

  // 查询图模式
  async queryGraphSchema(): Promise<CypherSchemaData> {
    try {
      const response = await fetch(`${window.location.origin}/queryGraphSchema`);
      const result = await response.json();
      if (result.success) {
        const schema = result.data;
        // 转换 schema 格式以适配前端使用
        const cypherSchema = transformSchema(schema);
        return cypherSchema as CypherSchemaData;
      }
    } catch (error) {
      console.error('Query schema error:', error);
    }
    const mockSchema = {
      edge_types: [
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 0,
          type_name: 'r_request_jump',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'Domain',
              relation: 'MANY_TO_MANY',
              source_vertex: 'Domain',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 1,
          type_name: 'r_cname',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'Domain',
              relation: 'MANY_TO_MANY',
              source_vertex: 'Domain',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 2,
          type_name: 'r_subdomain',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'Domain',
              relation: 'MANY_TO_MANY',
              source_vertex: 'Domain',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 3,
          type_name: 'r_cert_chain',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'Cert',
              relation: 'MANY_TO_MANY',
              source_vertex: 'Cert',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 4,
          type_name: 'r_whois_phone',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'Whois_Phone',
              relation: 'MANY_TO_MANY',
              source_vertex: 'Domain',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 5,
          type_name: 'r_whois_email',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'Whois_Email',
              relation: 'MANY_TO_MANY',
              source_vertex: 'Domain',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 6,
          type_name: 'r_asn',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'ASN',
              relation: 'MANY_TO_MANY',
              source_vertex: 'IP',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 7,
          type_name: 'r_whois_name',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'Whois_Name',
              relation: 'MANY_TO_MANY',
              source_vertex: 'Domain',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 8,
          type_name: 'r_cidr',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'IP_C',
              relation: 'MANY_TO_MANY',
              source_vertex: 'IP',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 9,
          type_name: 'r_cert',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'Cert',
              relation: 'MANY_TO_MANY',
              source_vertex: 'Domain',
            },
          ],
        },
        {
          properties: [
            {
              property_id: 0,
              property_name: 'relation',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 10,
          type_name: 'r_dns_a',
          vertex_type_pair_relations: [
            {
              destination_vertex: 'IP',
              relation: 'MANY_TO_MANY',
              source_vertex: 'Domain',
            },
          ],
        },
      ],
      vertex_types: [
        {
          primary_keys: ['id'],
          properties: [
            {
              property_id: 0,
              property_name: 'id',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 1,
              property_name: 'name',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 2,
              property_name: 'type',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 3,
              property_name: 'industry',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 0,
          type_name: 'ASN',
          x_csr_params: {
            max_vertex_num: 8192,
          },
        },
        {
          primary_keys: ['id'],
          properties: [
            {
              property_id: 0,
              property_name: 'id',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 1,
              property_name: 'name',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 2,
              property_name: 'type',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 3,
              property_name: 'industry',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 1,
          type_name: 'IP_C',
          x_csr_params: {
            max_vertex_num: 8192,
          },
        },
        {
          primary_keys: ['id'],
          properties: [
            {
              property_id: 0,
              property_name: 'id',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 1,
              property_name: 'name',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 2,
              property_name: 'type',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 3,
              property_name: 'industry',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 2,
          type_name: 'Whois_Email',
          x_csr_params: {
            max_vertex_num: 8192,
          },
        },
        {
          primary_keys: ['id'],
          properties: [
            {
              property_id: 0,
              property_name: 'id',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 1,
              property_name: 'name',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 2,
              property_name: 'type',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 3,
              property_name: 'industry',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 3,
          type_name: 'Whois_Phone',
          x_csr_params: {
            max_vertex_num: 8192,
          },
        },
        {
          primary_keys: ['id'],
          properties: [
            {
              property_id: 0,
              property_name: 'id',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 1,
              property_name: 'name',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 2,
              property_name: 'type',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 3,
              property_name: 'industry',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 4,
          type_name: 'Whois_Name',
          x_csr_params: {
            max_vertex_num: 8192,
          },
        },
        {
          primary_keys: ['id'],
          properties: [
            {
              property_id: 0,
              property_name: 'id',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 1,
              property_name: 'name',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 2,
              property_name: 'type',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 3,
              property_name: 'industry',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 5,
          type_name: 'Cert',
          x_csr_params: {
            max_vertex_num: 8192,
          },
        },
        {
          primary_keys: ['id'],
          properties: [
            {
              property_id: 0,
              property_name: 'id',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 1,
              property_name: 'name',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 2,
              property_name: 'type',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 3,
              property_name: 'industry',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 6,
          type_name: 'IP',
          x_csr_params: {
            max_vertex_num: 8192,
          },
        },
        {
          primary_keys: ['id'],
          properties: [
            {
              property_id: 0,
              property_name: 'id',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 1,
              property_name: 'name',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 2,
              property_name: 'type',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
            {
              property_id: 3,
              property_name: 'industry',
              property_type: {
                string: {
                  long_text: '',
                },
              },
            },
          ],
          type_id: 7,
          type_name: 'Domain',
          x_csr_params: {
            max_vertex_num: 8192,
          },
        },
      ],
    };
    const transformedSchema = transformSchema(mockSchema);
    console.log('transformedSchema::: ', transformedSchema);
    return transformedSchema as CypherSchemaData;
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
