import * as React from 'react';
import { Typography, Flex, Input, Space, Button, Row } from 'antd';
import { PropertiesList } from '@graphscope/studio-components';
import useModel from './useModel';
import LocationField from './location';
import SourceTarget from './source-target';
import GrootCase from './groot-case';
export interface IPropertiesSchemaProps {
  GS_ENGINE_TYPE: string;
  getPrimitiveTypes(): { label: string; value: string }[];
  data: any;
  type: 'nodes' | 'edges';
  appMode: string;
  uploadFile(file): { file_path: string };
}

const PropertiesSchema: React.FunctionComponent<IPropertiesSchemaProps> = props => {
  const { data, type, appMode, getPrimitiveTypes } = props;
  const {
    id,
    data: { label },
    source,
    target,
    dataFields,
    properties = [],
  } = data;

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
            <Input value={label} onChange={handleChangeLabel} />
          </>
        )}
        {type === 'edges' && <SourceTarget source={source} target={target} />}
        <PropertiesList
          properties={[{ key: '1', name: 'id', type: 'int', primaryKey: true, token: '', index: 0 }]}
          // properties={properties}
          onChange={handleProperty}
          typeColumn={{ options: getPrimitiveTypes() }}
          //@ts-ignore
          mappingColumn={mappingColumn}
        />
        <GrootCase />
      </Flex>
    </div>
  );
};

export default PropertiesSchema;
