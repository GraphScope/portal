import * as duckdb from "@duckdb/duckdb-wasm";
import { get, set, del, keys } from "idb-keyval";

interface DatasetInfo {
  name: string;
  description: string;
  fileName: string;
  dateAdded: string;
  rowCount: number;
  schema: Array<{
    column_name: string;
    column_type: string;
  }>;
  size: number;
}

interface DuckDBBundle {
  mainModule: string;
  mainWorker: string;
}

interface DuckDBBundles {
  mvp: DuckDBBundle;
  eh: DuckDBBundle;
}

class DuckDBService {
  private db: duckdb.AsyncDuckDB | null;
  private conn: any | null; // 使用 any 类型暂时替代 AsyncConnection
  private initialized: boolean;
  private datasets: Map<string, DatasetInfo>;
  private readonly STORAGE_PREFIX: string;
  private readonly DATASET_INDEX_KEY: string;

  constructor() {
    this.db = null;
    this.conn = null;
    this.initialized = false;
    this.datasets = new Map();
    this.STORAGE_PREFIX = "duckdb-dataset-";
    this.DATASET_INDEX_KEY = "duckdb-datasets-index";
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // 初始化 WASM 模块
      const JSDELIVR_BUNDLES: DuckDBBundles = {
        mvp: {
          mainModule: "/duckdb/duckdb-mvp.wasm",
          mainWorker: "/duckdb/duckdb-browser-mvp.worker.js",
        },
        eh: {
          mainModule: "/duckdb/duckdb-eh.wasm",
          mainWorker: "/duckdb/duckdb-browser-eh.worker.js",
        },
      };

      // 选择适当的 bundle
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
      if (!bundle.mainWorker) {
        throw new Error("Failed to load DuckDB worker");
      }
      const worker = new Worker(bundle.mainWorker);
      const logger = new duckdb.ConsoleLogger();

      // 创建数据库实例
      this.db = new duckdb.AsyncDuckDB(logger, worker);
      await this.db.instantiate(bundle.mainModule);

      // 创建连接
      this.conn = await this.db.connect();

      // 初始化完成
      this.initialized = true;

      // 加载保存的数据集索引
      await this.loadDatasetIndex();

      console.log("DuckDB initialized successfully");
    } catch (error) {
      console.error("Failed to initialize DuckDB:", error);
      throw error;
    }
  }

  private async loadDatasetIndex(): Promise<void> {
    try {
      const savedIndex = (await get<string[]>(this.DATASET_INDEX_KEY)) || [];
      for (const datasetName of savedIndex) {
        const datasetInfo = await get<DatasetInfo>(
          `${this.STORAGE_PREFIX}info-${datasetName}`
        );
        if (datasetInfo) {
          this.datasets.set(datasetName, datasetInfo);
        }
      }
    } catch (error) {
      console.error("Error loading dataset index:", error);
    }
  }

  private async saveDatasetIndex(): Promise<void> {
    try {
      const datasetNames = Array.from(this.datasets.keys());
      await set(this.DATASET_INDEX_KEY, datasetNames);
    } catch (error) {
      console.error("Error saving dataset index:", error);
    }
  }

  async registerDataset(
    name: string,
    file: File,
    description: string = ""
  ): Promise<DatasetInfo> {
    await this.init();

    try {
      // 读取 CSV 文件
      const dataBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(dataBuffer); // 转换为 Uint8Array

      // 保存到 IndexedDB
      await set(`${this.STORAGE_PREFIX}${name}`, dataBuffer);

      // 将文件注册到 DuckDB 的虚拟文件系统
      const filePath = `${this.STORAGE_PREFIX}${name}.csv`;
      await this.db!.registerFileBuffer(filePath, uint8Array);

      // 使用 insertCSVFromPath 加载 CSV 数据
      await this.conn!.insertCSVFromPath(filePath, {
        schema: "main", // 默认 schema
        name: name, // 表名
        autoDetect: true, // 自动检测 CSV 格式
      });

      // 获取表结构信息
      const schemaResult = await this.conn!.query(`DESCRIBE "${name}"`);
      const schema = schemaResult.toArray().map((row: any) => ({
        column_name: row.column_name,
        column_type: row.column_type,
      }));

      // 获取记录数
      const countResult = await this.conn!.query(
        `SELECT COUNT(*) as count FROM "${name}"`
      );
      const count = countResult.toArray()[0].count;

      // 保存数据集信息
      const datasetInfo: DatasetInfo = {
        name,
        description,
        fileName: file.name,
        dateAdded: new Date().toISOString(),
        rowCount: count,
        schema,
        size: file.size,
      };

      // 保存到 IndexedDB
      await set(`${this.STORAGE_PREFIX}info-${name}`, datasetInfo);

      // 更新内存中的数据集映射
      this.datasets.set(name, datasetInfo);

      // 保存数据集索引
      await this.saveDatasetIndex();

      return datasetInfo;
    } catch (error) {
      console.error(`Error registering dataset ${name}:`, error);
      throw error;
    }
  }

  async getAllDatasets(): Promise<DatasetInfo[]> {
    await this.init();
    return Array.from(this.datasets.values());
  }

  async getDatasetInfo(name: string): Promise<DatasetInfo | undefined> {
    await this.init();
    return this.datasets.get(name);
  }

  async deleteDataset(name: string): Promise<boolean> {
    await this.init();

    try {
      // 删除表
      await this.conn!.query(`DROP TABLE IF EXISTS "${name}"`);

      // 从 IndexedDB 中删除数据
      await del(`${this.STORAGE_PREFIX}${name}`);
      await del(`${this.STORAGE_PREFIX}info-${name}`);

      // 从内存映射中删除
      this.datasets.delete(name);

      // 更新数据集索引
      await this.saveDatasetIndex();

      return true;
    } catch (error) {
      console.error(`Error deleting dataset ${name}:`, error);
      throw error;
    }
  }

  async loadDataset(name: string): Promise<boolean> {
    await this.init();

    try {
      if (!this.datasets.has(name)) {
        throw new Error(`Dataset '${name}' not found`);
      }

      // 检查表是否已经存在
      const tableExists = await this.tableExists(name);

      if (!tableExists) {
        // 从 IndexedDB 中加载数据
        const serializedData = await get<ArrayBuffer>(
          `${this.STORAGE_PREFIX}${name}`
        );
        if (!serializedData) {
          throw new Error(`Data for dataset '${name}' not found`);
        }

        // 将 ArrayBuffer 转换为 Uint8Array
        const uint8Array = new Uint8Array(serializedData);

        // 注册文件到 DuckDB 的虚拟文件系统
        const filePath = `${this.STORAGE_PREFIX}${name}.csv`;
        await this.db!.registerFileBuffer(filePath, uint8Array);

        // 在 DuckDB 中创建表
        await this.conn!.query(
          `CREATE TABLE IF NOT EXISTS "${name}" AS SELECT * FROM read_csv_auto('${filePath}')`
        );
      }

      return true;
    } catch (error) {
      console.error(`Error loading dataset ${name}:`, error);
      throw error;
    }
  }

  private async tableExists(name: string): Promise<boolean> {
    try {
      const result = await this.conn!.query(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='${name}'
      `);
      return result.toArray().length > 0;
    } catch (error) {
      console.error(`Error checking if table ${name} exists:`, error);
      return false;
    }
  }

  async executeQuery(query: string): Promise<any> {
    await this.init();

    try {
      const result = await this.conn!.query(query);
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }

  async getPreviewData(name: string, limit: number = 10): Promise<any> {
    await this.init();
    await this.loadDataset(name);

    try {
      const result = await this.conn!.query(
        `SELECT * FROM "${name}" LIMIT ${limit}`
      );
      return result;
    } catch (error) {
      console.error(`Error getting preview data for ${name}:`, error);
      throw error;
    }
  }
}

// 创建单例实例
const duckDBService = new DuckDBService();
export default duckDBService;
