import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useThemeContainer } from '@graphscope/studio-components';
import { useEditorTheme } from '@/pages/utils';
import UploadFiles from './upload-files';
interface ILeftSide {
  editCode: string;
  isEdit: boolean;
  onCodeMirrorChange(val: string): void;
}
const LeftSide: React.FC<ILeftSide> = props => {
  const { editCode, isEdit, onCodeMirrorChange } = props;
  const { pluginBorder } = useThemeContainer();
  // if (editCode) {
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
          onChange={e => onCodeMirrorChange(e)}
          theme={useEditorTheme(isEdit)}
          readOnly={isEdit}
        />
      </div>
    </>
  );
  // }
  // return <UploadFiles disabled={isEdit} editCode={editCode} handleChange={onCodeMirrorChange} />;
};

export default LeftSide;
