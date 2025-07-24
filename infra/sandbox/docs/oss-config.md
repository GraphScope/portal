# OSS 服务配置说明

## 环境变量配置

要使用 OSS 服务，需要在 `.env` 文件中配置以下环境变量：

```bash
# 阿里云 OSS 配置
OSS_ACCESS_KEY_ID=your_access_key_id_here          # 阿里云 AccessKey ID
OSS_ACCESS_KEY_SECRET=your_access_key_secret_here  # 阿里云 AccessKey Secret
OSS_REGION=oss-cn-shanghai                    # OSS 地域，如 oss-cn-shanghai
OSS_BUCKET=your_bucket_name_here               # OSS 存储桶名称
OSS_ENDPOINT=https://oss-cn-shanghai.aliyuncs.com  # OSS 端点（可选）
```

## 获取阿里云 OSS 配置信息

### 1. 创建 RAM 用户

访问 [RAM 控制台](https://ram.console.aliyun.com/users/create) 创建用户：
- 勾选 `OpenAPI 调用访问`
- 记录生成的 AccessKey ID 和 AccessKey Secret（只显示一次）

### 2. 授予权限

访问 [RAM 用户管理](https://ram.console.aliyun.com/users) 对创建的用户添加权限：
- 选择系统策略 `AliyunOSSFullAccess - 管理对象存储服务(OSS)权限`

### 3. 创建 OSS 存储桶

访问 [OSS 控制台](https://oss.console.aliyun.com/) 创建存储桶：
- 选择合适的地域（如华东1-杭州）
- 设置存储桶名称
- 配置访问权限

## 使用示例

```typescript
import ossService from './services/oss-service';

// 上传文件
const uploadResult = await ossService.uploadFile(
  'folder/filename.txt',
  Buffer.from('Hello World'),
  {
    headers: { 'Content-Type': 'text/plain' },
    meta: { author: 'user123' }
  }
);

// 下载文件
const downloadResult = await ossService.downloadFile('folder/filename.txt');
console.log(downloadResult.content.toString());

// 检查文件是否存在
const exists = await ossService.fileExists('folder/filename.txt');

// 获取签名 URL（临时访问链接）
const signedUrl = await ossService.getSignedUrl('folder/filename.txt', 3600);

// 列出文件
const files = await ossService.listFiles('folder/', 50);

// 获取文件信息
const fileInfo = await ossService.getFileInfo('folder/filename.txt');

// 复制文件
await ossService.copyFile('source.txt', 'backup/source.txt');

// 删除文件
await ossService.deleteFile('folder/filename.txt');
```

## 安全注意事项

1. **不要在代码中硬编码密钥**：始终使用环境变量
2. **最小权限原则**：只给 RAM 用户必要的 OSS 权限
3. **定期轮换密钥**：定期更新 AccessKey
4. **使用 HTTPS**：服务默认启用 HTTPS 传输
5. **设置适当的存储桶策略**：根据需要配置访问控制

## 错误处理

服务会抛出结构化的 `ApiError`，包含以下错误类型：

- `OSS_CONFIG_MISSING`: 配置缺失
- `OSS_INIT_FAILED`: 初始化失败
- `OSS_UPLOAD_FAILED`: 上传失败
- `OSS_DOWNLOAD_FAILED`: 下载失败
- `OSS_FILE_NOT_FOUND`: 文件不存在
- `OSS_DELETE_FAILED`: 删除失败
- `OSS_LIST_FAILED`: 列表获取失败
- `OSS_SIGN_URL_FAILED`: 签名 URL 生成失败
- `OSS_COPY_FAILED`: 复制失败
- `OSS_CHECK_FAILED`: 检查失败
- `OSS_GET_INFO_FAILED`: 获取信息失败 