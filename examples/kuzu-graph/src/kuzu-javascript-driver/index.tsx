import { default as Kuzu } from '@kuzu/kuzu-wasm';

interface IKuzuResult {
  Database: () => Promise<any>;
  Connection: (db: any) => Promise<any>;
  execute: (query: string) => Promise<any>;
}

interface IKuzuDatabase {
  close: () => Promise<void>;
}

interface IKuzuConnection {
  execute: (query: string) => Promise<any>;
  close: () => Promise<void>;
}

export class KuzuDriver {
  private kuzu: typeof Kuzu;
  private db: IKuzuDatabase | null;
  private conn: IKuzuConnection | null;

  constructor() {
    this.kuzu = Kuzu;
    this.db = null;
    this.conn = null;
  }

  async initialize(): Promise<void> {
    const result: IKuzuResult = await this.kuzu();
    this.db = await result.Database();
    this.conn = await result.Connection(this.db);
  }

  async createSchema(schema: { nodes: any[]; edges: any[] }): Promise<void> {
    const { nodes, edges } = schema;
    const node_scripts = nodes.map(node => {
      const { label, properties } = node;
      const property_scripts = properties.map(property => {
        const { name, type } = property;
        return `${name} ${type}`;
      });
      return `CREATE NODE TABLE ${label} (${property_scripts.join(', ')})`;
    });
    const edge_scripts = edges.map(edge => {
      const { label, source, target, properties } = edge;
      const property_scripts = properties.map(property => {
        const { name, type } = property;
        return `${name} ${type}`;
      });
      return `CREATE REL TABLE ${label} FROM ${source} TO ${target} (${property_scripts.join(', ')})`;
    });

    console.log(node_scripts.join('; ') + '; ' + edge_scripts.join('; '));

    const createResult = await this.conn?.execute(node_scripts[0]);
    console.log('Schema created: ', createResult.toString());
  }

  async insertData(query: string): Promise<void> {
    console.log('Inserting data...');
    const insertResult = await this.conn?.execute(query);
    console.log('Data inserted: ', insertResult.toString());
  }

  async queryData(query: string): Promise<any> {
    console.time('Query cost');
    const queryResult = await this.conn?.execute(query);
    console.timeEnd('Query cost');
    console.log('Query result: ', queryResult.toString());
    return queryResult;
  }

  async close(): Promise<void> {
    if (this.conn) {
      await this.conn.close();
      console.log('Connection closed.');
    }
    if (this.db) {
      await this.db.close();
      console.log('Database closed.');
    }
  }
}
