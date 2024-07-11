import { inferredGraphFields } from './inferredGraphFields';
import { uuid } from 'uuidv4';

export const parseFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // 以文本形式读取文件
    reader.readAsText(file);
    // 监听读取完成事件
    reader.onload = function (event) {
      // 读取文件内容
      if (event) {
        const contents = event.target!.result as string;
        resolve(contents);
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
  let quoting = false;
  const _header = header.map(col => {
    quoting = col.startsWith('"') && col.endsWith('"');
    let item;
    if (quoting) {
      try {
        item = JSON.parse(col);
      } catch (e) {
        // 如果解析失败，则返回原始字符串
        item = col;
      }
    } else {
      item = col;
    }
    return item.trim();
  });

  return {
    header: _header,
    quoting,
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

export interface IMeta {
  header: string[];
  delimiter: string;
  size: string;
  name: string;
  type: 'csv' | 'json' | 'sql';
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
  contents: string;
}

export const parseCSV = async (file: File): Promise<ParsedFile> => {
  const contents = await parseFile(file);
  const { header, delimiter } = extractHeaderAndDelimiter(contents);
  console.time('PARSE CSV COST');
  const graphFields = inferredGraphFields(header);
  console.timeEnd('PARSE CSV COST');
  return {
    meta: { type: 'csv', header, delimiter, size: getFileSize(file.size), name: file.name, graphFields },
    contents,
    id: uuid(),
  };
};

/**
 *
 * @param contents
 * @param header
 * @param delimiter
 * @returns
 */
export function covertCSV2JSON(contents: string, header: string[], delimiter: string) {
  var _ref = contents.split('\n'),
    _data = _ref.slice(1);

  var data = _data.map(function (line) {
    var lineArr = line.split(delimiter);
    var obj = {};
    for (var i = 0; i < header.length; i++) {
      obj[header[i]] = lineArr[i];
    }
    return obj;
  });
  return data;
}
