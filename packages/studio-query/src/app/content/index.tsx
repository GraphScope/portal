import React, { useState, memo, lazy, Suspense, useEffect } from 'react';
// import Statement from '../../statement';
const Statement = lazy(() => import('../../statement'));
const QueryCell = lazy(() => import('../../components/QueryCell'));
const SortableQueryCell = lazy(() => import('../../components/QueryCell/SortableQueryCell'));
// import Header from './header';
const Header = lazy(() => import('./header'));
import { Segmented, theme, Button, Flex } from 'antd';
import { useContext } from '../context';
import type { IStatement, IStudioQueryProps } from '../context';
import { PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
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

type ModeType = 'tabs' | 'flow';

interface IContentProps {
  createStatements: IStudioQueryProps['createStatements'];
  queryGraphData: IStudioQueryProps['queryGraphData'];
  handleCancelQuery: IStudioQueryProps['handleCancelQuery'];
  enableImmediateQuery: boolean;
  connectComponent?: IStudioQueryProps['connectComponent'];
  displaySidebarPosition?: IStudioQueryProps['displaySidebarPosition'];
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
  } = props;
  const { store, updateStore } = useContext();
  const { activeId, mode, statements, savedStatements, schemaData, graphId, language } = store;
  const savedIds = savedStatements.map(item => item.id);
  const { token } = useToken();

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

  // 初始化时如果没有语句，添加一个默认的语句
  useEffect(() => {
    if (statements.length === 0) {
      const id = uuidv4();
      updateStore(draft => {
        draft.statements = [
          {
            id,
            script: '',
            language,
          },
        ];
        draft.activeId = id;
      });
    }
  }, []);

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
    });
  };

  // 添加新的 QueryCell
  const addNewCell = () => {
    const id = uuidv4();
    updateStore(draft => {
      draft.statements = [
        ...draft.statements,
        {
          id,
          script: '',
          language,
        },
      ];
      draft.activeId = id;
    });
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

  const isEmpty = statements.length === 0;
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          minHeight: '50px',
          background: token.colorBgBase,
          padding: '0px 12px',
          borderBottom: `1px solid ${token.colorBorder}`,
        }}
      >
        <Suspense>
          <Header connectComponent={connectComponent} displaySidebarPosition={displaySidebarPosition} />
        </Suspense>

        {mode === 'tabs' && queryOptions.length !== 0 && (
          <div style={{ overflowX: 'scroll', padding: '8px 0px' }}>
            <Segmented options={queryOptions} onChange={handleChangeTab} value={activeId} />
          </div>
        )}
      </div>

      <div
        id="statements-layout"
        style={{ overflowY: 'scroll', flex: '1', position: 'relative', background: token.colorBgLayout }}
      >
        {/* {isEmpty && <Empty />} */}
        <Welcome />

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
                const { id, script, timestamp, language } = item;
                return (
                  <Suspense key={id}>
                    <SortableQueryCell
                      index={index}
                      language={language}
                      enableImmediateQuery={enableImmediateQuery}
                      mode={mode as ModeType}
                      active={id === activeId}
                      id={id}
                      timestamp={timestamp}
                      graphId={graphId}
                      schemaData={schemaData}
                      script={script}
                      onQuery={queryGraphData}
                      onCancel={handleCancelQuery}
                      onClose={onClose}
                      onSave={onSave}
                      onFullscreen={(isFullscreen) => handleFullscreen(id, isFullscreen)}
                      isFullscreen={fullscreenId === id}
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
            const { id, script, timestamp, language } = item;
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
                    graphId={graphId}
                    schemaData={schemaData}
                    script={script}
                    onQuery={queryGraphData}
                    onCancel={handleCancelQuery}
                    onClose={onClose}
                    onSave={onSave}
                    onFullscreen={(isFullscreen) => handleFullscreen(id, isFullscreen)}
                    isFullscreen={fullscreenId === id}
                    style={{
                      display: fullscreenId === null || fullscreenId === id ? undefined : 'none',
                    }}
                  />
                </Suspense>
              </div>
            );
          })
        )}

        {/* 添加新单元格按钮 */}
        <Flex justify="center" style={{ padding: '16px' }}>
          <Button 
            icon={<PlusOutlined />} 
            onClick={addNewCell}
            type="dashed"
          >
            添加查询单元格
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default memo(Content);
