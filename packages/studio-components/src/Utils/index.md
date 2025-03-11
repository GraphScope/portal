# Utils

## storage

封装了安全访问 localStorage 的通用工具库，提供类型安全的存取方法。

**<span style="font-size: 1.2em;"><strong>API</strong></span>**
#### get(key)
安全获取存储值（需显式指定返回类型）
| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| key  | string   | 要获取的存储键名   |
| 返回 | `T` \| undefined | 获取到存储的值 |
#### set(key,value)
安全获取存储值（需显式指定返回类型）
| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| key  | string   | 要存储的键名   |
| value | any | 要存储的值 |

##### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { storage } = Utils;

storage.set('user_settings', { 
      theme: 'dark',
      fontSize: 14 
});
interface UserSettings {
  theme: string;
  fontSize: number;
};
const settings = storage.get<UserSettings>('user_settings'); // 返回{ theme: 'dark', fontSize: 14  }

```
---
## isDarkTheme()
判断当前是否为暗黑模式

| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| 返回 | boolean | 是否为暗黑主题 |
##### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { isDarkTheme } = Utils;

const isDark = isDarkTheme(); // 返回 boolean
```
---

## safeParse(arg)
安全解析 JSON 字符串的工具函数，能够处理一些常见的解析错误。
| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| arg  | string   | 要解析的字符串   |
| 返回 | any | 解析后的值或原始输入 |
#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { safeParse } = Utils;
// 正常的 JSON 字符串
const jsonString = '{"name": "John", "age": 30}';
const parsedData = safeParse(jsonString);
console.log(parsedData); // 输出：{ name: "John", age: 30 }

// 缺少双引号的字符串
const invalidJson = 'hello world';
const fixedData = safeParse(invalidJson);
console.log(fixedData); // 输出：'hello world'

// 非字符串输入
const nonStringInput = 12345;
const originalInput = safeParse(nonStringInput);
console.log(originalInput); // 输出：12345
```
---
## debounce(func,wait)
防抖函数，用于限制函数调用频率，避免短时间内多次调用,适用于需要限制调用频率的场景，如窗口调整、键盘事件等

| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| func  | T   | 需要防抖处理的函数   |
| wait | number | 延迟执行的时间间隔（毫秒） |
| 返回 | any | 防抖后的函数 |
#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { debounce } = Utils;

// 示例函数
const logMessage = (message: string) => console.log(message);
// 创建防抖函数
const debouncedLog = debounce(logMessage, 500);

// 测试防抖效果
debouncedLog('Hello');
debouncedLog('World');

// 实际上只有最后一次调用会在延迟后执行
setTimeout(() => {
  debouncedLog('Delayed Message');
}, 600);
```
---
## getAllSearchParams()
获取当前 URL 中的所有查询参数，并将其转换为对象形式。

| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| 返回 | { [key: string]: string } | 包含所有查询参数的对象 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { getAllSearchParams } = Utils;

// 假设当前 URL 是：http://example.com/?name=John&age=30
const params = getAllSearchParams();
console.log(params); // 输出：{ name: "John", age: "30" }
```
---
## getSearchParams(key)

| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| key  | string   | 要获取的查询参数名 |
| 返回 | string | 获取到的查询参数值或空字符串 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { getSearchParams } = Utils;

// 假设当前 URL 是：http://example.com/?name=John&age=30
const name = getSearchParams('name');
console.log(name); // 输出：'John'

const age = getSearchParams('age');
console.log(age); // 输出：'30'

const nonExistentParam = getSearchParams('nonexistent');
console.log(nonExistentParam); // 输出：''
```
---
## setSearchParams(params,hashMode)

| 参数 | 类型 | 说明 |
|------|------|------|
| params | Record<string, string> | 要设置的查询参数对象，键为参数名，值为参数值。 |
| hashMode | boolean (可选) | 是否使用 hash router 模式，默认为 false。 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { setSearchParams } = Utils;

// 设置查询参数
setSearchParams({
  name: 'John',
  age: '30'
});

// 假设当前 URL 是：http://example.com/
// 更新后 URL 将变为：http://example.com/?name=John&age=30

// 如果需要使用 hash router 模式
setSearchParams({
  name: 'Jane',
  age: '25'
}, true);

// 假设当前 URL 是：http://example.com/#/
// 更新后 URL 将变为：http://example.com/#/?name=Jane&age=25
```
---
## removeSearchParams(deleteKeys, hashMode)
移除当前 URL 中指定的查询参数。

| 参数 | 类型 | 说明 |
|------|------|------|
| deleteKeys | string[] | 要移除的查询参数名数组。 |
| HashMode | boolean (可选) | 是否使用 hash router 模式，默认为 false。 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { removeSearchParams } = Utils;

// 移除查询参数
removeSearchParams(['name', 'age']);

// 假设当前 URL 是：http://example.com/?name=John&age=30&city=NewYork
// 更新后 URL 将变为：http://example.com/?city=NewYork

// 如果需要使用 hash router 模式
removeSearchParams(['name', 'age'], true);

// 假设当前 URL 是：http://example.com/#/?name=John&age=30&city=NewYork
// 更新后 URL 将变为：http://example.com/#/?city=NewYork
```
---
## getCurrentNav()
获取当前页面的导航路径。

| 参数 | 类型 | 说明 |
|------|------|------|
| 返回 | string | 当前页面的导航路径 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { getCurrentNav } = Utils;

// 假设当前 URL 是：http://example.com/path/to/page 或 http://example.com/#/path/to/page
const currentNav = getCurrentNav();
console.log(currentNav); // 输出：'/to'
```
---
## searchParamOf(key)

获取当前 URL 查询字符串中指定参数的值。

| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| key  | string   | 要获取的查询参数名 |
| 返回 | string | 获取到的查询参数值或 null |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { searchParamOf } = Utils;

// 假设当前 URL 是：http://example.com/?name=John&age=30
const name = searchParamOf('name');
console.log(name); // 输出：'John'

const age = searchParamOf('age');
console.log(age); // 输出：'30'

const nonExistentParam = searchParamOf('nonexistent');
console.log(nonExistentParam); // 输出：null
```
--- 
## getUrlParams()

获取当前 URL 中 hash 部分的所有查询参数，并将其转换为对象形式。

| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| 返回 | { [key: string]: string } | 包含所有查询参数的对象 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { getUrlParams } = Utils;

// 假设当前 URL 是：http://example.com/#/?name=John&age=30
const params = getUrlParams();
console.log(params); // 输出：{ name: "John", age: "30" }
```
---
## fakeSnapshot(obj)
创建对象的深拷贝。
| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| obj  | any      | 要进行深拷贝的对象 |
| 返回 | any      | 深拷贝后的新对象 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { fakeSnapshot } = Utils;

// 示例对象
const originalObj = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York'
  }
};
// 创建深拷贝
const snapshot = fakeSnapshot(originalObj);
console.log(snapshot); // 输出：{ name: "John", age: 30, address: { city: "New York" } }

// 修改原始对象
originalObj.name = 'Jane';

console.log(originalObj); // 输出：{ name: "Jane", age: 30, address: { city: "New York" } }
console.log(snapshot); // 输出：{ name: "John", age: 30, address: { city: "New York" } }
```
--- 
## download(queryData,states)

下载指定的数据内容。

| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| queryData | string   | 下载文件的名称 |
| states | BlobPart | 要下载的数据内容 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { download } = Utils;

// 示例数据
const data = 'Hello, world!';
const blob = new Blob([data], { type: 'text/plain' });

// 下载文件
download('example.txt', blob);
```
---
## downloadImage(dataUrl, name)
下载指定的数据 URL 图像。

| 参数 | 类型     | 说明               |
|------|----------|-------------------|
| dataUrl | string   | 数据 URL 字符串，通常为图像数据 |
| name | string | 下载文件的名称 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { downloadImage } = Utils;

// 示例数据 URL 和文件名
const imageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...'; // 假设这是一个有效的 PNG 图像数据 URL
const imageName = 'example.png';

// 下载图像文件
downloadImage(imageDataUrl, imageName);
```
---
## createDownload(content,filename)
创建并下载指定内容的文件。

| 参数 | 类型 | 说明 |
|------|------|------|
| content | string \| Blob | 要下载的内容（支持字符串或二进制数据） |
| filename | string (可选) | 下载文件的名称，默认为 'untitled.txt' |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { createDownload } = Utils;

// 下载文本内容
createDownload('Hello World', 'greeting.txt');

// 下载二进制数据（如图片）
const imageBlob = new Blob([/* 二进制数据 */], { type: 'image/png' });
createDownload(imageBlob, 'screenshot.png');
```
--- 

## groupBy(array, fun)
根据自定义分组函数对数组进行分组。
| 参数 | 类型 | 说明 |
|------|------|------|
| array | any[] | 需要分组的原始数组 |
| fun | (item: any) => string | 生成分组键值的函数 |
| 返回 | { [key: string]: any[] } | 分组后的对象，键为分组依据，值为对应的元素数组 |

#### 使用示例

```ts
import { Utils } from '@graphscope/studio-components';
const { groupBy } = Utils;

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];

// 按年龄分组
const groupedUsers = groupBy(users, user => `age_${user.age}`);

/* 输出结果：
{
  "age_25": [
    { name: 'Alice', age: 25 },
    { name: 'Charlie', age: 25 }
  ],
  "age_30": [
    { name: 'Bob', age: 30 }
  ]
}
*/
```
---
## generatorSchemaByGraphData(graphData,defaultOptions)
根据图数据生成节点和边的模式定义。
| 参数 | 类型 | 说明 |
|------|------|------|
| graphData | ISchema | 包含节点和边的图数据 |
| defaultOptions | object (可选) | 配置选项，需包含：<br/>- nodeLabelFromProperties: 节点标签来源字段<br/>- edgeLabelFromProperties: 边标签来源字段 |
| 返回 | ISchema | 生成的模式对象，包含：<br/>- nodes: 节点模式数组<br/>- edges: 边模式数组 |

#### 数据结构说明
```ts
interface ISchema {
  nodes: Array<{
    label: string
    properties: Array<{ name: string; type: string }>
  }>;
  edges: Array<{
    label: string
    source: string
    target: string
    properties: Array<{ name: string; type: string }>
  }>;
}
```
#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { generatorSchemaByGraphData } = Utils;
// 输入数据
const graphData = {
  nodes: [
    {
      id: 'user_1',
      label: 'Person',
      data: { 
        name: 'Alice',
        age: 28,
        address: {
          city: 'Beijing',
          zipcode: 100000
        }
      }
    },
    {  // 新增目标节点
      id: 'user_2',
      label: 'Person',
      data: {
        name: 'Bob',
        age: 30
      }
    }
  ],
  edges: [{
    id: 'rel_1',
    source: 'user_1',
    target: 'user_2',
    data: {
      relationType: 'FRIEND',
      since: '2020-03-15'
    }
  }]
};

// 生成 Schema
const schema = generatorSchemaByGraphData(graphData, {
  edgeLabelFromProperties: 'relationType'
});
    console.log('schema::: ', schema);

/* 输出结果：
{
  nodes: [{
    label: "Person",
    properties: [
      { name: "name", type: "string" },
      { name: "age", type: "number" },
      { name: "address.city", type: "string" },
      { name: "address.zipcode", type: "number" }
    ]
  }],
  edges: [{
    label: "FRIEND",
    source: "Person",
    target: "Person",
    properties: [
      { name: "since", type: "date" }
    ]
  }]
}
*/
```
---
## asyncFunctionWithWorker(fn)

将同步函数转换为基于 Web Worker 的异步函数，并返回执行耗时。
| 参数 | 类型 | 说明 |
|------|------|------|
| fn | `(data: T) => U;` | 需要异步执行的同步函数 |
| 返回 | `(arg:T)=>Promise<{ result: U; duration: number }>` | 该函数接受原始参数并返回 Promise 对象 |
#### 使用示例
```ts
import {Utils} from '@graphscope/studio-components';
const {asyncFunctionWithWorker} = Utils;
// 定义一个计算密集型的同步函数
const fibonacci = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

// 创建异步版本
const asyncFibonacci = asyncFunctionWithWorker(fibonacci);

// 在组件中使用
const calculate = async () => {
  try {
    const { result, duration } = await asyncFibonacci(40);
    console.log(`结果：${result}, 耗时：${duration.toFixed(2)}ms`);
    // 输出示例：结果：102334155, 耗时：1418.70ms
  } catch (error) {
    console.error('计算失败:', error);
  }
};
```
## parseFile(file)
异步读取文件内容并返回文本数据。
| 参数 | 类型 | 说明 |
|------|------|------|
| file | `File` | 需要读取的文件对象 |
| 返回 | `Promise<string>` | 包含文件内容的 Promise 对象 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { parseFile } = Utils;

// 从 input 元素获取文件
const fileInput = document.querySelector('input[type="file"]');
const selectedFile = fileInput.files?.[0];

// 读取文件内容
if (selectedFile) {
  parseFile(selectedFile)
    .then(content => {
      console.log('文件内容:', content); 
    })
    .catch(error => {
      console.error('读取失败:', error);
    });
}
```
---
## extractHeaderAndDelimiter(contents)
从 CSV 文本中提取表头并检测分隔符。
| 参数 | 类型 | 说明 |
|------|------|------|
| contents | `string` | CSV 格式的原始文本内容 |
| 返回 | `{ header: string[]; quoting: boolean; delimiter: string }` | 包含解析结果的对象 |

#### 使用示例
```ts
const csvContent = `"姓名","年龄","性别"
"张三","25","男"
"李四","30","女"`;

// 解析 CSV 元数据
  const res = extractHeaderAndDelimiter(csvContent);
  /* 输出结果：
    { header: ['姓名','年龄','性别'], quoting: true, delimiter: "," }
  */
```
## getFileSize(size)
将字节数转换为易读的文件大小格式。
| 参数 | 类型 | 说明 |
|------|------|------|
| size | `number` | 文件大小（单位：字节） |
| 返回 | `string` | 格式化后的文件大小字符串（包含单位） |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { getFileSize } = Utils;

// 转换文件大小
console.log(getFileSize(1024));       // 输出："1.00 KB"
console.log(getFileSize(3145728));    // 输出："3.00 MB"
console.log(getFileSize(1073741824)); // 输出："1.00 GB"
```
---

## detectDataTypes(dataLines, columnCount)
检测 CSV 数据列的数据类型。
| 参数 | 类型 | 说明 |
|------|------|------|
| dataLines | `any[][]` | CSV 数据行（不含表头） |
| columnCount | `number` | 数据列总数 |
| 返回 | `('string' | 'boolean' | 'number')[]` | 每列推断出的数据类型数组 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { detectDataTypes } = Utils;

// 示例 CSV 数据
const dataLines = [
  ['true', '25', '北京'],
  ['false', '30.5', '上海'],
  ['true', '18', '广州']
];

// 检测数据类型
const dataTypes = detectDataTypes(dataLines, 3);
/* 输出结果：
["boolean", "number", "string"]
*/
```

## parseCSV(file)
解析 CSV 文件并生成结构化数据。
| 参数 | 类型 | 说明 |
|------|------|------|
| file | `File` | 需要解析的 CSV 文件对象 |
| 返回 | `Promise<ParsedFile>` | 包含元数据、原始内容和唯一 ID 的解析结果 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { parseCSV } = Utils;

// 解析上传的 CSV 文件

  const fileInput = document.querySelector('input[type="file"]');
  const selectedFile = fileInput.files?.[0];
  if (selectedFile) {
    const parsed = await parseCSV(file);
    /* 输出结构：
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      contents: "header1,header2\nvalue1,value2",
      meta: {
        type: "csv",
        header: ["header1", "header2"],
        delimiter: ",",
        size: "2.00 KB",
        name: "example.csv",
        graphFields: {
          // 推断的图结构字段
        }
      }
    }
    */
  }
```
---

## covertCSV2JSON(contents, header, delimiter)
将 CSV 文本转换为 JSON 对象数组。
| 参数 | 类型 | 说明 |
|------|------|------|
| contents | `string` | CSV 原始文本内容 |
| header | `string[]` | CSV 表头字段数组 |
| delimiter | `string` | 检测到的分隔符 |
| 返回 | `Record<string, string>[]` | 转换后的 JSON 对象数组 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { covertCSV2JSON } = Utils;

// 示例 CSV 内容
const csvContent = `name,age,city
John,25,New York
Alice,30,London`;

// 转换 CSV 为 JSON
const jsonData = covertCSV2JSON(csvContent, ['name', 'age', 'city'], ',');
/* 输出结果：
[
  { name: "John", age: "25", city: "New York" },
  { name: "Alice", age: "30", city: "London" }
]
*/
```
---

## inferredGraphFields(header)
推断 CSV 表头中的图结构字段（顶点/边关系）。
| 参数 | 类型 | 说明 |
|------|------|------|
| header | `string[]` | CSV 表头字段数组 |
| 返回 | `{ idField?: string; sourceField?: string; targetField?: string; type: 'Vertex' \| 'Edge'; nodeLabelField: string; edgeLabelField: string }` | 图结构字段推断结果 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { inferredGraphFields } = Utils;

// 示例表头数据
const headers = ['user_id', 'source_node', 'target_node', 'relation_type'];

// 执行推断
const graphFields = inferredGraphFields(headers);
/* 输出结果：
{
  idField: "user_id",
  sourceField: "source_node",
  targetField: "target_node",
  type: "Edge",
  nodeLabelField: "label",
  edgeLabelField: "label"
}
*/
```
---

## parseJSON(file)
解析 JSON 文件并生成结构化数据集合。
| 参数 | 类型 | 说明 |
|------|------|------|
| file | `File` | 需要解析的 JSON 文件对象 |
| 返回 | `Promise<ParsedFile[]>` | 包含多个数据集的结构化解析结果数组 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { parseJSON } = Utils;

// 解析上传的 JSON 文件
document.querySelector('input[type="file"]').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file?.name.endsWith('.json')) {
    const parsedResults = await parseJSON(file);
    /* 输出结构示例：
    [
      {
        id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        contents: "[{...}]",
        data: [...],
        meta: {
          name: "data.json_users",
          header: ["id", "name"],
          type: "json",
          graphFields: {
           // 推断的图结构字段 
          },
          size: "2.34 KB"
        }
      },
      // 其他数据集...
    ]
    */
  }
});
```
---

## extractProperties(data, prefix)
递归提取对象属性（支持嵌套对象结构）。
| 参数 | 类型 | 说明 |
|------|------|------|
| data | `object` | 需要解析的原始对象 |
| prefix | `string` (可选) | 嵌套属性的前缀标识，默认空字符串 |
| 返回 | `Array<{ name: string; type: string }>` | 包含属性名和类型的对象数组 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { extractProperties } = Utils;

// 示例嵌套对象
const userData = {
  id: 123,
  profile: {
    name: "Alice",
    address: {
      city: "Beijing"
    }
  }
};

// 提取属性
const props = extractProperties(userData);
/* 输出结果：
[
  { name: "id", type: "number" },
  { name: "profile.name", type: "string" },
  { name: "profile.address.city", type: "string" }
]
*/
```

## handleExpand(data, responseData)
合并图数据并进行去重处理，支持节点和边的智能合并。
| 参数 | 类型 | 说明 |
|------|------|------|
| data | `{ nodes: any[]; edges: any[] }` | 原始图数据 |
| responseData | `{ nodes?: any[]; edges?: any[] }` | 新增的扩展图数据 |
| 返回 | `{ nodes: any[]; edges: any[] }` | 合并去重后的图数据 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { handleExpand } = Utils;

// 原始数据
const originalData = {
  nodes: [{ id: 'A' }, { id: 'B' }],
  edges: [{ source: 'A', target: 'B' }]
};

// 新增数据
const newData = {
  nodes: [{ id: 'B' }, { id: 'C' }],
  edges: [{ source: 'A', target: 'C' }]
};

// 合并数据
const merged = handleExpand(originalData, newData);
/* 输出结果：
{
  nodes: [{id:"A"}, {id:"B"}, {id:"C"}], // 自动去重 B 节点
  edges: [
    {source:"A", target:"B"},
    {source:"A", target:"C"}
  ]
}
*/
```

## uniqueElementsBy(arr, fn)
实现自定义条件的数据去重功能。
| 参数 | 类型 | 说明 |
|------|------|------|
| arr | `any[]` | 需要去重的原始数组 |
| fn | `(a: any, b: any) => boolean` | 自定义去重比较函数 |
| 返回 | `any[]` | 去重后的新数组 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { uniqueElementsBy } = Utils;

// 自定义对象数组去重
const data = [
  { id: 1, name: 'Alice' },
  { id: 1, name: 'Bob' },
  { id: 2, name: 'Charlie' }
];

// 根据id去重
const uniqueData = uniqueElementsBy(data, (a, b) => a.id === b.id);
/* 输出结果：
[
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Charlie' }
]
*/
```
---

## transSchema(originalSchema)
转换原始图模式数据为可视化所需的格式。
| 参数 | 类型 | 说明 |
|------|------|------|
| originalSchema | `{ vertex_types: any[]; edge_types: any[] }` | 原始图模式数据 |
| 返回 | `ISchemaOptions` | 转换后的可视化模式结构 |

#### 数据结构
```ts
interface ISchemaOptions {
  nodes: Array<{
    label: string
    properties: Array<{
      name: string
      type: string
      primaryKey?: boolean
    }>
  }>;
  edges: Array<{
    label: string
    source: string
    target: string
    properties: Array<{
      name: string
      type: string
    }>
  }>;
}
```
#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { transSchema } = Utils;

// 原始数据示例
const originalData = {
  vertex_types: [
    {
      type_name: 'User',
      primary_keys: ['user_id'],
      properties: [
        { property_name: 'user_id', property_type: { primitive_type: 'DT_INT64' } },
        { property_name: 'name', property_type: { primitive_type: 'DT_STRING' } }
      ]
    }
  ],
  edge_types: [
    {
      type_name: 'FRIEND',
      vertex_type_pair_relations: [
        { source_vertex: 'User', destination_vertex: 'User' }
      ],
      properties: [
        { property_name: 'since', property_type: { primitive_type: 'DT_DATE' } }
      ]
    }
  ]
};

// 执行转换
const schema = transSchema(originalData);
/* 输出结果：
{
  nodes: [{
    label: "User",
    properties: [
      { name: "user_id", type: "DT_INT64", primaryKey: true },
      { name: "name", type: "DT_STRING" }
    ]
  }],
  edges: [{
    label: "FRIEND",
    source: "User",
    target: "User",
    properties: [
      { name: "since", type: "DT_DATE" }
    ]
  }]
}
*/
```
## uuid()
生成符合 RFC 4122 标准的 UUID v4 字符串。
| 参数 | 类型 | 说明 |
|------|------|------|
| 返回 | `string` | 符合 UUID v4 规范的 36 位字符串 |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { uuid } = Utils;

// 生成唯一标识符
const id = uuid();
console.log(id); // 输出示例："9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
```
---

## getObjByPath(obj, path)
通过点分隔路径字符串访问对象的嵌套属性。
| 参数 | 类型 | 说明 |
|------|------|------|
| obj | `object` | 需要访问的原始对象 |
| path | `string` | 点分隔的属性路径（如："a.b.c"） |
| 返回 | `any` | 路径对应的属性值，未找到时返回 undefined |

#### 使用示例
```ts
import { Utils } from '@graphscope/studio-components';
const { getObjByPath } = Utils;

// 示例对象
const data = {
  user: {
    profile: {
      name: 'Alice',
      address: {
        city: 'Beijing'
      }
    }
  }
};

// 获取嵌套属性
const city = getObjByPath(data, 'user.profile.address.city');
console.log(city); // 输出："Beijing"

// 访问不存在的路径
const invalid = getObjByPath(data, 'user.contact.phone');
console.log(invalid); // 输出：undefined
```