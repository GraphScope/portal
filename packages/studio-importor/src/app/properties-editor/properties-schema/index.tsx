import React, { forwardRef } from 'react';
import { Typography, Flex, Input } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import useModel from './useModel';
import LocationField from './location';
import SourceTarget from './source-target';
import GrootCase from './groot-case';
import type { ISchemaEdge, ImportorProps, Option } from '../../typing';

export type IPropertiesSchemaProps = Pick<
  ImportorProps,
  'appMode' | 'queryPrimitiveTypes' | 'handleUploadFile' | 'createVertexTypeOrEdgeType' | 'deleteVertexTypeOrEdgeType'
> & {
  schema: ISchemaEdge;
  type: 'nodes' | 'edges';
  disabled: boolean;
};

const PropertiesSchema = forwardRef((props: IPropertiesSchemaProps, ref) => {
  const {
    schema,
    type,
    appMode,
    queryPrimitiveTypes,
    disabled = false,
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
    disable = false,
  } = data || {};
  const { handleChangeLabel, handleProperty, handleSubmit, handleDelete } = useModel({
    type,
    id,
    label,
    source,
    target,
    properties,
    disable,
    createVertexTypeOrEdgeType,
    deleteVertexTypeOrEdgeType,
  });
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
          disabled={disabled}
          handleDelete={handleDelete}
          handleSubmit={handleSubmit}
        />
      </Flex>
    </div>
  );
});

export default PropertiesSchema;
