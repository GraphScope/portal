import React, { useState, memo, useRef, useEffect } from 'react';
import { Space, Button, theme, Skeleton } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
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
  graphName: string;
  /** 时间戳 */
  timestamp?: number;
};
const { useToken } = theme;

const Statement: React.FunctionComponent<IStatementProps> = props => {
  const {
    onQuery,
    onClose,
    onSave,
    script,
    id,
    active,
    mode,
    saved,
    schemaData,
    enableImmediateQuery,
    graphName,
    timestamp,
    language,
  } = props;
  const { token } = useToken();
  const borderStyle =
    active && mode === 'flow'
      ? {
          border: `1px solid ${token.colorBorder}`,
        }
      : {
          border: `1px solid  ${token.colorBorder}`,
        };
  const ContainerRef = useRef<HTMLDivElement>(null);
  const [state, updateState] = useState({
    data: null,
    isFetching: false,
    startTime: 0,
    endTime: 0,
    abort: false,
  });
  const { data, isFetching, startTime, endTime } = state;
  useEffect(() => {
    if (ContainerRef.current && active && mode === 'flow') {
      ContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [active]);

  const handleQuery = async params => {
    updateState(preState => {
      return {
        ...preState,
        isFetching: true,
        startTime: new Date().getTime(),
      };
    });

    const res = await onQuery(params);
    //@ts-ignore
    updateState(preState => {
      return {
        ...preState,
        data: res,
        isFetching: false,
        endTime: new Date().getTime(),
      };
    });
  };
  useEffect(() => {
    if (enableImmediateQuery) {
      console.log('enableImmediateQuery script', enableImmediateQuery, script, language);
      handleQuery({ id, script, language });
    }
  }, [enableImmediateQuery]);

  const isRunning = endTime - startTime < 0;
  const message = isRunning
    ? `query submmited on ${dayjs(startTime).format('HH:mm:ss YYYY-MM-DD')}. It's running ... `
    : `query submmited on ${dayjs(startTime).format('HH:mm:ss YYYY-MM-DD')}. Running ${endTime - startTime} ms`;

  return (
    <div
      ref={ContainerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        margin: '12px',
        padding: '8px 16px',
        borderRadius: '8px',
        ...borderStyle,
        background: token.colorBgBase,
      }}
    >
      <Editor
        message={message}
        language={language}
        timestamp={timestamp}
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
      {data && !isFetching && (
        <Result data={data} isFetching={isFetching} schemaData={schemaData} graphName={graphName} />
      )}
      {isFetching && <Skeleton />}
    </div>
  );
};

export default memo(Statement);
