export interface IMeta {
  header: string[];
  delimiter: string;
  size: string;
  name: string;
  graphFields: {
    idField: string;
    type: 'Vertex' | 'Edge';
    sourceField?: string;
    targetField?: string;
  };
}
export interface ParsedFile {
  id: string;
  meta: IMeta;
  data: Record<string, any>;
}

export const parseCSV = async (file: File): Promise<ParsedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // 以文本形式读取文件
    reader.readAsText(file, 'utf-8');
    // 监听读取完成事件
    reader.onload = function (event) {
      // 读取文件内容
      if (event) {
        const contents = event.target!.result as string;
        const { header, delimiter } = extractHeaderAndDelimiter(contents);
        const data = getJSONData(contents, header, delimiter);
        const graphFields = guestGraphFields(header);

        resolve({
          meta: { header, delimiter, size: getFileSize(file.size), name: file.name, graphFields },
          data,
          //@ts-ignore
          id: file.uid,
        });
      }
    };
    // 监听读取失败事件
    reader.onerror = function (event) {
      reject([event.target!.error]);
    };
  });
};

export function extractHeaderAndDelimiter(contents: string) {
  const delimiters = [',', ';', '\t', '|', ' ', ':'];
  let detectedDelimiter = '';
  let maxColumns = 0;
  let header: string[] = [];
  const lines = contents.split('\n');

  for (const delimiter of delimiters) {
    const columns = lines[0].split(delimiter);
    if (columns.length > maxColumns) {
      maxColumns = columns.length;
      detectedDelimiter = delimiter;
      header = columns;
    }
  }

  return {
    header: header.map(col => col.trim()),
    delimiter: detectedDelimiter,
  };
}

export function detectDataTypes(dataLines, columnCount) {
  const dataTypes = new Array(columnCount).fill('string');

  dataLines.forEach(line => {
    line.forEach((value, index) => {
      if (dataTypes[index] === 'string') {
        if (isBoolean(value)) {
          dataTypes[index] = 'boolean';
        } else if (isNumber(value)) {
          dataTypes[index] = 'number';
        }
      }
    });
  });

  return dataTypes;
}

export function isBoolean(value) {
  return value.toLowerCase() === 'true' || value.toLowerCase() === 'false';
}

export function isNumber(value) {
  return !isNaN(value) && value.trim() !== '';
}

export function getFileSize(size) {
  const units = ['bytes', 'KB', 'MB', 'GB'];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function getJSONData(contents, header, delimiter) {
  const [_header, ..._data] = contents.split('\n').filter(item => item);

  const data = _data.map(line => {
    return line.split(delimiter).reduce((acc, curr, index) => {
      const key = header[index];
      return {
        ...acc,
        [key]: curr,
      };
    }, {});
  });
  return data;
}

export function guestGraphFields(header: string[]) {
  const idKeys = new Set(['id', 'ID', '_id', 's_id', 't_id']);
  const sourceKeys = new Set(['source', 'src', 'src_id', 'srcId', 'from', 'start']);
  const targetKeys = new Set(['target', 'dst', 'dst_id', 'dstId', 'to', 'end']);

  let sourceField, targetField, idField, type;

  // 遍历头部字段以确定字段类型
  header.forEach(key => {
    const lowerKey = key.toLowerCase(); // 忽略大小写进行比较
    if (sourceKeys.has(lowerKey)) {
      sourceField = key;
    }
    if (targetKeys.has(lowerKey)) {
      targetField = key;
    }
    if (idKeys.has(lowerKey)) {
      idField = key;
    }
  });

  // 根据是否有 sourceField 和 targetField 来判断是点表还是边表
  if (sourceField && targetField) {
    type = 'Edge';
  } else {
    type = 'Vertex';
  }
  return {
    idField,
    sourceField,
    targetField,
    type,
  };
}
