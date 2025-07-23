import OSS from "ali-oss";
import logger from "../utils/logger";
import { ApiError } from "../middleware/error-handler";

interface OSSConfig {
  accessKeyId: string;
  accessKeySecret: string;
  region: string;
  bucket: string;
  endpoint?: string;
}

interface UploadResult {
  url: string;
  name: string;
  res: any;
}

interface DownloadResult {
  content: Buffer;
  headers: any;
}

class OSSService {
  private client: OSS;
  private bucket: string;
  private region: string;

  constructor() {
    const config = this.getOSSConfig();
    this.bucket = config.bucket;
    this.region = config.region;

    try {
      this.client = new OSS({
        accessKeyId: config.accessKeyId,
        accessKeySecret: config.accessKeySecret,
        region: config.region,
        bucket: config.bucket,
        endpoint: config.endpoint,
        // 启用 HTTPS
        secure: true,
        // 超时设置
        timeout: 60000
      });

      logger.info("OSS 服务初始化成功", {
        region: config.region,
        bucket: config.bucket
      });
    } catch (error) {
      logger.error("OSS 服务初始化失败", { error });
      throw new ApiError("OSS_INIT_FAILED", "OSS 服务初始化失败", 500, {
        cause: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * 从环境变量获取 OSS 配置
   */
  private getOSSConfig(): OSSConfig {
    const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID;
    const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET;
    const region = process.env.ALIYUN_OSS_REGION;
    const bucket = process.env.ALIYUN_OSS_BUCKET;
    const endpoint = process.env.ALIYUN_OSS_ENDPOINT;

    if (!accessKeyId || !accessKeySecret || !region || !bucket) {
      throw new ApiError(
        "OSS_CONFIG_MISSING",
        "OSS 配置不完整，请检查环境变量: ALIYUN_ACCESS_KEY_ID, ALIYUN_ACCESS_KEY_SECRET, ALIYUN_OSS_REGION, ALIYUN_OSS_BUCKET",
        500
      );
    }

    return {
      accessKeyId,
      accessKeySecret,
      region,
      bucket,
      endpoint
    };
  }

  /**
   * 上传文件到 OSS
   * @param objectName OSS 中的对象名称（文件路径）
   * @param content 文件内容，可以是 Buffer、string 或 ReadableStream
   * @param options 上传选项
   */
  async uploadFile(
    objectName: string,
    content: Buffer | string | NodeJS.ReadableStream,
    options?: {
      headers?: Record<string, string>;
      meta?: Record<string, string>;
    }
  ): Promise<UploadResult> {
    try {
      logger.info(`开始上传文件到 OSS: ${objectName}`);

      const uploadOptions: any = {};

      if (options?.headers) {
        uploadOptions.headers = options.headers;
      }

      if (options?.meta) {
        uploadOptions.meta = options.meta;
      }

      const result = await this.client.put(objectName, content, uploadOptions);

      logger.info(`文件上传成功: ${objectName}`, {
        url: result.url,
        name: result.name
      });

      return {
        url: result.url,
        name: result.name,
        res: result.res
      };
    } catch (error) {
      logger.error(`文件上传失败: ${objectName}`, { error });
      throw new ApiError(
        "OSS_UPLOAD_FAILED",
        `文件上传失败: ${objectName}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * 从 OSS 下载文件
   * @param objectName OSS 中的对象名称（文件路径）
   */
  async downloadFile(objectName: string): Promise<DownloadResult> {
    try {
      logger.info(`开始从 OSS 下载文件: ${objectName}`);

      const result = await this.client.get(objectName);

      logger.info(`文件下载成功: ${objectName}`, {
        size: result.content?.length || 0
      });

      return {
        content: result.content as Buffer,
        headers: result.res.headers
      };
    } catch (error) {
      logger.error(`文件下载失败: ${objectName}`, { error });

      // 判断是否是文件不存在错误
      if (error instanceof Error && error.message.includes("NoSuchKey")) {
        throw new ApiError(
          "OSS_FILE_NOT_FOUND",
          `文件不存在: ${objectName}`,
          404
        );
      }

      throw new ApiError(
        "OSS_DOWNLOAD_FAILED",
        `文件下载失败: ${objectName}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * 检查文件是否存在
   * @param objectName OSS 中的对象名称（文件路径）
   */
  async fileExists(objectName: string): Promise<boolean> {
    try {
      await this.client.head(objectName);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes("NoSuchKey")) {
        return false;
      }
      logger.error(`检查文件存在性失败: ${objectName}`, { error });
      throw new ApiError(
        "OSS_CHECK_FAILED",
        `检查文件存在性失败: ${objectName}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * 删除文件
   * @param objectName OSS 中的对象名称（文件路径）
   */
  async deleteFile(objectName: string): Promise<void> {
    try {
      logger.info(`开始删除 OSS 文件: ${objectName}`);

      await this.client.delete(objectName);

      logger.info(`文件删除成功: ${objectName}`);
    } catch (error) {
      logger.error(`文件删除失败: ${objectName}`, { error });
      throw new ApiError(
        "OSS_DELETE_FAILED",
        `文件删除失败: ${objectName}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * 列出指定前缀的文件
   * @param prefix 文件前缀
   * @param maxKeys 最大返回数量，默认 100
   */
  async listFiles(
    prefix?: string,
    maxKeys: number = 100
  ): Promise<OSS.ObjectMeta[]> {
    try {
      logger.info(`列出 OSS 文件`, { prefix, maxKeys });

      const result = await this.client.list(
        {
          prefix,
          "max-keys": maxKeys
        },
        {}
      );

      const files = result.objects || [];

      logger.info(`列出文件成功`, {
        count: files.length,
        prefix
      });

      return files;
    } catch (error) {
      logger.error(`列出文件失败`, { error, prefix });
      throw new ApiError("OSS_LIST_FAILED", "列出文件失败", 500, {
        cause: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * 生成签名 URL（用于临时访问）
   * @param objectName OSS 中的对象名称（文件路径）
   * @param expires 过期时间（秒），默认 3600 秒（1小时）
   * @param method HTTP 方法，默认 'GET'
   */
  async getSignedUrl(
    objectName: string,
    expires: number = 3600,
    method: "GET" | "PUT" | "POST" = "GET"
  ): Promise<string> {
    try {
      logger.info(`生成签名 URL: ${objectName}`, { expires, method });

      const url = this.client.signatureUrl(objectName, {
        expires,
        method
      });

      logger.info(`签名 URL 生成成功: ${objectName}`);

      return url;
    } catch (error) {
      logger.error(`生成签名 URL 失败: ${objectName}`, { error });
      throw new ApiError(
        "OSS_SIGN_URL_FAILED",
        `生成签名 URL 失败: ${objectName}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * 复制文件
   * @param sourceObjectName 源文件名
   * @param targetObjectName 目标文件名
   * @param sourceBucket 源 bucket，如果不指定则使用当前 bucket
   */
  async copyFile(
    sourceObjectName: string,
    targetObjectName: string,
    sourceBucket?: string
  ): Promise<UploadResult> {
    try {
      const source = sourceBucket
        ? `${sourceBucket}/${sourceObjectName}`
        : sourceObjectName;

      logger.info(`复制文件: ${source} -> ${targetObjectName}`);

      const result = await this.client.copy(targetObjectName, source);

      logger.info(`文件复制成功: ${targetObjectName}`);

      // 生成访问URL
      const url = `https://${this.bucket}.${this.region}.aliyuncs.com/${targetObjectName}`;

      return {
        url,
        name: targetObjectName,
        res: result.res
      };
    } catch (error) {
      logger.error(`文件复制失败: ${sourceObjectName} -> ${targetObjectName}`, {
        error
      });
      throw new ApiError(
        "OSS_COPY_FAILED",
        `文件复制失败: ${sourceObjectName} -> ${targetObjectName}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * 获取文件信息
   * @param objectName OSS 中的对象名称（文件路径）
   */
  async getFileInfo(objectName: string): Promise<OSS.ObjectMeta> {
    try {
      logger.info(`获取文件信息: ${objectName}`);

      const result = await this.client.head(objectName);
      const headers = result.res.headers as any;

      logger.info(`获取文件信息成功: ${objectName}`, {
        size: headers["content-length"],
        type: headers["content-type"]
      });

      // 生成访问URL
      const url = `https://${this.bucket}.${this.region}.aliyuncs.com/${objectName}`;

      return {
        name: objectName,
        url: url,
        lastModified: headers["last-modified"],
        etag: headers.etag,
        type: headers["content-type"],
        size: parseInt(headers["content-length"] || "0"),
        storageClass: headers["x-oss-storage-class"]
      };
    } catch (error) {
      logger.error(`获取文件信息失败: ${objectName}`, { error });

      if (error instanceof Error && error.message.includes("NoSuchKey")) {
        throw new ApiError(
          "OSS_FILE_NOT_FOUND",
          `文件不存在: ${objectName}`,
          404
        );
      }

      throw new ApiError(
        "OSS_GET_INFO_FAILED",
        `获取文件信息失败: ${objectName}`,
        500,
        { cause: error instanceof Error ? error.message : String(error) }
      );
    }
  }
}

export default new OSSService();
