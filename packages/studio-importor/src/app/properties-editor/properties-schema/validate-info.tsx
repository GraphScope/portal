import React from 'react';
import { Button, Tooltip, theme } from 'antd';
import { FormattedMessage } from 'react-intl';
import { WarningOutlined } from '@ant-design/icons';
const { useToken } = theme;

interface IExtraComponentProps {
  appMode: 'DATA_IMPORTING' | string;
  type: 'node' | 'edge';
  properties: { primaryKey: boolean }[];
}

const ValidateInfo: React.FC<IExtraComponentProps> = ({ appMode = 'DATA_IMPORTING', type, properties }) => {
  const TooltipId = getTooltipTitle({ appMode, type, properties });
  const { token } = useToken();
  return (
    <div style={{ height: '14px' }}>
      {TooltipId && (
        <Tooltip title={<FormattedMessage id={`${TooltipId}`} />}>
          <Button type="text" size="small" icon={<WarningOutlined style={{ color: token.colorErrorActive }} />} />
        </Tooltip>
      )}
    </div>
  );
};
/** 获取不同状态下title */
export function getTooltipTitle({ appMode, type, properties = [] }: IExtraComponentProps): string | null {
  // Early return if the appMode is 'DATA_IMPORTING'
  if (appMode === 'DATA_IMPORTING') {
    return null;
  }

  // Node type checks
  if (type === 'node') {
    if (!properties.length) {
      return 'A vertex must have at least one property.';
    }
    if (!properties.some(({ primaryKey }) => primaryKey)) {
      return 'A vertex must have a primary key.';
    }
  }

  // Edge type check
  if (type === 'edge' && properties.length > 1) {
    return 'A edge can only have one property.';
  }

  // If none of the conditions are met, return null
  return null;
}

export default ValidateInfo;
