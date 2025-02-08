import React, { forwardRef } from 'react';
import { Typography, Flex, Input } from 'antd';
import { PropertiesList, EngineFeature } from '@graphscope/studio-components';
import useModel from './useModel';
import LocationField from './location';
import Odps from './odps';
import SourceTarget from './source-target';
import { FormattedMessage } from 'react-intl';
import type { ISchemaEdge, ImportorProps, Option } from '../../typing';

export type IPropertiesSchemaProps = Pick<ImportorProps, 'appMode' | 'queryPrimitiveTypes' | 'handleUploadFile'> & {
  schema: ISchemaEdge;
  type: 'nodes' | 'edges';
};

const PropertiesSchema = forwardRef((props: IPropertiesSchemaProps, ref) => {
  const { schema, type, appMode, queryPrimitiveTypes, handleUploadFile } = props;
  const { id, source, target, data } = schema;
  const {
    dataFields,
    properties = [],
    label,
    source_vertex_fields,
    target_vertex_fields,
    disabled = false,
    isBind,
  } = data || {};

  const { handleChangeLabel, handleProperty } = useModel({
    type,
    id,
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
          <>
            <EngineFeature match="LOAD_CSV_DATA">
              <LocationField ref={ref} schema={schema} type={type} handleUploadFile={handleUploadFile} />
            </EngineFeature>
            <EngineFeature match="DOWNLOAD_DATA_TASK_CONFIG">
              <Odps ref={ref} schema={schema} type={type} handleUploadFile={handleUploadFile} />
            </EngineFeature>
          </>
        ) : (
          <>
            <Typography.Text>
              <FormattedMessage id="Label" />
            </Typography.Text>
            <Input value={label} onChange={handleChangeLabel} disabled={disabled} />
          </>
        )}
        {type === 'edges' && (
          <SourceTarget
            id={id}
            disabled={window.GS_ENGINE_TYPE === 'groot' ? isBind : false}
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
          mappingDisabled={window.GS_ENGINE_TYPE === 'groot' ? isBind : false}
          mappingColumn={mappingColumn as ImportorProps['mappingColumn']}
        />
      </Flex>
    </div>
  );
});

export default PropertiesSchema;
