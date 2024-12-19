import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Typography, Flex, Space, Button, Tooltip, Input, Upload } from 'antd';

import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import type { IPropertiesSchemaProps } from '../index';
import { useIntl } from 'react-intl';
import { Utils } from '@graphscope/studio-components';

import { useChange } from './useChange';

import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import Progress from './progress';

export type ILocationFieldProps = Pick<IPropertiesSchemaProps, 'type' | 'schema' | 'handleUploadFile'>;
export const uploadRefs = {};
const { Text } = Typography;

const LocationField = forwardRef((props: ILocationFieldProps, ref) => {
  const { schema, type, handleUploadFile } = props;
  const {
    id,
    data: { filelocation, isBind },
  } = schema;
  const intl = useIntl();

  const { handleChangeInput, handleChangeUpload, handleDeleteLocation } = useChange({ id, type });

  const [state, updateState] = useState({
    isLoading: false,
    file: new File([], ''),
    size: '',
  });
  const { isLoading, size, file } = state;
  useImperativeHandle(ref, () => ({
    upload,
  }));

  const upload = async (file: File) => {
    updateState(preState => {
      return {
        ...preState,
        isLoading: true,
        file: file,
        size: Utils.getFileSize(file.size),
      };
    });
    const { file_path = '' } = (await handleUploadFile(file as File)) || {};
    const contents = await Utils.parseFile(file);
    const { header, quoting, delimiter } = Utils.extractHeaderAndDelimiter(contents);
    updateState(preState => {
      return {
        ...preState,
        isLoading: false,
      };
    });
    handleChangeUpload(file_path, {
      dataFields: header,
      quoting,
      delimiter,
    });
  };
  const customRequest: UploadProps['customRequest'] = async options => {
    const { file } = options;
    upload(file as File);
  };
  const icon = isLoading ? <LoadingOutlined /> : <UploadOutlined />;
  const text = isLoading ? 'Uploading...' : 'Upload';
  const tips = isLoading
    ? `The file size is ${size}, so this may take a bit of time to process. Please be patient...`
    : 'Upload';

  return (
    <div
      style={{
        borderRadius: '0px 0px 8px 8px',
      }}
    >
      <Flex vertical gap={8}>
        <Text>Location</Text>
        <Flex justify="space-between" align="center">
          <Space.Compact size="small" style={{ width: '100%' }}>
            <>
              <Tooltip title={tips}>
                <Upload showUploadList={false} customRequest={customRequest}>
                  <Button icon={icon}>
                    <span style={{ fontSize: '12px' }}>
                      <FormattedMessage id={text} />
                    </span>
                  </Button>
                </Upload>
              </Tooltip>
              {isLoading ? (
                <Progress file={file} />
              ) : filelocation ? (
                <Input style={{ width: '100%' }} disabled value={filelocation} />
              ) : (
                <Input
                  style={{ width: '100%' }}
                  defaultValue={filelocation}
                  placeholder={intl.formatMessage({ id: 'Please manually input the odps file location' })}
                  onBlur={handleChangeInput}
                />
              )}
            </>
          </Space.Compact>
          <Space size={0}>
            {filelocation && (
              <Tooltip title="delete and re-upload">
                <Button type="text" size="small" icon={<DeleteOutlined onClick={handleDeleteLocation} />}></Button>
              </Tooltip>
            )}
            {/* <Tooltip title="Bound data source">
              <Button
                type="text"
                size="small"
                icon={<CheckCircleOutlined style={{ color: isBind ? '#53C31C' : '#ddd' }} />}
              ></Button>
            </Tooltip> */}
          </Space>
        </Flex>
      </Flex>
    </div>
  );
});

export default LocationField;
