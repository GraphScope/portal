import React, { useEffect, useMemo } from 'react';
import GraphCanvas from './graph-canvas';
import PropertiesEditor from './properties-editor';
import ImportSchema from './import-schema';

import { ReactFlowProvider } from 'reactflow';
import { Toolbar } from '@graphscope/studio-components';
import AddNode from './graph-canvas/add-node';
import Delete from './graph-canvas/delete';
import 'reactflow/dist/style.css';
import RightButton from './button-controller/right-button';
import LeftButton from './button-controller/left-button';
import { Divider, notification } from 'antd';
import { transformGraphNodes, transformEdges } from './elements/index';
import { IdContext } from './useContext';
import Provider from './provider';
import StartImporting from './button-controller/start-importing';
import SaveModeling from './button-controller/save-modeling';
interface Option {
  label: string;
  value: string;
}
interface ImportAppProps {
  /** 用于多实例管理的 ID */
  id?: string;
  /** 语言 */
  locale?: 'zh-CN' | 'en-US';
  /** 主题样式 */
  theme?: {
    primaryColor: string;
    mode: 'darkAlgorithm' | 'defaultAlgorithm';
  };
  appMode: 'DATA_MODELING' | 'DATA_IMPORTING';
  /**  第二项 */
  queryPrimitiveTypes: () => {
    options: Option[];
  };
  /** 第四项 */
  mappingColumn?: {
    options: Option[];
    type: 'Select' | 'InputNumber';
  };

  queryGraphSchema?: () => Promise<any>;
  queryBoundSchema?: () => Promise<any>;
  handleUploadFile?: (file: File) => Promise<string>;
  saveModeling?: (schema: any) => void;
  handleImporting?: (schema: any) => void;
  queryImportData?: () => void;
  /** 默认样式相关 */
  defaultLeftStyles?: {
    collapsed: boolean;
    width: number;
  };
  defaultRightStyles?: {
    collapsed: boolean;
    width: number;
  };

  elementOptions?: {
    /** 是否能够连线，包括拖拽产生节点 */
    isClickable: boolean;
    /** 是否可以点击，包含点和边 */
    isEditable: boolean;
    /** 是否可以编辑标签，包括节点和边 */
    isConnectable: boolean;
  };
}
import { useContext } from './useContext';
import { Button } from 'antd';

const ImportApp: React.FunctionComponent<ImportAppProps> = props => {
  const {
    appMode,
    handleImporting,
    saveModeling,
    queryGraphSchema,
    queryBoundSchema,
    id,
    locale = 'zh-CN',
    theme = {
      primaryColor: '#1890ff',
      mode: 'defaultAlgorithm',
    },
    defaultLeftStyles = {
      collapsed: true,
      width: 300,
    },
    defaultRightStyles = {
      collapsed: true,
      width: 400,
    },
    elementOptions,
  } = props;
  const { store, updateStore } = useContext();
  const { collapsed } = store;
  const { left, right } = collapsed;
  const { nodes, edges } = store;

  const handleSave = () => {
    let errors: string[] = [];
    const _nodes = nodes.map(item => {
      const { data, id } = item;
      const { label, properties } = data;
      if (properties) {
        return {
          id,
          label,
          properties,
        };
      } else {
        errors.push(label);
      }
    });
    const _edges = edges.map(item => {
      const { data, id, source, target } = item;
      const { label, properties } = data;
      return {
        label,
        id,
        source,
        target,
        properties,
      };
    });
    if (errors.length !== 0) {
      notification.warning({
        message: `Properties error`,
        description: `Vertex ${errors.join(',')} need add Properties`,
        duration: 1,
      });
    } else if (saveModeling) {
      saveModeling({
        nodes: _nodes,
        edges: _edges,
      });
    }
  };
  /** 数据绑定 */
  const _handleImporting = () => {
    const graphSchema = [...nodes, ...edges];
    console.log(graphSchema);
    if (handleImporting) {
      handleImporting(graphSchema);
    }
  };
  useEffect(() => {
    (async () => {
      let schemaOptions = {};

      if (appMode === 'DATA_MODELING' && queryGraphSchema) {
        schemaOptions = await queryGraphSchema();
      }
      if (appMode === 'DATA_IMPORTING' && queryBoundSchema) {
        const schema = await queryBoundSchema();

        schemaOptions = {
          nodes: transformGraphNodes(schema.nodes, store.displayMode),
          edges: transformEdges(schema.edges, store.displayMode),
        };
      }
      //@ts-ignore
      const { nodes, edges } = schemaOptions || { nodes: [], edges: [] };
      updateStore(draft => {
        draft.nodes = nodes;
        draft.edges = edges;
        draft.appMode = appMode;
        draft.collapsed.left = defaultLeftStyles.collapsed;
        draft.collapsed.right = defaultRightStyles.collapsed;
        draft.elementOptions = {
          isClickable: (elementOptions || {}).isClickable !== false, //默认undefined 则返回true
          isEditable: nodes.length === 0, // 初始状态，接口获取画布有 Schema 数据的时候，不可编辑
          isConnectable: nodes.length === 0, //  初始状态，接口获取画布有 Schema 数据的时候，不可连线
        };
      });
    })();
  }, []);

  return (
    <Provider locale={locale} theme={theme}>
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ height: '100%', display: 'flex' }}>
          <div
            style={{
              width: left ? '0px' : defaultLeftStyles.width,
              padding: left ? '0px' : '0px 12px',
              overflow: 'hidden',
              transition: 'width 0.2s ease',
            }}
          >
            <ImportSchema />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <ReactFlowProvider>
              <Toolbar>
                <LeftButton />
                <Divider type="horizontal" style={{ margin: '0px' }} />
                <AddNode />
                <Delete />
                {/* <ModeSwitch /> */}
              </Toolbar>

              <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="horizontal">
                <StartImporting onClick={_handleImporting} />
                <SaveModeling onClick={handleSave} />
                <Divider type="vertical" style={{ margin: '0px' }} />
                <RightButton />
              </Toolbar>
              <GraphCanvas />
            </ReactFlowProvider>
          </div>
          <div
            style={{
              width: right ? '0px' : defaultRightStyles.width,
              padding: right ? '0px' : '0px 12px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'width 0.2s ease',
            }}
          >
            <PropertiesEditor {...props} />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export const MultipleInstance = props => {
  const SDK_ID = useMemo(() => {
    if (!props.id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.info(
        `%c ⚠️: The id prop is missing in the Importor component. A default SDK_ID: ${defaultId} is generated for managing multiple instances.`,
        'color:green',
      );
      return defaultId;
    }
    return props.id;
  }, []);

  return (
    <IdContext.Provider value={{ id: SDK_ID }}>
      <ImportApp {...props} />
    </IdContext.Provider>
  );
};

export default MultipleInstance;
