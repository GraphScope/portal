import * as React from 'react';
import UploadFile from './update-file';

interface IImportFromCSVProps {}

const ImportFromCSV: React.FunctionComponent<IImportFromCSVProps> = props => {
  const onChange = (value: any) => {};
  return (
    <div
      style={{
        border: '1px dashed #ddd',
        height: '100%',
        borderRadius: '6px',
      }}
    >
      <UploadFile onChange={onChange} />
    </div>
  );
};

export default ImportFromCSV;
