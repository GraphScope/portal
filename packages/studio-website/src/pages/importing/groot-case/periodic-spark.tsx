import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useThemeContainer } from '@graphscope/studio-components';
interface IPeriodicSparkProps {
  codeMirrorData: string;
}
const PeriodicSpark: React.FC<IPeriodicSparkProps> = props => {
  const { codeMirrorData } = props;
  const { jobDetailBorder, jobDetailColor } = useThemeContainer();
  /** code style */
  const containerStyles = {
    overFlowY: 'scroll',
    margin: '-6px 0px',
    minHeight: '300px',
    border: `${jobDetailBorder} 1px solid`,
    borderRadius: '6px',
    color: jobDetailColor,
  };

  return (
    <>
      <div>
        <CodeMirror
          style={containerStyles}
          className="CodeMirror-scroll"
          value={codeMirrorData}
          height="300px"
          // extensions={[json()]}
          readOnly
          autoFocus
        />
      </div>
    </>
  );
};

export default PeriodicSpark;
