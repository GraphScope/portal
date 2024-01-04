import React, { useState, memo, useRef, useEffect } from 'react';
import { Space, Button, theme } from 'antd';

import Editor from './editor';
import Result from './result';

import { IEditorProps } from './typing';

export type IStatementProps = IEditorProps & {
  active: boolean;
  mode?: 'tabs' | 'flow';
};
const { useToken } = theme;

const Statement: React.FunctionComponent<IStatementProps> = props => {
  const { onQuery, onClose, onSave, script, id, active, mode } = props;
  const { token } = useToken();
  const borderColor = active ? token.colorPrimary : token.colorBorder;
  const ContainerRef = useRef<HTMLDivElement>(null);
  const [state, updateState] = useState({
    data: {
      nodes: [],
      edges: [],
      table: [],
    },
  });
  const { data } = state;
  useEffect(() => {
    if (ContainerRef.current && active && mode === 'flow') {
      ContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [active]);
  const handleQuery = async value => {
    const res = await onQuery(value);
    //@ts-ignore
    updateState(preState => {
      return {
        ...preState,
        data: res,
      };
    });
  };

  return (
    <div
      ref={ContainerRef}
      style={{
        flex: 1,
        border: `1px solid ${borderColor}`,
        margin: '12px',
        padding: '8px',
        background: '#fff',
        borderRadius: '8px',
      }}
    >
      <Editor id={id} script={script} onClose={onClose} onQuery={handleQuery} onSave={onSave} />
      <Result data={data} />
    </div>
  );
};

export default memo(Statement);
