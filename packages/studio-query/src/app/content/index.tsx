import React, { useState, memo, lazy, Suspense, useEffect } from 'react';
// import Statement from '../../statement';
const Statement = lazy(() => import('../../statement'));
const QueryCell = lazy(() => import('../../components/QueryCell'));
const SortableQueryCell = lazy(() => import('../../components/QueryCell/SortableQueryCell'));
// import Header from './header';
const Header = lazy(() => import('./header'));
import { Segmented, theme, Button, Flex, Tooltip, Modal } from 'antd';
import { useContext, localStorageVars } from '../context';
import type { IStatement, IStudioQueryProps } from '../context';
import { PlayCircleOutlined, PlusOutlined, HomeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Welcome from './welcome';
import Empty from './empty';
import { v4 as uuidv4 } from 'uuid';
import { 
  DndContext, 
  closestCenter, 
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormattedMessage, useIntl } from 'react-intl';

const { confirm } = Modal;
type ModeType = 'tabs' | 'flow';

interface IContentProps {
  createStatements: IStudioQueryProps['createStatements'];
  queryGraphData: IStudioQueryProps['queryGraphData'];
  handleCancelQuery: IStudioQueryProps['handleCancelQuery'];
  enableImmediateQuery: boolean;
  connectComponent?: IStudioQueryProps['connectComponent'];
  displaySidebarPosition?: IStudioQueryProps['displaySidebarPosition'];
  queryGraphSchema?: IStudioQueryProps['queryGraphSchema'];
  queryInfo?: IStudioQueryProps['queryInfo'];
}
const { useToken } = theme;

const Content: React.FunctionComponent<IContentProps> = props => {
  const {
    createStatements,
    queryGraphData,
    enableImmediateQuery,
    handleCancelQuery,
    connectComponent,
    displaySidebarPosition,
    queryGraphSchema,
    queryInfo,
  } = props;
  const { store, updateStore } = useContext();
  const { 
    activeId, 
    mode, 
    statements, 
    savedStatements, 
    schemaData, 
    graphId, 
    language, 
    activeNotebook, 
    showWelcomePage 
  } = store;
  const savedIds = savedStatements.map(item => item.id);
  const { token } = useToken();
  const intl = useIntl();
  
  // 保存可用的图数据源列表
  const [availableGraphs, setAvailableGraphs] = useState<any[]>([]);
  
  // 获取所有可用的图数据源
  useEffect(() => {
    const fetchGraphs = async () => {
      try {
        // 如果有可用的queryInfo API，使用它获取所有图数据源
        if (queryInfo) {
          try {
            // 获取当前图的信息
            const currentGraphInfo = await queryInfo(graphId);
            const currentGraph = {
              id: graphId,
              name: currentGraphInfo?.graph_name || intl.formatMessage({ id: 'content.current.graph' }),
              status: currentGraphInfo?.status || "ACTIVE"
            };
            
            // 这里应该还应该获取所有可用的图，但暂时我们只使用当前图
            // 实际实现应该通过API获取所有可用图列表
            setAvailableGraphs([currentGraph]);
          } catch (error) {
            console.error('Failed to fetch graph info:', error);
            // 失败时使用默认图
            setAvailableGraphs([
              { id: graphId, name: intl.formatMessage({ id: 'content.current.graph' }), status: 'ACTIVE' }
            ]);
          }
        } else {
          // 没有API时使用默认值
          setAvailableGraphs([
            { id: graphId, name: intl.formatMessage({ id: 'content.current.graph' }), status: 'ACTIVE' }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch available graphs:', error);
      }
    };
    
    if (graphId) {
      fetchGraphs();
    }
  }, [graphId, queryInfo, intl]);

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px移动距离后才激活拖拽
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 添加状态以跟踪全屏状态
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);

  // 初始化时不再自动添加语句，让Welcome组件处理
  // useEffect(() => {
  //   if (statements.length === 0) {
  //     const id = uuidv4();
  //     updateStore(draft => {
  //       draft.statements = [
  //         {
  //           id,
  //           script: '',
  //           language,
  //           graphId,
  //         },
  //       ];
  //       draft.activeId = id;
  //     });
  //   }
  // }, []);

  const statementStyles =
    mode === 'tabs'
      ? ({
          position: 'absolute',
          width: '100%',
        } as React.CSSProperties)
      : ({} as React.CSSProperties);
  const handleChangeTab = value => {
    updateStore(draft => {
      draft.activeId = value;
    });
  };

  const queryOptions = statements.map((item, index) => {
    return {
      label: `query-${index + 1}`, // item.id,
      value: item.id,
      // icon: <PlayCircleOutlined />,
    };
  });

  const onSave = ({ id, script, name, language }: IStatement) => {
    updateStore(draft => {
      const saveIds = draft.savedStatements.map(item => item.id);
      const HAS_SAVED = saveIds.indexOf(id) !== -1;
      if (HAS_SAVED) {
        draft.savedStatements.forEach(item => {
          if (item.id === id) {
            item.script = script;
          }
        });
      } else {
        draft.savedStatements.push({ id, script, name, language });
        // fetch server
        createStatements && createStatements('saved', { id, script, name, language });
      }
    });
  };

  const onClose = id => {
    updateStore(draft => {
      draft.statements = draft.statements.filter(item => {
        return item.id !== id;
      });
      draft.activeId = draft.statements[0] && draft.statements[0].id;
      
      // 保存到活动的笔记本
      updateNotebookStatements(draft);
    });
  };

  // 添加新的 QueryCell
  const addNewCell = () => {
    const id = uuidv4();
    updateStore(draft => {
      const newStatement = {
        id,
        script: '',
        language,
        graphId, // 使用当前选中的graphId作为默认值
      };
      
      draft.statements = [...draft.statements, newStatement];
      draft.activeId = id;
      
      // 如果有活动的笔记本，更新笔记本中的语句
      if (draft.activeNotebook) {
        draft.activeNotebook.statements = draft.statements;
        draft.activeNotebook.updatedAt = Date.now();
        
        // 更新notebooks数组中的对应笔记本
        const index = draft.notebooks.findIndex(n => n.id === draft.activeNotebook?.id);
        if (index !== -1) {
          draft.notebooks[index] = draft.activeNotebook;
          
          // 保存到本地存储
          try {
            localStorage.setItem(
              localStorageVars.notebooks,
              JSON.stringify(draft.notebooks)
            );
          } catch (error) {
            console.error(intl.formatMessage({ id: 'content.save.notebooks.error' }), error);
          }
        }
      }
    });
  };
  
  // 修改 handleMoveUp 方法，保存语句到当前笔记本
  const handleMoveUp = (id: string) => {
    console.log('Moving cell up:', id);
    updateStore(draft => {
      const index = draft.statements.findIndex(item => item.id === id);
      if (index > 0) {
        // 交换当前单元格与上一个单元格的位置
        [draft.statements[index], draft.statements[index - 1]] = 
        [draft.statements[index - 1], draft.statements[index]];
        
        // 确保移动后当前单元格仍然活跃
        draft.activeId = id;
        console.log('Cell moved up, new index:', index - 1);
        
        // 保存到活动的笔记本
        updateNotebookStatements(draft);
      }
    });
  };
  
  // 修改 handleMoveDown 方法，保存语句到当前笔记本
  const handleMoveDown = (id: string) => {
    console.log('Moving cell down:', id);
    updateStore(draft => {
      const index = draft.statements.findIndex(item => item.id === id);
      if (index >= 0 && index < draft.statements.length - 1) {
        // 交换当前单元格与下一个单元格的位置
        [draft.statements[index], draft.statements[index + 1]] = 
        [draft.statements[index + 1], draft.statements[index]];
        
        // 确保移动后当前单元格仍然活跃
        draft.activeId = id;
        console.log('Cell moved down, new index:', index + 1);
        
        // 保存到活动的笔记本
        updateNotebookStatements(draft);
      }
    });
  };
  
  // 辅助函数：更新笔记本中的语句并保存到本地存储
  const updateNotebookStatements = (draft: any) => {
    if (draft.activeNotebook) {
      draft.activeNotebook.statements = draft.statements;
      draft.activeNotebook.updatedAt = Date.now();
      
      // 更新notebooks数组中的对应笔记本
      const index = draft.notebooks.findIndex(n => n.id === draft.activeNotebook?.id);
      if (index !== -1) {
        draft.notebooks[index] = draft.activeNotebook;
        
        // 保存到本地存储
        try {
          localStorage.setItem(
            localStorageVars.notebooks,
            JSON.stringify(draft.notebooks)
          );
        } catch (error) {
          console.error(intl.formatMessage({ id: 'content.save.notebooks.error' }), error);
        }
      }
    }
  };

  // 处理单元格数据源变化
  const handleCellGraphChange = (cellId: string, newGraphId: string) => {
    // 更新单元格的数据源
    updateStore(draft => {
      const statementIndex = draft.statements.findIndex(item => item.id === cellId);
      if (statementIndex !== -1) {
        draft.statements[statementIndex].graphId = newGraphId;
      }
    });
    
    // 如果有必要，这里可以加载新数据源的schema
    if (queryGraphSchema) {
      queryGraphSchema(newGraphId).then(newSchemaData => {
        // 更新特定单元格的schema数据，或者全局schema
        // 这取决于实际需求
      }).catch(error => {
        console.error(intl.formatMessage(
          { id: 'content.load.schema.error' }, 
          { graphId: newGraphId }
        ), error);
      });
    }
  };

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      updateStore(draft => {
        const oldIndex = draft.statements.findIndex(item => item.id === active.id);
        const newIndex = draft.statements.findIndex(item => item.id === over.id);
        draft.statements = arrayMove(draft.statements, oldIndex, newIndex);
      });
    }
  };

  // 关闭当前 Notebook 并返回欢迎页
  const closeNotebook = () => {
    confirm({
      title: intl.formatMessage({ id: 'content.close.notebook.confirm.title' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: 'content.close.notebook.confirm.content' }),
      okText: intl.formatMessage({ id: 'common.close' }),
      cancelText: intl.formatMessage({ id: 'common.cancel' }),
      onOk() {
        updateStore(draft => {
          // 清空当前活动的 notebook
          draft.activeNotebook = null;
          // 清空语句
          draft.statements = [];
          // 清空活动 ID
          draft.activeId = '';
          // 显示欢迎页
          draft.showWelcomePage = true;
        });
      }
    });
  };

  // 根据 showWelcomePage 决定是否显示欢迎页面
  // 注意：这里我们不再使用 statements.length 来决定是否显示欢迎页
  const isEmpty = showWelcomePage;
  
  /** activeId !== undefined 或值不改变则不滚动*/
  useEffect(() => {
    if (activeId) {
      document.getElementById('statements-layout')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeId]);

  // 在适当位置添加 handleFullscreen 函数
  const handleFullscreen = (id: string, isFullscreen: boolean) => {
    setFullscreenId(isFullscreen ? id : null);
  };

  const handleQuery = (value: IStatement) => {
    /** 查询的时候，就可以存储历史记录了 */
    const { script, language, graphId: statementGraphId } = value;
    const queryId = uuidv4();
    const timestamp = new Date().getTime();
    const params = {
      id: queryId,
      timestamp,
      script,
      language,
      // 确保使用传入的graphId，如果没有则使用全局graphId
      graphId: statementGraphId || store.graphId,
    };

    updateStore(draft => {
      draft.historyStatements.push(params);
      
      // 更新当前语句的内容，并保存到笔记本
      const index = draft.statements.findIndex(statement => statement.id === value.id);
      if (index !== -1) {
        draft.statements[index].script = script;
        // 保存到活动的笔记本
        updateNotebookStatements(draft);
      }
    });
    /** 正式查询 */
    return queryGraphData(params);
  };

  // 使用useEffect添加自定义样式
  useEffect(() => {
    // 添加自定义样式到页面
    const styleId = 'custom-tabs-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = `
        /* 自定义标签样式 */
        .tabs-container .ant-segmented {
          background-color: ${token.colorBgElevated};
          border-radius: ${token.borderRadius}px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        
        .tabs-container .ant-segmented-item {
          transition: all 0.2s ease;
          padding: 4px 12px;
        }
        
        .tabs-container .ant-segmented-item-selected {
          background-color: ${token.colorPrimaryBg};
          color: ${token.colorPrimaryText};
          font-weight: 500;
        }
        
        .tabs-container .ant-segmented-thumb {
          background-color: ${token.colorPrimaryBg};
        }
        
        /* 添加渐变阴影指示滚动区域 */
        .tabs-container {
          position: relative;
        }
        
        .tabs-container::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 30px;
          background: linear-gradient(to right, transparent, ${token.colorBgContainer});
          pointer-events: none;
          opacity: 0.8;
        }
        
        /* 添加细节样式 */
        .tab-add-button {
          color: ${token.colorPrimary};
          background-color: ${token.colorBgContainer};
          border-color: ${token.colorPrimary};
          opacity: 0.85;
        }
        
        .tab-add-button:hover {
          opacity: 1;
          transform: scale(1.1);
        }
      `;
      document.head.appendChild(styleElement);
    }
    
    return () => {
      // 清理样式
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, [token.colorBgElevated, token.colorPrimary, token.borderRadius, token.colorBgContainer, token.colorPrimaryBg, token.colorPrimaryText]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: token.colorBgContainer,
      }}
    >
      {/* 只在有活动的 notebook 时显示头部 */}
      {!isEmpty && (
        <div
          style={{
            minHeight: '50px',
            background: token.colorBgContainer,
            padding: '0px 12px',
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
        >
          <Suspense>
            <Header connectComponent={connectComponent} displaySidebarPosition={displaySidebarPosition} />
          </Suspense>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '8px 0' 
          }}>
            {/* 显示当前笔记本名称 */}
            {activeNotebook && (
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: token.colorTextHeading 
              }}>
                {activeNotebook.name}
              </div>
            )}
            
            {/* 返回欢迎页按钮 */}
            <Tooltip title={intl.formatMessage({ id: 'content.return.to.notebooks' })}>
              <Button
                icon={<HomeOutlined />}
                onClick={closeNotebook}
                style={{ marginLeft: 'auto' }}
              >
                <FormattedMessage id="content.close.notebook" />
              </Button>
            </Tooltip>
          </div>

          {mode === 'tabs' && (
            queryOptions.length !== 0 ? (
              <div 
                className="tabs-container"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  overflowX: 'auto', 
                  padding: '4px 0',
                  gap: '8px',
                  margin: '0 0 4px 0' ,
                  borderTop: `1px solid ${token.colorBorder}`,
                }}
              >
                <Segmented options={queryOptions} onChange={handleChangeTab} value={activeId} />
                <Tooltip title={intl.formatMessage({ id: 'content.add.cell' })}>
                  <Button
                    type="default"
                    icon={<PlusOutlined />}
                    size="small"
                    shape="circle"
                    onClick={addNewCell}
                    className="tab-add-button"
                    style={{
                      flexShrink: 0,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      marginLeft: '4px',
                      transition: 'all 0.3s ease',
                      transform: 'scale(1)',
                    }}
                  />
                </Tooltip>
              </div>
            ) : (
              null
            )
          )}
        </div>
      )}

      <div
        id="statements-layout"
        style={{ 
          overflowY: 'scroll', 
          flex: '1', 
          position: 'relative', 
          background: isEmpty ? token.colorBgContainer : token.colorBgLayout,
          // 当显示欢迎页时让它占据全高度
          height: isEmpty ? '100%' : undefined,
          // 添加平滑过渡效果
          transition: 'background-color 0.3s ease'
        }}
      >
        {/* 显示Welcome组件 */}
        {isEmpty ? <Welcome /> : null}

        {mode === 'flow' ? (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={statements.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {statements.map((item, index) => {
                const { id, script, timestamp, language, graphId: cellGraphId } = item;
                const isLastCell = index === statements.length - 1;
                return (
                  <Suspense key={id}>
                    <SortableQueryCell
                      onMoveUp={handleMoveUp}
                      onMoveDown={isLastCell ? undefined : handleMoveDown}
                      index={index}
                      language={language}
                      enableImmediateQuery={enableImmediateQuery}
                      mode={mode as ModeType}
                      active={id === activeId}
                      id={id}
                      timestamp={timestamp}
                      graphId={cellGraphId || graphId} // 使用单元格自己的graphId
                      schemaData={schemaData}
                      script={script}
                      onQuery={handleQuery}
                      onCancel={handleCancelQuery}
                      onClose={onClose}
                      onSave={onSave}
                      onFullscreen={(isFullscreen) => handleFullscreen(id, isFullscreen)}
                      isFullscreen={fullscreenId === id}
                      graphs={availableGraphs}
                      onGraphChange={handleCellGraphChange}
                      style={{
                        display: fullscreenId === null || fullscreenId === id ? undefined : 'none',
                      }}
                    />
                  </Suspense>
                );
              })}
            </SortableContext>
          </DndContext>
        ) : (
          // tabs 模式下使用普通的 QueryCell 组件
          statements.map(item => {
            const { id, script, timestamp, language, graphId: cellGraphId } = item;
            const index = statements.findIndex(s => s.id === id);
            const isLastCell = index === statements.length - 1;
            return (
              <div
                key={id}
                style={{
                  ...statementStyles,
                  visibility: id === activeId || (mode as ModeType) === 'flow' ? 'visible' : 'hidden',
                  flex: 1,
                }}
              >
                <Suspense>
                  <QueryCell
                    language={language}
                    enableImmediateQuery={enableImmediateQuery}
                    mode={mode as ModeType}
                    active={id === activeId}
                    id={id}
                    timestamp={timestamp}
                    graphId={cellGraphId || graphId} // 使用单元格自己的graphId
                    schemaData={schemaData}
                    script={script}
                    onQuery={handleQuery}
                    onCancel={handleCancelQuery}
                    onClose={onClose}
                    onSave={onSave}
                    onFullscreen={(isFullscreen) => handleFullscreen(id, isFullscreen)}
                    isFullscreen={fullscreenId === id}
                    graphs={availableGraphs}
                    onGraphChange={handleCellGraphChange}
                    onMoveUp={handleMoveUp}
                    onMoveDown={isLastCell ? undefined : handleMoveDown}
                    index={index} // 添加索引以供禁用第一个/最后一个单元格的上移/下移
                    style={{
                      display: fullscreenId === null || fullscreenId === id ? undefined : 'none',
                    }}
                  />
                </Suspense>
              </div>
            );
          })
        )}

        {/* 添加新单元格按钮 - 仅当有活动的 notebook 时显示，并且在flow模式下或在tabs模式但没有标签时才显示 */}
        {!isEmpty && (mode === 'flow' || (mode === 'tabs' && statements.length === 0)) && (
          <div style={{ 
            padding: '8px 12px', 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%',
            boxSizing: 'border-box',
            marginBottom: '24px',
          }}>
            <Button 
              icon={<PlusOutlined />} 
              onClick={addNewCell}
              type="dashed"
              style={{
                width: '100%', 
                height: '48px',
                borderRadius: '8px',
                fontSize: '14px',
                color: token.colorTextSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                borderColor: token.colorBorder,
                borderStyle: 'dashed',
                borderWidth: '1px',
                transition: 'all 0.3s ease',
              }}
              className="add-cell-button" // 添加类名以便于样式自定义
            >
              <span style={{ marginLeft: '8px' }}>
                <FormattedMessage id="content.add.cell" />
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Content);
