import * as React from 'react';
import { Typography, Flex, Input } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import useModel from './useModel';
import LocationField from './location';
import SourceTarget from './source-target';
import GrootCase from './groot-case';
import type { ISchemaEdge, ImportorProps, Option } from '../../typing';
export type IPropertiesSchemaProps = Pick<ImportorProps, 'appMode' | 'queryPrimitiveTypes' | 'handleUploadFile'> & {
  schema: ISchemaEdge;
  type: 'nodes' | 'edges';
  disabled?: boolean;
};

const PropertiesSchema: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  const { schema, type, appMode, queryPrimitiveTypes, disabled, handleUploadFile } = props;
  const { id, source, target, data } = schema;

  const {
    dataFields,
    properties = [],
    label,
    source_vertex_fields,
    target_vertex_fields,
    isUpload = false,
  } = data || {};
  const { handleChangeLabel, handleProperty } = useModel({ type, id });

  /** 判断是否为导入数据 */
  const mappingColumn =
    appMode === 'DATA_IMPORTING'
      ? {
          options:
            dataFields?.map(item => {
              return { label: item, value: item };
            }) || [],
          type: isUpload ? 'upload' : 'query',
        }
      : null;

  return (
    <Flex vertical gap={12} style={{ margin: '0px 12px' }}>
      {appMode === 'DATA_IMPORTING' ? (
        <LocationField schema={schema} type={type} handleUploadFile={handleUploadFile} />
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
      <GrootCase />
    </Flex>
  );
};

export default PropertiesSchema;
