import React, { useEffect, useMemo } from 'react';
import GraphCanvas from './graph-canvas';
import PropertiesEditor from './properties-editor';
import ImportSchema from './import-schema';
import ModeSwitch from './mode-switch';
import { ReactFlowProvider } from 'reactflow';
import { Toolbar } from '@graphscope/studio-components';
import AddNode from './graph-canvas/add-node';
import Delete from './graph-canvas/delete';
import 'reactflow/dist/style.css';
import RightButton from './layout-controller/right-button';
import LeftButton from './layout-controller/left-button';
import { notification } from 'antd';
import { transformGraphNodes, transformEdges } from './elements/index';
import { IdContext } from './useContext';
interface Option {
  label: string;
  value: string;
}
interface ImportAppProps {
  id: string;
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
}
import { useContext } from './useContext';
import { Button } from 'antd';

const ImportApp: React.FunctionComponent<ImportAppProps> = props => {
  const { appMode, handleImporting, saveModeling, queryGraphSchema, queryBoundSchema, id } = props;
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
      });
    })();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ height: '100%', display: 'flex' }}>
        <div
          style={{
            width: left ? '0px' : '300px',
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
              <AddNode />
              <Delete />
              {/* <ModeSwitch /> */}
            </Toolbar>
            <Toolbar style={{ top: '18px', right: '70px', left: 'unset', padding: 0 }}>
              {appMode === 'DATA_IMPORTING' ? (
                <Button type="primary" onClick={_handleImporting}>
                  Start Importing
                </Button>
              ) : (
                <Button type="primary" onClick={handleSave}>
                  Save Modeling
                </Button>
              )}
            </Toolbar>
            <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }}>
              <RightButton />
            </Toolbar>
            <GraphCanvas />
          </ReactFlowProvider>
        </div>
        <div
          style={{
            width: right ? '0px' : '350px',
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
  );
};

export const MultipleInstance = props => {
  const SDK_ID = useMemo(() => {
    if (!props.id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.warn(`⚠️: props.id 缺失，默认生成 SDK_ID : ${defaultId} 用于多实例管理`);
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
