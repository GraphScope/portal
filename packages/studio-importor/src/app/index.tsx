import React, { useEffect } from 'react';
import PropertiesEditor from './properties-editor';
import { Section, StudioProvier, GlobalSpin, EmptyCanvas } from '@graphscope/studio-components';
import { transformGraphNodes, transformEdges } from './elements/index';
import { GraphEditor, GraphProvider } from '@graphscope/studio-flow-editor';
import { PlayCircleOutlined } from '@ant-design/icons';
import ButtonController from './button-controller';
import type { ISchemaOptions, ImportorProps } from './typing';
import locales from '../locales';
import { ImportorProvider, useContext } from './useContext';
import { FormattedMessage } from 'react-intl';

const ImportApp: React.FunctionComponent<ImportorProps> = props => {
  const {
    appMode,
    GS_ENGINE_TYPE,
    queryGraphSchema,
    queryBoundSchema,
    id,
    theme = {
      primaryColor: '#1890ff',
      mode: 'defaultAlgorithm',
    },
    defaultCollapsed = {
      rightSide: false,
      leftSide: true,
    },
    leftSideStyle = {
      width: '350px',
      padding: '0px 12px',
    },
    rightSideStyle = {
      width: '450px',
      padding: '0px 12px',
    },
    children,
    queryPrimitiveTypes,
    handleUploadFile,
    isSaveFiles,
    batchUploadFiles,
    onCreateLabel,
    onDeleteLabel,
    style,
    rightSide,
    refreshIndex = 1,
  } = props;
  const { store, updateStore } = useContext();
  const { isReady, nodes, displayMode } = store;
  const IS_PURE = appMode === 'PURE';
  const isEmpty = nodes.length === 0;
  useEffect(() => {
    (async () => {
      let schema: ISchemaOptions = { nodes: [], edges: [] };
      if (appMode === 'DATA_MODELING' && queryGraphSchema) {
        schema = await queryGraphSchema();
      }
      if (appMode === 'DATA_IMPORTING' && queryBoundSchema) {
        schema = await queryBoundSchema();
      }
      const schemaOptions = {
        nodes: transformGraphNodes(schema.nodes, displayMode),
        // nodes: transformGraphNodes(schema.nodes, store.displayMode), //会报错！！！！
        edges: transformEdges(schema.edges, displayMode),
      };
      const { nodes, edges } = schemaOptions || { nodes: [], edges: [] };
      console.log('schemaOptions edges::: ', edges);
      console.log('schemaOptions nodes::: ', nodes);
      const schemaEmpty = nodes.length === 0;
      const canConnect = () => {
        if (IS_PURE) {
          return false;
        }
        if (GS_ENGINE_TYPE === 'groot' && appMode === 'DATA_MODELING') {
          return true;
        }
        return schemaEmpty;
      };

      updateStore(draft => {
        draft.isReady = true;
        draft.nodes = nodes;
        draft.edges = edges;
        draft.appMode = appMode;
        draft.elementOptions = {
          isEditable: schemaEmpty, // 操作按钮： nodes没有值,导入，删除，添加都可以操作；接口返回有值，只能操作添加按钮。
          isConnectable: canConnect(), //  初始状态，接口获取画布有 Schema 数据的时候，不可连线;groot时候一直可以连线
        };
        draft.currentId = schemaEmpty ? '' : nodes[0].id;
        draft.currentType = 'nodes';
        draft.isSaveFiles = isSaveFiles;
        draft.hasLayouted = false;
      });
    })();
  }, [refreshIndex]);
  const description = (
    <FormattedMessage
      id="Start sketching a model, a vertex label is a named grouping or categorization of nodes within the graph dataset"
      values={{
        icon: <PlayCircleOutlined />,
      }}
    />
  );
  return (
    <StudioProvier locales={locales}>
      <Section
        rightSide={
          rightSide || (
            <PropertiesEditor
              appMode={appMode}
              /**  第二项 */
              queryPrimitiveTypes={queryPrimitiveTypes}
              handleUploadFile={handleUploadFile}
              batchUploadFiles={batchUploadFiles}
              onCreateLabel={onCreateLabel}
              onDeleteLabel={onDeleteLabel}
            />
          )
        }
        leftSideStyle={leftSideStyle}
        rightSideStyle={rightSideStyle}
        defaultCollapsed={defaultCollapsed}
        style={{ height: 'calc(100vh - 50px)', ...style }}
        splitBorder
      >
        {isReady ? (
          <GraphEditor showDefaultBtn={false} showMinimap={!IS_PURE} showBackground={!IS_PURE}>
            {!IS_PURE && <ButtonController />}
            {isEmpty && <EmptyCanvas description={description} />}
            {children}
          </GraphEditor>
        ) : (
          <GlobalSpin />
        )}
      </Section>
    </StudioProvier>
  );
};


export default props => {
  return (
     <ImportorProvider {...props} id={props.id} >
      <ImportApp {...props} />
    </ImportorProvider>
  );
};
