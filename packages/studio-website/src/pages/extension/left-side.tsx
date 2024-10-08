import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useCustomTheme } from '@graphscope/studio-components';
import { useEditorTheme } from '@/pages/utils';
import UploadFiles from './upload-files';
import type { FieldType } from './right-side';
interface ILeftSide {
  editCode: string;
  isEdit: boolean;
  onCodeMirrorChange(val: FieldType): void;
  onChange(val: string): void;
}
const LeftSide: React.FC<ILeftSide> = props => {
  const { editCode, isEdit, onCodeMirrorChange, onChange } = props;
  const { pluginBorder } = useCustomTheme();
  return (
    <>
      <UploadFiles disabled={isEdit} editCode={editCode} handleChange={onCodeMirrorChange} />
      <div
        style={{
          overflow: 'scroll',
          border: `1px solid ${pluginBorder}`,
          borderRadius: '8px',
        }}
      >
        <CodeMirror
          height="320px"
          value={editCode}
          onChange={e => onChange(e)}
          theme={useEditorTheme(isEdit)}
          readOnly={isEdit}
        />
      </div>
    </>
  );
};

export default LeftSide;
