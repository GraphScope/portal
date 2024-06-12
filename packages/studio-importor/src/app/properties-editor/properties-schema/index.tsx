import * as React from 'react';
import { Typography, Flex, Input, Space, Button, Row } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import useModel from './useModel';
import LocationField from './location';
import SourceTarget from './source-target';
import GrootCase from './groot-case';
import type { ISchemaEdge, ISchemaNode, ISchemaOptions, ImportorProps } from '../../typing';

export type IPropertiesSchemaProps = Pick<ImportorProps, 'appMode' | 'queryPrimitiveTypes' | 'handleUploadFile'> & {
  schema: ISchemaEdge;
  type: 'nodes' | 'edges';
  disabled?: boolean;
};

const PropertiesSchema: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  const { schema, type, appMode, queryPrimitiveTypes, disabled } = props;
  const { id, source, target, data } = schema;
  const { dataFields, properties = [], label = id, source_data_fields, target_data_fields } = data;
  const { handleChangeLabel, handleProperty } = useModel({ type, id });
  /** 判断是否为导入数据 */
  const mappingColumn =
    appMode === 'DATA_IMPORTING'
      ? {
          options:
            dataFields?.map((item, index) => {
              return { label: item, value: item };
            }) || [],
          type: dataFields?.length ? 'Select' : 'InputNumber',
        }
      : null;

  return (
    <div>
      <Flex vertical gap={12} style={{ margin: '0px 12px' }}>
        {appMode === 'DATA_IMPORTING' ? (
          <LocationField {...props} />
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
            source_data_fields={source_data_fields}
            target_data_fields={target_data_fields}
            componentType={dataFields?.length ? 'Select' : 'InputNumber'}
            //@ts-ignore
            mappingColumn={mappingColumn}
          />
        )}
        <PropertiesList
          properties={properties}
          onChange={handleProperty}
          typeColumn={{ options: queryPrimitiveTypes() }}
          disabled={disabled}
          //@ts-ignore
          mappingColumn={mappingColumn}
        />
        <GrootCase />
      </Flex>
    </div>
  );
};

export default PropertiesSchema;
