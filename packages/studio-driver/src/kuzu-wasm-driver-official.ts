import kuzu from 'kuzu-wasm';
// import a from 'kuzu-wasm/kuzu_wasm_worker'
import { uniqueElementsBy } from './utils';
import { debug } from 'console';

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
  query: (queryScript: string) => Promise<any>;
}

interface IKuzuDatabase {
  close: () => Promise<void>;
}

interface IKuzuConnection {
  query: (queryScript: string) => Promise<any>;
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
  kuzu: typeof kuzu;
  db: IKuzuDatabase | null;
  conn: IKuzuConnection | null;
  FS: any;
  dbname: string;
  schema: { nodes: any[]; edges: any[] };
  curDataset: string;
  targetPath: string;
  kuzuEngine: IKuzuResult | null;
  indexdb: any;
  mountedPath: Set<any>;

  constructor() {
    this.kuzu = kuzu;
    this.db = null;
    this.conn = null;
    this.FS = null;
    this.schema = { nodes: [], edges: [] };
    this.dbname = '';
    this.curDataset = '';
    this.targetPath = '';
    this.kuzuEngine = null;
    this.mountedPath = new Set();
  }

  async initialize(): Promise<void> {
    console.log('initialize again official');
    this.kuzuEngine = await this.kuzu;

    //@ts-ignore

    // this.db = await result.Database(this.dbname, 0, 10, false, false, 4194304 * 16 * 4);
    // this.conn = await result.Connection(this.db);
    this.FS = this.kuzuEngine.FS;
    console.log('mkdir');
    try {
      await this.FS?.mkdir('data');
    } catch {
      console.log('folder data already exists');
    }
    console.log('finish mkdir');

    // this.FS?.mkdir('export');
  }

  async installUDF(): Promise<void> {
    try {
      var res = await this.conn?.query('CREATE MACRO elementid(x) AS CAST(ID(x),"STRING")');
      console.log(await res.toString());
      await res.close();
    } catch (err) {
      console.log(err);
    }
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

    await this.FS?.mountIdbfs(this.targetPath);
    console.log('Mount ', this.targetPath);
    // if (!this.mountedPath.has(targetPath)) {
    //   console.log(`MOUNT ${this.curDataset} ...`);
    //   try {
    //     await this.FS?.mountIdbfs(targetPath);
    //     this.mountedPath.add(targetPath);
    //   } catch (err) {
    //     console.error(`Error mounting:`, err);
    //   }
    // }

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
    this.targetPath = this.pathJoin('/', this.curDataset);
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

    /** query */
    let result: any[] = [];

    for (let i = 0; i < node_scripts.length; i++) {
      console.log('create nodes script: ', node_scripts[i]);
      const res = await this.conn?.query(node_scripts[i]);
      result.push(await res.toString());
      await res.close();
    }
    for (let i = 0; i < edge_scripts.length; i++) {
      console.log('create edges script: ', edge_scripts[i]);
      const res = await this.conn?.query(edge_scripts[i]);
      result.push(await res.toString());
      await res.close();
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
            res = await this.conn?.query(`COPY ${label_name} FROM "${filePath}" (HEADER=true, DELIM='${delimiter}');`);
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
        try {
          const res = await this.uploadCsvFile(file, node.meta);
          const message = await res.toString();
          await res.close();
          logs.nodes.push({
            name: file.name,
            message: message,
          });
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
    for (const edge of this.schema.edges) {
      const file = data_files.find(item => {
        //@ts-ignore
        return item.name === edge.label + '.csv';
      });
      if (file) {
        try {
          const res = await this.uploadCsvFile(file, edge.meta);
          const message = await res.toString();
          await res.close();
          logs.edges.push({
            name: file.name,
            message: message,
          });
        } catch (error) {
          console.error('Error uploading file:', error);
        }
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
    let entries = await this.FS.readDir(dir);
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
    console.log('query: ', queryScript);
    if (queryScript === 'CALL kuzu.meta.schema') {
      return await this.querySchema();
    }
    if (queryScript === 'CALL kuzu.meta.statistics') {
      return await this.getCount();
    }
    console.time('Query cost');
    const queryResult = await this.conn?.query(queryScript);
    console.timeEnd('Query cost');
    if (!queryResult) {
      await queryResult.close();
      return {
        nodes: [],
        edges: [],
        raw: [],
      };
    }
    try {
      const data = await queryResult.getAllObjects();
      // const data = JSON.parse(qres);

      const nodes: any[] = [];
      const edges: any[] = [];

      data.forEach(record => {
        Object.values(record).forEach(item => {
          //@ts-ignore
          const { _id, _src, _dst, _label, ...others } = item;
          if (_id) {
            const { offset, table } = _id;
            const id = `"${table}:${offset}"`;
            const isEdge = _src && _dst;
            if (isEdge) {
              const source = `"${_src.table}:${_src.offset}"`;
              const target = `"${_dst.table}:${_dst.offset}"`;
              edges.push({
                id,
                label: _label,
                source,
                target,
                properties: {
                  ...others,
                },
              });
            } else {
              nodes.push({
                id,
                label: _label,
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
      await queryResult.close();
      return { nodes: _nodes, edges: _edges, raw: data };
    } catch (error) {
      console.error(error);
      const raw_data = JSON.parse(await queryResult.toString());
      await queryResult.close();
      return {
        nodes: [],
        edges: [],
        raw: raw_data,
      };
    }
  }

  async querySchema(): Promise<any> {
    console.log('query schema');
    const tables_raw = await this.conn?.query(`call show_tables() return *`);
    const tables = await tables_raw.getAllObjects();
    await tables_raw.close();
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
      const properties_raw = await this.conn?.query(`call TABLE_INFO('${name}') return *`);
      const properties = await properties_raw.getAllObjects();
      await properties_raw.close();
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
        const relationship_raw = await this.conn?.query(`call SHOW_CONNECTION('${name}') return *`);
        const all_objects = await relationship_raw.getAllObjects();
        console.log(name, type, all_objects);
        const relationship = all_objects[0];
        await relationship_raw.close();

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

    var vertex_res = await this.conn?.query('MATCH (n) RETURN COUNT(n) AS vertex_count;');
    var edge_res = await this.conn?.query('MATCH ()-[r]->() RETURN COUNT(r) AS edge_count;');

    var vertex_res_str = await vertex_res.toString();
    var edge_res_str = await edge_res.toString();
    const vertex_count = parseInt(vertex_res_str.split('\n')[1], 10);
    const edge_count = parseInt(edge_res_str.split('\n')[1], 10);
    const countArray = [vertex_count, edge_count];
    await vertex_res.close();
    await edge_res.close();

    return countArray;
  }

  async loadFromIndexDB(): Promise<void> {
    try {
      await this.FS.syncfs(true); // 直接 await 异步的 syncfs 方法
      console.log('Load from indexdb successfully');
    } catch (err) {
      console.error('Error loading from indexdb: ', err);
      // 你可以在此进行更多错误处理逻辑
    }
    console.log('finish load from indexdb');
  }

  async openDataset(): Promise<void> {
    console.log(await this.FS.readDir('/'));
    console.log(`Open dataset ${this.curDataset}`);

    //@ts-ignore
    this.db = new this.kuzuEngine.Database(this.curDataset);
    //@ts-ignore
    this.conn = new this.kuzuEngine.Connection(this.db);

    const res = await this.conn?.query('MATCH (n) RETURN count(n);');
    console.log(await res.toString());
    await res.close();
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

    await this.FS.unmount(this.targetPath);
    console.log('Unmount ', this.targetPath);
  }

  async writeBack(): Promise<{ success: boolean; message: string }> {
    console.log('start to write back');

    try {
      console.log('Attempting to sync to IndexDB...');
      await this.FS.syncfs(false); // 直接 await 异步的 syncfs 方法

      console.log('Save to indexdb successfully');
      return {
        success: true,
        message: 'Save to indexdb successfully',
      };
    } catch (err) {
      console.error('Error saving to indexdb: ', err);
      return {
        success: false,
        //@ts-ignore
        message: 'error: ' + err.toString(), // 使用 toString 获得详细的错误信息
      };
    }
  }

  async close(): Promise<{ success: boolean; message: string }> {
    //await this.writeBack();
    try {
      await this.closeDataset();
      console.log('Close database successfully');
      return {
        success: true,
        message: 'Cloase database successfully',
      };
    } catch (err) {
      console.error('Error saving to indexdb: ', err);
      return {
        success: false,
        //@ts-ignore
        message: 'error: ' + err.toString(), // 使用 toString 获得详细的错误信息
      };
    }
  }
  async cancel(): Promise<void> {
    await this.closeDataset();
  }
}
