import * as duckdb from '@duckdb/duckdb-wasm';
import { get, set, del } from 'idb-keyval';

// 类型定义
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

// 常量
const STORAGE_PREFIX = 'duckdb-dataset-';
const DATASET_INDEX_KEY = 'duckdb-datasets-index';
const JSDELIVR_BUNDLES: DuckDBBundles = {
  mvp: {
    mainModule: '/duckdb/duckdb-mvp.wasm',
    mainWorker: '/duckdb/duckdb-browser-mvp.worker.js',
  },
  eh: {
    mainModule: '/duckdb/duckdb-eh.wasm',
    mainWorker: '/duckdb/duckdb-browser-eh.worker.js',
  },
};

/**
 * DuckDB服务类 - 管理浏览器中的DuckDB实例和数据集
 */
class DuckDBService {
  private db: duckdb.AsyncDuckDB | null;
  private conn: any | null; // DuckDB连接对象
  private initialized: boolean;
  private datasets: Map<string, DatasetInfo>;

  constructor() {
    this.db = null;
    this.conn = null;
    this.initialized = false;
    this.datasets = new Map();
  }

  /**
   * 初始化DuckDB及其Web Assembly环境
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // 选择适当的bundle
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
      if (!bundle.mainWorker) {
        throw new Error('无法加载DuckDB worker');
      }

      const worker = new Worker(bundle.mainWorker);
      const logger = new duckdb.ConsoleLogger();

      // 创建数据库实例
      this.db = new duckdb.AsyncDuckDB(logger, worker);
      await this.db.instantiate(bundle.mainModule);

      // 创建连接
      this.conn = await this.db.connect();

      // 标记初始化完成
      this.initialized = true;

      // 加载保存的数据集索引
      await this.loadDatasetIndex();

      console.log('DuckDB初始化成功');
    } catch (error) {
      console.error('DuckDB初始化失败:', error);
      throw new Error(`DuckDB初始化错误: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 确保服务已初始化
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }

  /**
   * 从IndexedDB加载数据集索引
   */
  private async loadDatasetIndex(): Promise<void> {
    try {
      const savedIndex = (await get<string[]>(DATASET_INDEX_KEY)) || [];

      for (const datasetName of savedIndex) {
        const datasetInfo = await get<DatasetInfo>(`${STORAGE_PREFIX}info-${datasetName}`);
        if (datasetInfo) {
          this.datasets.set(datasetName, datasetInfo);
        }
      }
    } catch (error) {
      console.error('加载数据集索引错误:', error);
    }
  }

  /**
   * 将数据集索引保存到IndexedDB
   */
  private async saveDatasetIndex(): Promise<void> {
    try {
      const datasetNames = Array.from(this.datasets.keys());
      await set(DATASET_INDEX_KEY, datasetNames);
    } catch (error) {
      console.error('保存数据集索引错误:', error);
    }
  }

  /**
   * 检查表是否存在
   */
  private async tableExists(name: string): Promise<boolean> {
    if (!this.conn) {
      throw new Error('数据库连接未初始化');
    }

    try {
      const result = await this.conn.query(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='${name}'
      `);
      return result.toArray().length > 0;
    } catch (error) {
      console.error(`检查表 ${name} 是否存在时出错:`, error);
      return false;
    }
  }

  /**
   * 注册新数据集
   */
  async registerDataset(name: string, file: File, description: string = ''): Promise<DatasetInfo> {
    await this.ensureInitialized();

    if (!this.db || !this.conn) {
      throw new Error('DuckDB未正确初始化');
    }

    try {
      // 读取CSV文件
      const dataBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(dataBuffer);

      // 保存到IndexedDB
      await set(`${STORAGE_PREFIX}${name}`, dataBuffer);

      // 注册文件到DuckDB的虚拟文件系统
      const filePath = `${STORAGE_PREFIX}${name}.csv`;
      await this.db.registerFileBuffer(filePath, uint8Array);

      // 加载CSV数据
      await this.conn.insertCSVFromPath(filePath, {
        schema: 'main',
        name: name,
        autoDetect: true,
      });

      // 获取表结构和记录数
      const schemaResult = await this.conn.query(`DESCRIBE "${name}"`);
      const schema = schemaResult.toArray().map((row: any) => ({
        column_name: row.column_name,
        column_type: row.column_type,
      }));

      const countResult = await this.conn.query(`SELECT COUNT(*) as count FROM "${name}"`);
      const count = countResult.toArray()[0].count;

      // 创建数据集信息
      const datasetInfo: DatasetInfo = {
        name,
        description,
        fileName: file.name,
        dateAdded: new Date().toISOString(),
        rowCount: count,
        schema,
        size: file.size,
      };

      // 保存到IndexedDB并更新内存中的映射
      await set(`${STORAGE_PREFIX}info-${name}`, datasetInfo);
      this.datasets.set(name, datasetInfo);
      await this.saveDatasetIndex();

      return datasetInfo;
    } catch (error) {
      console.error(`注册数据集 ${name} 时出错:`, error);
      throw new Error(`注册数据集失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取所有数据集
   */
  async getAllDatasets(): Promise<DatasetInfo[]> {
    await this.ensureInitialized();
    return Array.from(this.datasets.values());
  }

  /**
   * 获取特定数据集信息
   */
  async getDatasetInfo(name: string): Promise<DatasetInfo | undefined> {
    await this.ensureInitialized();
    return this.datasets.get(name);
  }

  /**
   * 删除数据集
   */
  async deleteDataset(name: string): Promise<boolean> {
    await this.ensureInitialized();

    if (!this.conn) {
      throw new Error('数据库连接未初始化');
    }

    try {
      // 删除表
      await this.conn.query(`DROP TABLE IF EXISTS "${name}"`);

      // 从IndexedDB中删除数据
      await del(`${STORAGE_PREFIX}${name}`);
      await del(`${STORAGE_PREFIX}info-${name}`);

      // 从内存映射中删除
      this.datasets.delete(name);
      await this.saveDatasetIndex();

      return true;
    } catch (error) {
      console.error(`删除数据集 ${name} 时出错:`, error);
      throw new Error(`删除数据集失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 加载数据集到DuckDB
   */
  async loadDataset(name: string): Promise<boolean> {
    await this.ensureInitialized();

    if (!this.db || !this.conn) {
      throw new Error('DuckDB未正确初始化');
    }

    try {
      if (!this.datasets.has(name)) {
        throw new Error(`找不到数据集 '${name}'`);
      }

      // 检查表是否已经存在
      const tableExists = await this.tableExists(name);

      if (!tableExists) {
        // 从IndexedDB中加载数据
        const serializedData = await get<ArrayBuffer>(`${STORAGE_PREFIX}${name}`);
        if (!serializedData) {
          throw new Error(`找不到数据集 '${name}' 的数据`);
        }

        // 注册文件到DuckDB的虚拟文件系统
        const uint8Array = new Uint8Array(serializedData);
        const filePath = `${STORAGE_PREFIX}${name}.csv`;
        await this.db.registerFileBuffer(filePath, uint8Array);

        // 在DuckDB中创建表
        await this.conn.query(`CREATE TABLE IF NOT EXISTS "${name}" AS SELECT * FROM read_csv_auto('${filePath}')`);
      }

      return true;
    } catch (error) {
      console.error(`加载数据集 ${name} 时出错:`, error);
      throw new Error(`加载数据集失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 执行SQL查询
   */
  async executeQuery(query: string): Promise<any> {
    await this.ensureInitialized();

    if (!this.conn) {
      throw new Error('数据库连接未初始化');
    }

    try {
      return await this.conn.query(query);
    } catch (error) {
      console.error('执行查询时出错:', error);
      throw new Error(`查询执行失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取数据集预览
   */
  async getPreviewData(name: string, limit: number = 10): Promise<any> {
    await this.ensureInitialized();
    await this.loadDataset(name);

    if (!this.conn) {
      throw new Error('数据库连接未初始化');
    }

    try {
      return await this.conn.query(`SELECT * FROM "${name}" LIMIT ${limit}`);
    } catch (error) {
      console.error(`获取 ${name} 的预览数据时出错:`, error);
      throw new Error(`获取预览数据失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// 创建单例实例
const duckDBService = new DuckDBService();
export default duckDBService;
