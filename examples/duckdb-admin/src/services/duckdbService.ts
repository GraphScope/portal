import * as duckdb from '@duckdb/duckdb-wasm';
import { get, set, del } from 'idb-keyval';

// 类型定义
interface TableInfo {
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
  datasetId: string; // 所属数据集ID
}

interface DatasetInfo {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  tables: string[]; // 包含的表名列表
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
const TABLE_PREFIX = 'duckdb-table-';
const DATASET_INDEX_KEY = 'duckdb-datasets-index';
const TABLE_INDEX_KEY = 'duckdb-tables-index';
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
  private tables: Map<string, TableInfo>;

  constructor() {
    this.db = null;
    this.conn = null;
    this.initialized = false;
    this.datasets = new Map();
    this.tables = new Map();
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
      const savedDatasetIndex = (await get<string[]>(DATASET_INDEX_KEY)) || [];
      const savedTableIndex = (await get<string[]>(TABLE_INDEX_KEY)) || [];

      for (const datasetId of savedDatasetIndex) {
        const datasetInfo = await get<DatasetInfo>(`${STORAGE_PREFIX}${datasetId}`);
        if (datasetInfo) {
          this.datasets.set(datasetId, datasetInfo);
        }
      }

      for (const tableName of savedTableIndex) {
        const tableInfo = await get<TableInfo>(`${TABLE_PREFIX}${tableName}`);
        if (tableInfo) {
          this.tables.set(tableName, tableInfo);
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
      const datasetIds = Array.from(this.datasets.keys());
      const tableNames = Array.from(this.tables.keys());
      await set(DATASET_INDEX_KEY, datasetIds);
      await set(TABLE_INDEX_KEY, tableNames);
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
   * 创建新数据集
   */
  async createDataset(name: string, description: string = ''): Promise<DatasetInfo> {
    await this.ensureInitialized();

    const id = `ds_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      const datasetInfo: DatasetInfo = {
        id,
        name,
        description,
        dateCreated: new Date().toISOString(),
        tables: [],
      };

      // 保存到IndexedDB并更新内存中的映射
      await set(`${STORAGE_PREFIX}${id}`, datasetInfo);
      this.datasets.set(id, datasetInfo);
      await this.saveDatasetIndex();

      return datasetInfo;
    } catch (error) {
      console.error(`创建数据集 ${name} 时出错:`, error);
      throw new Error(`创建数据集失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 注册新表到数据集
   */
  async registerTable(datasetId: string, tableName: string, file: File, description: string = ''): Promise<TableInfo> {
    await this.ensureInitialized();

    if (!this.db || !this.conn) {
      throw new Error('DuckDB未正确初始化');
    }

    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`找不到数据集 ID: ${datasetId}`);
    }

    // 使用数据集名称和表名创建完整的表名
    const fullTableName = `${dataset.name}_${tableName}`;

    try {
      // 读取CSV文件
      const dataBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(dataBuffer);

      // 保存到IndexedDB
      await set(`${TABLE_PREFIX}raw_${fullTableName}`, dataBuffer);

      // 注册文件到DuckDB的虚拟文件系统
      const filePath = `${TABLE_PREFIX}${fullTableName}.csv`;
      await this.db.registerFileBuffer(filePath, uint8Array);

      // 加载CSV数据
      await this.conn.insertCSVFromPath(filePath, {
        schema: 'main',
        name: fullTableName,
        autoDetect: true,
      });

      // 获取表结构和记录数
      const schemaResult = await this.conn.query(`DESCRIBE "${fullTableName}"`);
      const schema = schemaResult.toArray().map((row: any) => ({
        column_name: row.column_name,
        column_type: row.column_type,
      }));

      const countResult = await this.conn.query(`SELECT COUNT(*) as count FROM "${fullTableName}"`);
      const count = countResult.toArray()[0].count;

      // 创建表信息
      const tableInfo: TableInfo = {
        name: tableName,
        description,
        fileName: file.name,
        dateAdded: new Date().toISOString(),
        rowCount: count,
        schema,
        size: file.size,
        datasetId,
      };

      // 保存到IndexedDB并更新内存中的映射
      await set(`${TABLE_PREFIX}${fullTableName}`, tableInfo);
      this.tables.set(fullTableName, tableInfo);

      // 更新数据集中的表列表
      dataset.tables.push(fullTableName);
      await set(`${STORAGE_PREFIX}${datasetId}`, dataset);

      await this.saveDatasetIndex();

      return tableInfo;
    } catch (error) {
      console.error(`注册表 ${tableName} 到数据集 ${dataset.name} 时出错:`, error);
      throw new Error(`注册表失败: ${error instanceof Error ? error.message : String(error)}`);
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
  async getDatasetInfo(datasetId: string): Promise<DatasetInfo | undefined> {
    await this.ensureInitialized();
    return this.datasets.get(datasetId);
  }

  /**
   * 获取数据集中的所有表
   */
  async getTablesInDataset(datasetId: string): Promise<TableInfo[]> {
    await this.ensureInitialized();

    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`找不到数据集 ID: ${datasetId}`);
    }

    return dataset.tables
      .map(tableName => this.tables.get(tableName))
      .filter(table => table !== undefined) as TableInfo[];
  }

  /**
   * 获取所有表
   */
  async getAllTables(): Promise<TableInfo[]> {
    await this.ensureInitialized();
    return Array.from(this.tables.values());
  }

  /**
   * 删除数据集
   */
  async deleteDataset(datasetId: string): Promise<boolean> {
    await this.ensureInitialized();

    if (!this.conn) {
      throw new Error('数据库连接未初始化');
    }

    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`找不到数据集 ID: ${datasetId}`);
    }

    try {
      // 删除数据集中的所有表
      for (const fullTableName of dataset.tables) {
        // 删除表
        await this.conn.query(`DROP TABLE IF EXISTS "${fullTableName}"`);

        // 从IndexedDB中删除数据
        await del(`${TABLE_PREFIX}raw_${fullTableName}`);
        await del(`${TABLE_PREFIX}${fullTableName}`);

        // 从内存映射中删除
        this.tables.delete(fullTableName);
      }

      // 删除数据集本身
      await del(`${STORAGE_PREFIX}${datasetId}`);
      this.datasets.delete(datasetId);

      await this.saveDatasetIndex();

      return true;
    } catch (error) {
      console.error(`删除数据集 ${dataset.name} 时出错:`, error);
      throw new Error(`删除数据集失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 删除表
   */
  async deleteTable(datasetId: string, tableName: string): Promise<boolean> {
    await this.ensureInitialized();

    if (!this.conn) {
      throw new Error('数据库连接未初始化');
    }

    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`找不到数据集 ID: ${datasetId}`);
    }

    const fullTableName = `${dataset.name}_${tableName}`;

    try {
      // 删除表
      await this.conn.query(`DROP TABLE IF EXISTS "${fullTableName}"`);

      // 从IndexedDB中删除数据
      await del(`${TABLE_PREFIX}raw_${fullTableName}`);
      await del(`${TABLE_PREFIX}${fullTableName}`);

      // 从内存映射中删除
      this.tables.delete(fullTableName);

      // 从数据集中移除表引用
      dataset.tables = dataset.tables.filter(t => t !== fullTableName);
      await set(`${STORAGE_PREFIX}${datasetId}`, dataset);

      await this.saveDatasetIndex();

      return true;
    } catch (error) {
      console.error(`删除表 ${tableName} 时出错:`, error);
      throw new Error(`删除表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 加载表到DuckDB
   */
  async loadTable(datasetId: string, tableName: string): Promise<boolean> {
    await this.ensureInitialized();

    if (!this.db || !this.conn) {
      throw new Error('DuckDB未正确初始化');
    }

    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`找不到数据集 ID: ${datasetId}`);
    }

    const fullTableName = `${dataset.name}_${tableName}`;

    try {
      if (!dataset.tables.includes(fullTableName)) {
        throw new Error(`数据集 ${dataset.name} 中找不到表 ${tableName}`);
      }

      // 检查表是否已经存在
      const tableExists = await this.tableExists(fullTableName);

      if (!tableExists) {
        // 从IndexedDB中加载数据
        const serializedData = await get<ArrayBuffer>(`${TABLE_PREFIX}raw_${fullTableName}`);
        if (!serializedData) {
          throw new Error(`找不到表 ${tableName} 的数据`);
        }

        // 注册文件到DuckDB的虚拟文件系统
        const uint8Array = new Uint8Array(serializedData);
        const filePath = `${TABLE_PREFIX}${fullTableName}.csv`;
        await this.db.registerFileBuffer(filePath, uint8Array);

        // 在DuckDB中创建表 - 使用专用的create table语句确保表被正确创建
        await this.conn.query(
          `CREATE TABLE IF NOT EXISTS "${fullTableName}" AS SELECT * FROM read_csv_auto('${filePath}')`,
        );

        // 验证表是否创建成功
        const verifyExists = await this.tableExists(fullTableName);
        if (!verifyExists) {
          console.error(`表 ${fullTableName} 创建失败，尝试使用备选方法`);

          // 备选方法：使用直接查询CSV
          await this.conn.query(`CREATE TABLE IF NOT EXISTS "${fullTableName}" AS SELECT * FROM '${filePath}'`);
        }
      }

      // 最终验证表是否可用
      const finalCheck = await this.tableExists(fullTableName);
      if (!finalCheck) {
        console.error(`无法验证表 ${fullTableName} 是否成功加载`);
      } else {
        console.log(`表 ${fullTableName} 已成功加载到DuckDB`);
      }

      return true;
    } catch (error) {
      console.error(`加载表 ${tableName} 时出错:`, error);
      throw new Error(`加载表失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 加载数据集中的所有表
   */
  async loadDataset(datasetId: string): Promise<boolean> {
    await this.ensureInitialized();

    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`找不到数据集 ID: ${datasetId}`);
    }

    try {
      // 加载数据集中的所有表
      const loadedTables = [];
      for (const fullTableName of dataset.tables) {
        const tableName = fullTableName.replace(`${dataset.name}_`, '');
        await this.loadTable(datasetId, tableName);
        loadedTables.push(fullTableName);
      }

      // 确保所有表已正确加载
      if (this.conn && loadedTables.length > 0) {
        console.log(`数据集 ${dataset.name} 加载了 ${loadedTables.length} 个表`);

        // 验证所有表是否可查询
        for (const tableName of loadedTables) {
          const exists = await this.tableExists(tableName);
          if (!exists) {
            console.warn(`表 ${tableName} 未成功加载到 DuckDB`);
          }
        }
      }

      return true;
    } catch (error) {
      console.error(`加载数据集 ${dataset.name} 时出错:`, error);
      throw new Error(`加载数据集失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 获取表的预览数据
   */
  async getTablePreview(datasetId: string, tableName: string, limit: number = 10): Promise<any> {
    await this.ensureInitialized();
    await this.loadTable(datasetId, tableName);

    if (!this.conn) {
      throw new Error('数据库连接未初始化');
    }

    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`找不到数据集 ID: ${datasetId}`);
    }

    const fullTableName = `${dataset.name}_${tableName}`;

    try {
      return await this.conn.query(`SELECT * FROM "${fullTableName}" LIMIT ${limit}`);
    } catch (error) {
      console.error(`获取表 ${tableName} 的预览数据时出错:`, error);
      throw new Error(`获取预览数据失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 执行SQL查询
   */
  async executeQuery(query: string, currentDatasetId?: string): Promise<any> {
    await this.ensureInitialized();

    if (!this.conn) {
      throw new Error('数据库连接未初始化');
    }

    try {
      // 特殊处理'show tables'查询
      if (query.trim().toLowerCase() === 'show tables') {
        try {
          if (currentDatasetId) {
            // 如果指定了数据集ID，只显示该数据集的表
            const dataset = this.datasets.get(currentDatasetId);
            if (!dataset) {
              throw new Error(`找不到数据集 ID: ${currentDatasetId}`);
            }

            // 获取当前数据集的表
            const tableRows = dataset.tables.map(name => ({ table_name: name }));

            // 返回自定义的结果结构
            return {
              schema: {
                fields: [{ name: 'table_name', type: 'VARCHAR' }],
              },
              toArray: () => tableRows,
            };
          } else {
            // 直接使用DuckDB原生的SHOW TABLES命令
            return await this.conn.query(`SHOW TABLES`);
          }
        } catch (showTableError) {
          console.warn('原生SHOW TABLES命令失败，使用备选方法:', showTableError);

          if (currentDatasetId) {
            // 如果指定了数据集ID，只显示该数据集的表
            const dataset = this.datasets.get(currentDatasetId);
            if (!dataset) {
              throw new Error(`找不到数据集 ID: ${currentDatasetId}`);
            }

            // 获取当前数据集的表
            const prefix = `${dataset.name}_`;

            // 使用SQLITE_MASTER表查询当前数据集的表
            return await this.conn.query(`
              SELECT name as table_name 
              FROM sqlite_master 
              WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name LIKE '${prefix}%'
              ORDER BY name
            `);
          } else {
            // 如果原生命令失败，使用SQLITE_MASTER表查询所有表
            return await this.conn.query(`
              SELECT name as table_name 
              FROM sqlite_master 
              WHERE type='table' AND name NOT LIKE 'sqlite_%'
              ORDER BY name
            `);
          }
        }
      }

      // 处理其他查询
      return await this.conn.query(query);
    } catch (error) {
      console.error('执行查询时出错:', error);
      throw new Error(`查询执行失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// 创建单例实例
const duckDBService = new DuckDBService();
export default duckDBService;
