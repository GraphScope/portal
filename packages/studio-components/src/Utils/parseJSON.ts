import { inferredGraphFields } from './inferredGraphFields';
import { parseFile, extractHeaderAndDelimiter, getFileSize } from './parseCSV';
import type { ParsedFile } from './parseCSV';
import { uuid } from 'uuidv4';

function byteSize(str) {
  return new Blob([str]).size;
}

export const parseJSON = async (file: File): Promise<ParsedFile[]> => {
  const contents = await parseFile(file);
  const graphJSON = JSON.parse(contents);
  const { name } = file;
  return Object.keys(graphJSON).map(key => {
    const item = graphJSON[key];
    const dataFields = Object.keys(item[0] || {});
    const fileString = JSON.stringify(item);
    const size = getFileSize(byteSize(fileString));
    return {
      id: uuid(),
      contents: fileString,
      data: item,
      meta: {
        name: `${name}_${key}`,
        header: dataFields,
        type: 'json',
        delimiter: '',
        graphFields: inferredGraphFields(dataFields),
        size,
      },
    };
  });
};
