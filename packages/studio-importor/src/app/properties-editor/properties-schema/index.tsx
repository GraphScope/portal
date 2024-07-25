import React, { memo, forwardRef } from 'react';
import { Typography, Flex, Input } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import useModel from './useModel';
import LocationField from './location';
import SourceTarget from './source-target';
import GrootCase from './groot-case';
import type { ISchemaEdge, ISchemaNode, ISchemaOptions, ImportorProps, Option, IEdgeData } from '../../typing';
import { useContext } from '../../useContext';
import { validateProperties } from './validate-info';
export type IPropertiesSchemaProps = Pick<
  ImportorProps,
  'appMode' | 'queryPrimitiveTypes' | 'handleUploadFile' | 'createVertexTypeOrEdgeType' | 'deleteVertexTypeOrEdgeType'
> & {
  schema: ISchemaEdge;
  type: 'nodes' | 'edges';
  disabled?: boolean;
};

const PropertiesSchema = forwardRef((props: IPropertiesSchemaProps, ref) => {
  const {
    schema,
    type,
    appMode,
    queryPrimitiveTypes,
    disabled,
    handleUploadFile,
    createVertexTypeOrEdgeType,
    deleteVertexTypeOrEdgeType,
  } = props;
  const { id, source, target, data } = schema;
  const {
    dataFields,
    properties = [],
    label,
    source_vertex_fields,
    target_vertex_fields,
    isNewNodeOrEdge = false,
  } = data || {};
  const { handleChangeLabel, handleProperty } = useModel({ type, id });
  const { store, updateStore } = useContext();
  const { nodes, edges } = store;
  /** 判断是否为导入数据 */
  const mappingColumn =
    appMode === 'DATA_IMPORTING'
      ? {
          options:
            dataFields?.map(item => {
              return { label: item, value: item };
            }) || [],
        }
      : null;
  /** groot 保存节点或边*/
  const handleSubmit = async () => {
    let response: boolean = true;
    if (type === 'nodes') {
      response = await createVertexTypeOrEdgeType(type, { label, properties });
      /** 置灰不可编辑，转化为正常查询数据 */
      if (response) {
        updateStore(draft => {
          draft.nodes = draft.nodes.map(item => {
            if (item.id === id) {
              return {
                ...item,
                data: { ...item.data, isNewNodeOrEdge: false },
              };
            }
            return item;
          });
        });
      }
    }
    if (type === 'edges') {
      response = await createVertexTypeOrEdgeType(type, { nodes, label, source, target, properties });
      /** 置灰不可编辑，转化为正常查询数据 */
      if (response) {
        updateStore(draft => {
          draft.edges = draft.edges.map(item => {
            if (item.id === id) {
              return {
                ...item,
                data: { ...item.data, isNewNodeOrEdge: false },
              };
            }
            return item;
          });
        });
      }
    }
  };
  /** groot 删除节点或边*/
  const handleDelete = async () => {
    if (type === 'nodes') {
      let response: boolean = true;
      if (!isNewNodeOrEdge) {
        response = await deleteVertexTypeOrEdgeType(type, label);
      }
      if (response) {
        /** 删除本地节点数据 */
        const nodeList = nodes.filter(item => item.id !== id);
        /** 删除节点时，需要删除与节点相关联边 */
        const edgeList = edges.filter(item => item.source !== id && item.target !== id);
        await updateStore(draft => {
          draft.nodes = JSON.parse(JSON.stringify(nodeList));
          draft.edges = JSON.parse(JSON.stringify(edgeList));
          draft.isQueryData = !!nodeList.length;
        });
      }
    }
    if (type === 'edges') {
      if (!isNewNodeOrEdge) {
        await deleteVertexTypeOrEdgeType(type, label, source, target, nodes);
      }
      /** 删除本地边数据 */
      const edgeList = edges.filter(item => item.id !== id);
      await updateStore(draft => {
        draft.edges = JSON.parse(JSON.stringify(edgeList));
      });
    }
  };
  return (
    <div>
      <Flex vertical gap={12} style={{ margin: '0px 12px' }}>
        {appMode === 'DATA_IMPORTING' ? (
          <LocationField ref={ref} schema={schema} type={type} handleUploadFile={handleUploadFile} />
        ) : (
          <>
            <Typography.Text>Label</Typography.Text>
            <Input value={label} onChange={handleChangeLabel} disabled={disabled} />
          </>
        )}
        {type === 'edges' && (
          <SourceTarget
            id={id}
            source={source}
            target={target}
            source_vertex_fields={source_vertex_fields}
            target_vertex_fields={target_vertex_fields}
            mappingColumn={mappingColumn as ImportorProps['mappingColumn']}
          />
        )}
        <PropertiesList
          properties={properties}
          onChange={handleProperty}
          typeColumn={{ options: queryPrimitiveTypes() as unknown as Option[] }}
          disabled={disabled}
          mappingColumn={mappingColumn as ImportorProps['mappingColumn']}
        />
        <GrootCase
          type={type}
          appMode={appMode}
          properties={properties}
          isNewNodeOrEdge={isNewNodeOrEdge}
          handleDelete={handleDelete}
          handleSubmit={handleSubmit}
        />
      </Flex>
    </div>
  );
});

export default PropertiesSchema;
