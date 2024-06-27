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
  if (appMode !== 'DATA_IMPORTING' && isEditable) {
    if (type === 'node') {
      if (!properties || properties.length === 0) {
        return (
          <Tooltip title={<FormattedMessage id="A vertex must have at least one property." />}>
            <Button type="text" icon={<WarnIcon />} />
          </Tooltip>
        );
      }
      const hasPrimaryKey = properties.some(({ primaryKey }) => primaryKey);
      if (!hasPrimaryKey) {
        return (
          <Tooltip title={<FormattedMessage id="A vertex must have a primary key." />}>
            <Button type="text" icon={<WarnIcon />} />
          </Tooltip>
        );
      }
    } else if (type === 'edge') {
      if (properties?.length !== 1) {
        return (
          <Tooltip title={<FormattedMessage id="An edge can only have one property." />}>
            <Button type="text" icon={<WarnIcon />} />
          </Tooltip>
        );
      }
    }
  }
  return null;
};

export default ExtraComponent;
