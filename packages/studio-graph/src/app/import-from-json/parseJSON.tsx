export interface IMeta {
  size: string;
  name: string;
  graphFields: {
    idField: string;
    sourceField?: string;
    targetField?: string;
  };
}
export interface ParsedFile {
  id: string;
  meta: IMeta;
  data: { nodes: any[]; edges: any[] };
}

import { Utils } from '@graphscope/studio-components';
const { guestGraphFields } = Utils;

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
        const data = JSON.parse(contents);
        const { nodes, edges } = data;
        const node_header = Object.keys(nodes[0] || {});
        const edge_header = Object.keys(edges[0] || {});
        const { idField } = guestGraphFields(node_header);
        const { sourceField, targetField } = guestGraphFields(edge_header);
        resolve({
          meta: {
            size: getFileSize(file.size),
            name: file.name,
            graphFields: {
              idField,
              sourceField,
              targetField,
            },
          },
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
