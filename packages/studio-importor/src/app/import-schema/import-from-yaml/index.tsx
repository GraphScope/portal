import * as React from 'react';
import { Space, Tooltip, Upload, Button, message, notification } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import yaml from 'js-yaml';

import { transSchemaToOptions } from '../../utils/index';
import { useContext } from '../../useContext';
import { transformEdges, transformGraphNodes } from '../../elements';

import { Utils } from '@graphscope/studio-components';
const { Dragger } = Upload;

export type IProps = {};

const ImportFromYAML = () => {
  const { updateStore } = useContext();
  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    const { type } = file as File;

    try {
      if (type === 'application/x-yaml') {
        const content = await Utils.parseFile(file as File);

        const jsonContent = yaml.load(content);
        const schema = transSchemaToOptions(jsonContent);
        console.log(content, schema);
        updateStore(draft => {
          draft.hasLayouted = false;
          draft.nodes = transformGraphNodes(schema.nodes, 'graph');
          draft.edges = transformEdges(schema.edges, 'graph');
        });
      }
    } catch (error) {
      console.error('解析文件失败:', error);
      message.error('解析文件失败');
    }
  };
  const onDrop = e => {
    console.log('Dropped files', e.dataTransfer.files);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Dragger
        accept={'.yaml'}
        customRequest={customRequest}
        showUploadList={false}
        multiple={true}
        onDrop={onDrop}
        style={{ height: '100%', width: '100%' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text"></p>
          <p className="ant-upload-hint"></p>
        </div>
      </Dragger>
    </div>
  );
};

export default ImportFromYAML;
