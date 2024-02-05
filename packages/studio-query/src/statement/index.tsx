import React, { useState, memo, useRef, useEffect } from 'react';
import { Space, Button, theme, Skeleton } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import Editor from './editor';
import Result from './result';

import { IEditorProps } from './typing';

export type IStatementProps = IEditorProps & {
  /** 是否是当前激活的语句 */
  active: boolean;
  // 是否是保存的语句
  saved: boolean;
  mode?: 'tabs' | 'flow';
  enableImmediateQuery: boolean;
};
const { useToken } = theme;

const Statement: React.FunctionComponent<IStatementProps> = props => {
  const { onQuery, onClose, onSave, script, id, active, mode, saved, schemaData, enableImmediateQuery } = props;
  const { token } = useToken();
  const borderStyle =
    active && mode === 'flow'
      ? {
          border: `2px solid ${token.colorPrimary}`,
        }
      : {
          border: `1px solid ${token.colorBorder}`,
        };
  const ContainerRef = useRef<HTMLDivElement>(null);
  const [state, updateState] = useState({
    data: null,
    isFetching: false,
  });
  const { data, isFetching } = state;
  useEffect(() => {
    if (ContainerRef.current && active && mode === 'flow') {
      ContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [active]);

  const handleQuery = async value => {
    console.log('value', value);
    const { script, id } = value;
    const queryId = uuidv4();
    const timestamp = new Date().getTime();
    const params = {
      id,
      queryId,
      timestamp,
      script,
    };
    updateState(preState => {
      return {
        ...preState,
        isFetching: true,
      };
    });
    const res = await onQuery(params);
    //@ts-ignore
    updateState(preState => {
      return {
        ...preState,
        data: res,
        isFetching: false,
      };
    });
  };
  useEffect(() => {
    if (enableImmediateQuery) {
      console.log('enableImmediateQuery script', enableImmediateQuery, script);
      handleQuery({ id, script });
    }
  }, [enableImmediateQuery]);

  return (
    <div
      ref={ContainerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        margin: '12px',
        padding: '8px',
        background: '#fff',
        borderRadius: '8px',
        ...borderStyle,
      }}
    >
      <Editor
        schemaData={schemaData}
        saved={saved}
        id={id}
        script={script}
        onClose={onClose}
        onQuery={handleQuery}
        onSave={onSave}
        isFetching={isFetching}
        antdToken={token}
      />
      {data && !isFetching && <Result data={data} isFetching={isFetching} />}
      {isFetching && <Skeleton />}
    </div>
  );
};

export default memo(Statement);
