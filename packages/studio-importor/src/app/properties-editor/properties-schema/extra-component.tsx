import React from 'react';
import { Button, Tooltip } from 'antd';
import WarnIcon from './warn-icon';
import { FormattedMessage } from 'react-intl';

interface IExtraComponentProps {
  appMode: 'DATA_IMPORTING' | string;
  isEditable: boolean;
  type: 'node' | 'edge';
  properties: { primaryKey: boolean }[];
}

const ExtraComponent: React.FC<IExtraComponentProps> = ({ appMode, isEditable, type, properties }) => {
  const TooltipId = getTitle({ appMode, isEditable, type, properties });
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
export function getTitle({ appMode, isEditable, type, properties }: IExtraComponentProps): string | null {
  if (appMode !== 'DATA_IMPORTING' && isEditable) {
    if (type === 'node') {
      if (!properties || properties.length === 0) {
        return 'A vertex must have at least one property.';
      }
      const hasPrimaryKey = properties.some(({ primaryKey }) => primaryKey);
      if (!hasPrimaryKey) {
        return 'A vertex must have a primary key.';
      }
    } else if (type === 'edge') {
      if (properties?.length !== 1) {
        return 'An edge can only have one property.';
      }
    }
  }
  return null;
}
export default ExtraComponent;
