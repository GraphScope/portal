import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FileImageOutlined } from '@ant-design/icons';
import { useExportSvg } from '../hooks/useExportSvg';

const ExportImage: React.FunctionComponent<{ fileName?: string; parentId?: string }> = (props = {}) => {
  const { exportSvg } = useExportSvg();
  return (
    <Tooltip title={<FormattedMessage id="Save graph model to svg image" />} placement="right">
      <Button
        type="text"
        icon={<FileImageOutlined />}
        onClick={() => exportSvg({ name: props.fileName || 'graph.svg', parentId: props.parentId })}
      />
    </Tooltip>
  );
};

export default ExportImage;
