import Kuzu from '@kuzu/kuzu-wasm';
import { uniqueElementsBy } from './utils';

interface SchemaItem {
  source?: string;
  target?: string;
  label: string;
  properties: {
    name: string;
    type: string;
  };
}
interface IKuzuResult {
  Database: (params: any) => Promise<any>;
  Connection: (db: any) => Promise<any>;
  FS: Promise<any>;
  execute: (queryScript: string) => Promise<any>;
}

interface IKuzuDatabase {
  close: () => Promise<void>;
}

interface IKuzuConnection {
  execute: (queryScript: string) => Promise<any>;
  close: () => Promise<void>;
}

class FileData {
  name: string;
  content: string;

  constructor(name, content) {
    this.name = name; // 文件名
    this.content = content; // 文件内容
  }
}

class GraphData {
  files: FileData[];
  schema: {
    nodes: any[];
    edges: any[];
  };

  constructor(files, schema) {
    this.files = files;
    this.schema = schema;
  }
}

export class KuzuDriver {
  kuzu: typeof Kuzu;
  db: IKuzuDatabase | null;
  conn: IKuzuConnection | null;
  FS: any;
  dbname: string;
  schema: { nodes: any[]; edges: any[] };
  curDataset: string;
  kuzuEngine: IKuzuResult | null;
  indexdb: any;
  mountedPath: Set<any>;

  constructor() {
    this.kuzu = Kuzu;
    this.db = null;
    this.conn = null;
    this.FS = null;
    this.schema = { nodes: [], edges: [] };
    this.dbname = '';
    this.curDataset = '';
    this.kuzuEngine = null;
    this.mountedPath = new Set();
  }

  async initialize(): Promise<void> {
    console.log('initialize again');
    this.kuzuEngine = await this.kuzu();

    //@ts-ignore

    // this.db = await result.Database(this.dbname, 0, 10, false, false, 4194304 * 16 * 4);
    // this.conn = await result.Connection(this.db);
    this.FS = this.kuzuEngine.FS;
    this.FS?.mkdir('data');

    // this.FS?.mkdir('export');
  }

  async installUDF(): Promise<void> {
    var res = await this.conn?.execute('CREATE MACRO elementid(x) AS CAST(ID(x),"STRING")');

    console.log(res.toString());
  }

  async use(datasetId: string) {
    if (this.curDataset !== '') {
      await this.closeDataset();
    }

    await this.setDatasetId(datasetId);
    try {
      await this.FS?.mkdir(`${this.curDataset}`);
    } catch (err) {
      console.log(`Directory ${this.curDataset} exists`);
    }

    const targetPath = this.pathJoin('/', this.curDataset);
    if (!this.mountedPath.has(targetPath)) {
      console.log(`MOUNT ${this.curDataset} ...`);
      try {
        await this.FS?.mount(this.FS.filesystems.IDBFS, { autoPersist: true }, targetPath);
        this.mountedPath.add(targetPath);
      } catch (err) {
        console.error(`Error mounting:`, err);
      }
    }

    if (await this.existDataset(datasetId)) {
      console.log(`Loading from indexdb ${datasetId}`);
      await this.loadFromIndexDB();
    }

    await this.openDataset();
    await this.installUDF();

    return this.curDataset;
  }

  async setDatasetId(datasetId: string) {
    this.curDataset = datasetId;
  }

  async existDataset(datasetId: string) {
    const datasetPath = this.pathJoin('/', datasetId);
    if (indexedDB.databases) {
      try {
        const databases = await indexedDB.databases();
        return databases.some(db => db.name === datasetPath);
      } catch (error) {
        console.error('Error accessing databases:', error);
        return false;
      }
    } else {
      console.warn('indexedDB.databases() is not supported in this browser.');
      return false;
    }
  }

  // async existDataset(datasetId: string) {
  //   const key = this.pathJoin('/', datasetId);
  //   console.log("exist?");
  //   console.log(key);
  //   console.log(await localforage.getItem(key));
  //   return await localforage.getItem(key)
  //     .then(function(value) {
  //         return value !== null;
  //     })
  //     .catch(function(err) {
  //         console.error('An error occurred:', err);
  //         return false;
  //     });
  // }

  async datasetLoaded(datasetId: string) {
    try {
      const { mode, timestamp } = await this.FS.lookupPath('/' + datasetId).node;
      if (this.FS.isDir(mode)) {
        return true;
      }
    } catch (err) {
      console.error(`Error retrieving "${datasetId}":`, err);
      return false; // 在发生错误时返回 false
    }

    return false;
  }

  typeConvert(input_type: string) {
    const input_type_upper = input_type.toUpperCase();
    switch (input_type_upper) {
      case 'DT_STRING':
        return 'STRING';
      case 'DT_DOUBLE':
        return 'DOUBLE';
      case 'DT_SIGNED_INT32':
        return 'INT32';
      case 'DT_SIGNED_INT64':
        return 'INT64';
      default:
        return 'STRING';
    }
  }

  async createSchema(schema: { nodes: any[]; edges: any[] }): Promise<void> {
    const { nodes, edges } = schema;

    this.schema = schema;

    const node_scripts = nodes.map(node => {
      const { label, properties } = node;

      let property_scripts = properties.map(property => {
        const { name, type, primaryKey } = property;
        return `${name} ${this.typeConvert(type)}`;
      });
      const primary_keys = properties
        .map(property => {
          const { name, type, primaryKey } = property;
          if (primaryKey) {
            return `PRIMARY KEY (${name})`;
          }
          return null;
        })
        .filter(key => key !== null);
      const final_property_scripts = property_scripts.concat(primary_keys);
      return `CREATE NODE TABLE ${label} (${final_property_scripts.join(', ')});`;
    });
    const edge_scripts = edges.map(edge => {
      const { label, source, target, properties } = edge;

      const property_scripts = properties.map(property => {
        const { name, type } = property;
        return `${name} ${this.typeConvert(type)}`;
      });
      if (property_scripts.length === 0) {
        return `CREATE REL TABLE ${label} (FROM ${source} TO ${target});`;
      }
      return `CREATE REL TABLE ${label} (FROM ${source} TO ${target} , ${property_scripts.join(', ')});`;
    });

    /** execute */
    let result: any[] = [];

    for (let i = 0; i < node_scripts.length; i++) {
      console.log('create nodes script: ', node_scripts[i]);
      const res = await this.conn?.execute(node_scripts[i]);
      result.push(res.toString());
    }
    for (let i = 0; i < edge_scripts.length; i++) {
      console.log('create edges script: ', edge_scripts[i]);
      const res = await this.conn?.execute(edge_scripts[i]);
      result.push(res.toString());
    }

    console.log('Schema created: ', result);
  }
  async uploadCsvFile(file: File, meta): Promise<any> {
    return new Promise((resolve, reject) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = async e => {
          try {
            //@ts-ignore
            var fileData = new Uint8Array(e.target.result);
            var fileName = file.name;
            var filePath = 'data/' + fileName;
            var label_name = file.name.split('.')[0];
            await this.FS.writeFile(filePath, fileData);
            var res;

            const { delimiter } = meta;
            res = await this.conn?.execute(
              `COPY ${label_name} FROM "${filePath}" (HEADER=true, DELIM='${delimiter}');`,
            );
            resolve(res); // Resolve the Promise
          } catch (error) {
            reject(error); // Reject the Promise on error
          }
        };

        reader.onerror = error => {
          reject(error); // Handle error case
        };

        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error('No file provided'));
      }
    });
  }
  async loadGraph(data_files: File[]): Promise<any> {
    const logs: any = {
      nodes: [],
      edges: [],
    };

    for (const node of this.schema.nodes) {
      const file = data_files.find(item => {
        //@ts-ignore
        return item.name === node.label + '.csv';
      });
      if (file) {
        console.log('node: ', file.name);
        await this.uploadCsvFile(file, node.meta).then(res => {
          logs.nodes.push({
            name: file.name,
            message: res.toString(),
          });
        });
      }
    }
    for (const edge of this.schema.edges) {
      const file = data_files.find(item => {
        //@ts-ignore
        return item.name === edge.label + '.csv';
      });
      if (file) {
        await this.uploadCsvFile(file, edge.meta).then(res => {
          logs.edges.push({
            name: file.name,
            message: res.toString(),
          });
        });
      }
    }
    return logs;
  }

  pathJoin(...segments) {
    return segments
      .filter(segment => segment)
      .join('/')
      .replace(/\/+/g, '/');
  }

  async rmdirs(dir: string) {
    let entries = await this.FS.readdir(dir);
    console.log(entries);

    let results = await Promise.all(
      entries.map(async entry => {
        if (entry !== '.' && entry !== '..') {
          let fullPath = this.pathJoin(dir, entry);
          console.log(`remove ${fullPath}`);

          const { mode, timestamp } = await this.FS.lookupPath(fullPath).node;
          if (this.FS.isFile(mode)) {
            await this.FS.unlink(fullPath);
          } else if (this.FS.isDir(mode)) {
            await this.rmdirs(fullPath);
          }
        }
      }),
    );

    try {
      await this.FS.rmdir(dir);
    } catch {
      console.log(`Error when remove ${dir}`);
    }
  }

  async query(queryScript: string): Promise<any> {
    if (queryScript === 'CALL kuzu.meta.schema') {
      return await this.querySchema();
    }
    if (queryScript === 'CALL kuzu.meta.statistics') {
      return await this.getCount();
    }
    console.time('Query cost');
    const queryResult = await this.conn?.execute(queryScript);
    console.timeEnd('Query cost');
    if (!queryResult) {
      return {
        nodes: [],
        edges: [],
        raw: [],
      };
    }
    try {
      const data = JSON.parse(queryResult.table.toString());

      const nodes: any[] = [];
      const edges: any[] = [];

      data.forEach(record => {
        Object.values(record).forEach(item => {
          //@ts-ignore
          const { _ID, _SRC, _DST, _LABEL, ...others } = item;
          if (_ID) {
            const { offset, table } = _ID;
            const id = `"${table}:${offset}"`;
            const isEdge = _SRC && _DST;
            if (isEdge) {
              const source = `"${_SRC.table}:${_SRC.offset}"`;
              const target = `"${_DST.table}:${_DST.offset}"`;
              edges.push({
                id,
                label: _LABEL,
                source,
                target,
                properties: {
                  ...others,
                },
              });
            } else {
              nodes.push({
                id,
                label: _LABEL,
                properties: {
                  ...others,
                },
              });
            }
          }
        });
      });
      const _nodes = uniqueElementsBy(nodes, (a, b) => {
        return a.id === b.id;
      });
      const _edges = uniqueElementsBy(edges, (a, b) => {
        return a.id === b.id;
      });
      console.log({ nodes: _nodes, edges: _edges, raw: data });
      return { nodes: _nodes, edges: _edges, raw: data };
    } catch (error) {
      console.error(error);
      return {
        nodes: [],
        edges: [],
        raw: JSON.parse(queryResult.table.toString()),
      };
    }
  }

  async querySchema(): Promise<any> {
    const tables_raw = await this.conn?.execute(`call show_tables() return *`);
    const tables = JSON.parse(tables_raw.table.toString());
    const nodes: {
      label: string;
      properties: {
        name: string;
        type: string;
      }[];
    }[] = [];
    const edges: {
      source: string;
      target: string;
      label: string;
      properties: {
        name: string;
        type: string;
      }[];
    }[] = [];
    for (let i = 0; i < tables.length; i++) {
      const { name, type } = tables[i];
      const properties_raw = await this.conn?.execute(`call TABLE_INFO('${name}') return *`);
      const properties = JSON.parse(properties_raw.table.toString());
      if (type === 'NODE') {
        nodes.push({
          label: name,
          properties: properties.map(c => ({
            name: c.name,
            type: c.type,
          })),
        });
      }
      if (type === 'REL') {
        const relationship_raw = await this.conn?.execute(`call SHOW_CONNECTION('${name}') return *`);
        const relationship = JSON.parse(relationship_raw.table.toString())[0];

        edges.push({
          source: relationship['source table name'],
          target: relationship['destination table name'],
          label: name,
          properties: properties.map(c => ({
            name: c.name,
            type: c.type,
          })),
        });
      }
    }

    return {
      nodes,
      edges,
    };
  }

  async getCount() {
    if (this.curDataset === '') {
      return [0, 0];
    }

    var vertex_res = await this.conn?.execute('MATCH (n) RETURN COUNT(n) AS vertex_count;');
    var edge_res = await this.conn?.execute('MATCH ()-[r]->() RETURN COUNT(r) AS edge_count;');

    const vertex_count = parseInt(vertex_res.toString().split('\n')[1], 10);
    const edge_count = parseInt(edge_res.toString().split('\n')[1], 10);
    const countArray = [vertex_count, edge_count];

    return countArray;
  }

  async loadFromIndexDB(): Promise<void> {
    const syncfsPromise = () => {
      return new Promise<void>((resolve, reject) => {
        this.FS.syncfs(true, function (err) {
          if (err) {
            console.error('Error loading from indexdb: ', err);
            reject(err);
          } else {
            console.log('Load from indexdb successfully');
            resolve();
          }
        });
      });
    };

    await syncfsPromise();
    console.log('finish load from indexdb');
  }

  async openDataset(): Promise<void> {
    console.log(this.FS.readdir('/'));
    console.log(`Open dataset ${this.curDataset}`);

    //@ts-ignore
    this.db = await this.kuzuEngine.Database(this.curDataset, 0, 10, false, false, 4194304 * 16 * 4);
    //@ts-ignore
    this.conn = await this.kuzuEngine.Connection(this.db);

    const res = await this.conn?.execute('MATCH (n) RETURN count(n);');
    console.log(res.toString());
  }

  async closeDataset(): Promise<void> {
    console.log(`Close dataset ${this.curDataset}`);

    if (this.conn) {
      await this.conn.close();
      console.log('Connection closed.');
    }
    if (this.db) {
      await this.db.close();
      console.log('Database closed.');
    }
  }

  async writeBack(): Promise<{ success: boolean; message: string }> {
    console.log('start to write back');
    return new Promise(resolve => {
      this.FS.syncfs(false, function (err) {
        if (err) {
          console.error('Error saving to indexdb: ', err);
          resolve({
            success: false,
            message: err,
          });
        } else {
          console.log('Save to indexdb successfully');
          resolve({
            success: true,
            message: 'Save to indexdb successfully',
          });
        }
      });
    });
  }

  async close(): Promise<void> {
    //await this.writeBack();
    await this.closeDataset();
  }
  async cancel(): Promise<void> {
    await this.closeDataset();
  }
}
