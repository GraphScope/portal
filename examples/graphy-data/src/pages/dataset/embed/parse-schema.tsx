import * as React from 'react';
import { Space, Tooltip, Upload, Button, message, notification } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { transSchemaToOptions, transMappingSchemaToOptions, useContext } from '@graphscope/studio-importor';

import { Utils } from '@graphscope/studio-components';
const { Dragger } = Upload;

export type IProps = {
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  disabled?: boolean;
};

const ImportSchema = (props: IProps) => {
  const { style = {}, icon = <InboxOutlined />, disabled } = props;
  const { updateStore, store } = useContext();
  const { appMode } = store;
  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    const { type } = file as File;

    try {
      const content = await Utils.parseFile(file as File);
      if (type === 'application/json') {
        const jsonContent = JSON.parse(content);
        const nodes = jsonContent.nodes.map(item => {
          const { name, properties = {}, ...others } = item;
          return {
            id: name,
            data: {
              label: name,
              ...others,
              ...properties,
            },
            type: 'graph-node',
            position: {
              x: 0,
              y: 0,
            },
          };
        });
        const edges = jsonContent.edges.map(item => {
          const { source, target, name, properties = {}, ...others } = item;
          return {
            id: name || Utils.uuid(),
            type: 'graph-edge',
            source,
            target,
            data: {
              label: name,
              ...others,
              ...properties,
            },
          };
        });

        updateStore(draft => {
          draft.hasLayouted = false;
          draft.nodes = nodes; // transformGraphNodes(schema.nodes, 'graph');
          draft.edges = edges; //transformEdges(schema.edges, 'graph');
        });
      }
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

export default ImportSchema;
