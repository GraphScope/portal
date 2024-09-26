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

  async createSchema(schema: string): Promise<void> {
    const createResult = await this.conn?.execute(schema);
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

export const testFn = async () => {
  const kuzuDriver = new KuzuDriver();
  await kuzuDriver.initialize();

  const createSchema = 'CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))';
  await kuzuDriver.createSchema(createSchema);

  const insertQuery = "CREATE (u:User {name: 'Alice', age: 35})";
  await kuzuDriver.insertData(insertQuery);

  const query = 'MATCH (n) RETURN n';
  const queryResult = await kuzuDriver.queryData(query);

  await kuzuDriver.close();
};
