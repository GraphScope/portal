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
}

const ValidateInfo: React.FC<IExtraComponentProps> = ({ appMode = 'DATA_IMPORTING', type, properties }) => {
  const tooltip = validateProperties({ appMode, type, properties });
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

export function validateProperties({ appMode, type, properties = [] }: IExtraComponentProps): string | null {
  if (appMode === 'DATA_IMPORTING') {
    return null;
  }

  // Node type checks
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

  // Edge type check
  if (type === 'edges') {
    if (properties.length > 1) {
      return 'A edge can only have one property.';
    }
    if (!properties.every(({ type }) => type)) {
      return 'Please select a primate type.';
    }
  }

  return null;
}

export default ValidateInfo;
