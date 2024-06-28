import React from 'react';
import { Button, Tooltip } from 'antd';
import WarnIcon from './warn-icon';
import { FormattedMessage } from 'react-intl';

interface IExtraComponentProps {
  appMode: 'DATA_IMPORTING' | string;
  type: 'node' | 'edge';
  properties: { primaryKey: boolean }[];
}

const ValidateInfo: React.FC<IExtraComponentProps> = ({ appMode = 'DATA_IMPORTING', type, properties }) => {
  const TooltipId = getTitle({ appMode, type, properties });
  return (
    <>
      {TooltipId && (
        <Tooltip title={<FormattedMessage id={`${TooltipId}`} />}>
          <Button type="text" icon={<WarnIcon />} />
        </Tooltip>
      )}
    </>
  );
};
/** 获取不同状态下title */
export function getTitle({ appMode, type, properties = [] }: IExtraComponentProps): string | null {
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
  if (type === 'edge' && properties.length !== 1) {
    return 'A edge can only have one property.';
  }

  // If none of the conditions are met, return null
  return null;
}

export default ValidateInfo;
