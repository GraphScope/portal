import React, { useState } from 'react';
import { Card, Button } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { Utils, useThemeContainer } from '@graphscope/studio-components';
const PeriodicSpark = () => {
  const [state, updateState] = useState({
    codeMirrorData: '',
  });
  const { codeMirrorData } = state;
  const { jobDetailBorder, jobDetailColor } = useThemeContainer();
  const handleDownload = () => {
    // const param = `${type?.toLocaleLowerCase()}` + '_' + `${configLpading?.label?.label}` + '_config.ini';
    // Utils.download(param, codeMirrorData);
  };
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
      {/* <div style={{ textAlign: 'end', marginTop: '24px' }}>
        <Button type="primary" onClick={() => handleDownload()}>
          Download
        </Button>
      </div> */}
    </>
  );
};

export default PeriodicSpark;
