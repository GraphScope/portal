import * as React from 'react';
import { Space, Tooltip, Upload, Button, message, notification } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import yaml from 'js-yaml';

import { transSchemaToOptions, appendData } from '../../utils/modeling';
import { transMappingSchemaToOptions } from '../../utils/importing';
import { useContext } from '../../useContext';
import { transformEdges, transformGraphNodes } from '../../elements';

import { Utils } from '@graphscope/studio-components';
const { Dragger } = Upload;

export type IProps = {
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  disabled?: boolean;
};

const hackContent = jsonContent => {
  if ('schema' in jsonContent) {
    return jsonContent.schema;
  }
  if ('vertex_types' in jsonContent && 'edge_types' in jsonContent) {
    return jsonContent;
  }
  if ('vertex_mappings' in jsonContent && 'edge_mappings' in jsonContent) {
    return { vertex_mappings: jsonContent.vertex_mappings, edge_mappings: jsonContent.edge_mappings };
  }
  return {};
};

const ImportFromYAML = (props: IProps) => {
  const { style = {}, icon = <InboxOutlined />, disabled } = props;
  const { updateStore, store } = useContext();
  const { appMode, nodes, edges } = store;
  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    const { type } = file as File;

    try {
      const content = await Utils.parseFile(file as File);
      let jsonContent;
      if (type === 'application/x-yaml') {
        jsonContent = hackContent(yaml.load(content));
      }
      if (type === 'application/json') {
        jsonContent = JSON.parse(content);
      }
      let schema;
      if (appMode === 'DATA_MODELING') {
        schema = transSchemaToOptions(jsonContent, () => {
          return {
            disabled: false,
            saved: false,
          };
        });
      }
      if (appMode === 'DATA_IMPORTING') {
        schema = transMappingSchemaToOptions({} as any, jsonContent, { nodes, edges } as any);
      }
      updateStore(draft => {
        draft.hasLayouted = false;
        draft.nodes = transformGraphNodes(schema.nodes, 'graph');
        draft.edges = transformEdges(schema.edges, 'graph');
      });
    } catch (error) {
      console.error('解析文件失败:', error);
      message.error('解析文件失败');
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Dragger
        disabled={appMode === 'DATA_MODELING' ? disabled : false}
        accept={'.yaml,.json'}
        customRequest={customRequest}
        showUploadList={false}
        multiple={true}
        style={{ height: '100px', width: '100%', ...style }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="ant-upload-drag-icon">{icon}</p>
        </div>
      </Dragger>
    </div>
  );
};

export default ImportFromYAML;
