import React from 'react';
import { Button, Tooltip, theme } from 'antd';
import { FormattedMessage } from 'react-intl';
import { WarningOutlined } from '@ant-design/icons';
const { useToken } = theme;
import type { Property } from '@graphscope/studio-components';

interface IExtraComponentProps {
  appMode: 'DATA_IMPORTING' | string;
  type: 'nodes' | 'edges';
  properties: Property[];
  filelocation?: string;
}
const { GS_ENGINE_TYPE } = window as unknown as { GS_ENGINE_TYPE: string };
const ValidateInfo: React.FC<IExtraComponentProps> = ({
  appMode = 'DATA_IMPORTING',
  type,
  properties,
  filelocation,
}) => {
  const tooltip = validateProperties({ appMode, type, properties, filelocation });
  const { token } = useToken();
  return (
    <div style={{ height: '14px' }}>
      {tooltip && (
        <Tooltip title={<FormattedMessage id={`${tooltip}`} />}>
          <Button type="text" size="small" icon={<WarningOutlined style={{ color: token.colorErrorActive }} />} />
        </Tooltip>
      )}
    </div>
  );
};

export function validateProperties({
  appMode,
  type,
  properties = [],
  filelocation,
}: IExtraComponentProps): string | null {
  if (appMode === 'DATA_IMPORTING') {
    if (!filelocation) {
      if (type === 'nodes') {
        return 'This type of vertex has not been bound to a data source yet';
      }
      if (type === 'edges') {
        return 'This type of edges has not been bound to a data source yet';
      }
    }
    return null;
  }

  if (appMode === 'DATA_MODELING') {
    if (type === 'nodes') {
      if (!properties.length) {
        return 'A vertex must have at least one property.';
      }
      if (!properties.some(({ primaryKey }) => primaryKey)) {
        return 'A vertex must have a primary key.';
      }
      if (!properties.every(({ type }) => type)) {
        return 'Please select a primate type.';
      }
    }

    if (type === 'edges') {
      if (GS_ENGINE_TYPE === 'interactive' && properties.length > 1) {
        return 'A edge can only have one property.';
      }
      if (!properties.every(({ type }) => type)) {
        return 'Please select a primate type.';
      }
    }
    return null;
  }

  return null;
}

export default ValidateInfo;
