import React, { useState, memo, useRef, useEffect } from 'react';
import { theme } from 'antd';
import dayjs from 'dayjs';
import Editor from './editor';
import Result from './result';
import { useIntl } from 'react-intl';
import { IEditorProps } from './typing';
import { Utils } from '@graphscope/studio-components';

const { debounce } = Utils;

export type IStatementProps = IEditorProps & {
  /** 是否是当前激活的语句 */
  active: boolean;
  mode?: 'tabs' | 'flow';
  enableImmediateQuery: boolean;
  graphId: string;
  /** 时间戳 */
  timestamp?: number;
};
const { useToken } = theme;

const Statement: React.FunctionComponent<IStatementProps> = props => {
  const {
    onQuery,
    onClose,
    onCancel,
    onSave,
    script,
    id,
    active,
    mode,
    schemaData,
    enableImmediateQuery,
    graphId,
    timestamp,
    language,
  } = props;
  const { token } = useToken();
  const intl = useIntl();
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
    data: {},
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

  const handleQuery =debounce(async params => {
    if (isFetching) {
      onCancel && onCancel(params);
      updateState(preState => {
        return {
          ...preState,
          isFetching: false,
          data: {},
        };
      });
      return;
    }
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
  }, 500);
   
  useEffect(() => {
    if (enableImmediateQuery && timestamp) {
      console.log('enableImmediateQuery script', enableImmediateQuery, script, language);
      handleQuery({ id, script, language });
    }
  }, [enableImmediateQuery, timestamp]);

  const isRunning = endTime - startTime < 0;
  const message = isRunning
    ? intl.formatMessage(
        {
          id: "query submmited on {submitTime}. It's running ... ",
        },
        {
          submitTime: dayjs(startTime).format('HH:mm:ss YYYY-MM-DD'),
        },
      )
    : intl.formatMessage(
        {
          id: 'query submmited on {submitTime}. Running {runningTime} ms',
        },
        {
          submitTime: dayjs(startTime).format('HH:mm:ss YYYY-MM-DD'),
          runningTime: endTime - startTime,
        },
      );

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
        background: token.colorBgContainer,
      }}
    >
      <Editor
        message={message}
        language={language}
        timestamp={timestamp}
        schemaData={schemaData}
        id={id}
        script={script}
        onClose={onClose}
        onQuery={handleQuery}
        onSave={onSave}
        isFetching={isFetching}
        antdToken={token}
      />

      <Result data={data} isFetching={isFetching} schemaData={schemaData} graphId={graphId} onQuery={onQuery} />
    </div>
  );
};

export default memo(Statement);
