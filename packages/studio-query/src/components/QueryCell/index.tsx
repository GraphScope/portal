import React, { useState, useRef, useEffect } from 'react';
import { theme, Button, Tooltip, Space } from 'antd';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { Utils } from '@graphscope/studio-components';
import { UpOutlined, DownOutlined, DragOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import Editor from '../../statement/editor';
import Result from '../../statement/result';
import { IEditorProps } from '../../statement/typing';

const { debounce } = Utils;

export type IQueryCellProps = IEditorProps & {
  /** 是否是当前激活的语句 */
  active: boolean;
  mode?: 'tabs' | 'flow';
  enableImmediateQuery: boolean;
  graphId: string;
  /** 时间戳 */
  timestamp?: number;
  /** 拖拽相关属性 */
  dragHandleProps?: any;
  /** 单元格索引 */
  index?: number;
  /** 全屏状态变化回调 */
  onFullscreen?: (isFullscreen: boolean) => void;
  /** 是否处于全屏状态 */
  isFullscreen?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
};
const { useToken } = theme;

const QueryCell: React.FC<IQueryCellProps> = props => {
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
    dragHandleProps,
    index,
    onFullscreen,
    isFullscreen: propIsFullscreen,
    style: customStyle,
  } = props;
  const { token } = useToken();
  const intl = useIntl();
  const [collapsed, setCollapsed] = useState(false);
  const [localFullscreen, setLocalFullscreen] = useState(false);
  
  // 使用 prop 或 local 状态作为实际的全屏状态
  const fullscreen = propIsFullscreen !== undefined ? propIsFullscreen : localFullscreen;

  const borderStyle =
    active && mode === 'flow'
      ? {
          border: `1px solid ${token.colorPrimary}`,
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

  // 检查是否有数据（查询结果）
  const hasQueryResult = () => {
    if (!data) return false;
    
    // 检查图数据
    if ((data as any).nodes && (data as any).nodes.length > 0) return true;
    if ((data as any).edges && (data as any).edges.length > 0) return true;
    
    // 检查表格数据
    if ((data as any).table && (data as any).table.length > 0) return true;
    
    // 检查原始数据
    if ((data as any).raw && 
        ((data as any).raw.records?.length > 0 || 
         (data as any).raw.rows?.length > 0 || 
         Object.keys((data as any).raw).length > 0)) {
      return true;
    }
    
    return false;
  };

  const handleQuery = debounce(async params => {
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
    if (enableImmediateQuery) {
      console.log('enableImmediateQuery script', enableImmediateQuery, script, language);
      handleQuery({ id, script, language });
    }
  }, [enableImmediateQuery]);

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

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleFullscreen = () => {
    const newFullscreenState = !fullscreen;
    // 如果有外部控制，则调用回调
    if (onFullscreen) {
      onFullscreen(newFullscreenState);
    } else {
      // 否则使用本地状态
      setLocalFullscreen(newFullscreenState);
    }
  };

  // 修改：只要有查询结果就显示折叠/展开按钮，不再受折叠状态影响
  const hasResult = hasQueryResult();
  // 显示结果条件：未折叠 && 有查询结果
  const showResult = !collapsed && hasResult;

  // 计算容器高度 - 根据是否全屏和是否折叠调整
  const containerHeight = fullscreen
    ? 'calc(100vh - 126px)'
    : 'auto';

  // 计算结果区域高度
  const resultHeight = fullscreen
    ? collapsed ? 'auto' : 'calc(100vh - 326px)'
    : collapsed ? 'auto' : '540px';

  return (
    <div
      ref={ContainerRef}
      style={{
        display: 'flex',
        boxSizing: 'border-box',
        flexDirection: 'column',
        flex: fullscreen ? 1 : 'unset',
        margin: '12px',
        padding: '8px 16px',
        borderRadius: '8px',
        ...borderStyle,
        background: token.colorBgContainer,
        transition: 'all 0.3s ease',
        position: fullscreen ? 'absolute' : 'relative',
        top: fullscreen ? '0' : 'auto',
        left: fullscreen ? '0' : 'auto',
        right: fullscreen ? '0' : 'auto',
        bottom: fullscreen ? 'auto' : 'auto',
        width: 'auto', // 留出页面边距
        height: containerHeight,
        zIndex: fullscreen ? 1000 : 'auto',
        boxShadow: fullscreen ? '0 0 20px rgba(0,0,0,0.2)' : 'none',
        maxHeight: fullscreen ? 'calc(100vh - 126px)' : 'none', // 防止全屏溢出
        overflowY: 'auto',
        overflowX: 'hidden',
        ...customStyle,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', position: 'sticky', top: 0, zIndex: 10, background: token.colorBgContainer, padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {mode === 'flow' && !fullscreen && (
            <span 
              style={{ 
                cursor: 'grab', 
                marginRight: '8px', 
                display: 'inline-flex', 
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px',
                backgroundColor: token.colorBgTextHover,
              }}
              {...dragHandleProps}
            >
              <DragOutlined />
            </span>
          )}
          {index !== undefined && (
            <span style={{ marginRight: '8px', fontWeight: 'bold', color: token.colorTextSecondary }}>#{index + 1}</span>
          )}
        </div>
        <Space>
          {/* 修改：只要有查询结果就显示折叠/展开按钮 */}
          {hasResult && (
            <Tooltip title={collapsed ? "展开结果" : "收起结果"}>
              <Button 
                type="text" 
                icon={collapsed ? <DownOutlined /> : <UpOutlined />} 
                onClick={toggleCollapse} 
                size="small"
              />
            </Tooltip>
          )}
          <Tooltip title={fullscreen ? "退出全屏" : "全屏"}>
            <Button 
              type="text" 
              icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} 
              onClick={toggleFullscreen} 
              size="small"
            />
          </Tooltip>
        </Space>
      </div>

      <div 
        style={{ 
          border: `1px solid ${token.colorBorder}`,
          borderRadius: '4px',
          padding: '4px',
          background: active ? token.colorBgContainer : token.colorBgElevated,
          marginBottom: hasResult ? '8px' : '0', // 修改：只要有结果就保留底部间距
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
      </div>

      {/* 修改：折叠时显示一个提示行 */}
      {hasResult && collapsed && (
        <div 
          style={{ 
            padding: '8px', 
            color: token.colorTextSecondary,
            fontSize: '12px',
            textAlign: 'center',
            backgroundColor: token.colorBgElevated,
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={toggleCollapse}
        >
          点击此处或上方按钮展开查询结果
        </div>
      )}

      {showResult && (
        <div 
          style={{ 
            flex: 1,
            height: resultHeight,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <Result data={data} isFetching={isFetching} schemaData={schemaData} graphId={graphId} onQuery={onQuery} />
        </div>
      )}
    </div>
  );
};

export default QueryCell; 