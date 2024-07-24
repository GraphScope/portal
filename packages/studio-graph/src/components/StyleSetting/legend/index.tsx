import * as React from 'react';
import { memo } from 'react';
import { Tag, Popover, Button, Space } from 'antd';
import LengendContent from './content';
import type { ILengendContentProps } from './content';

export type ILegendProps = ILengendContentProps & {
  type: 'node' | 'edge';
  onChange: (val: ILengendContentProps) => void;
};

const Legend: React.FunctionComponent<ILegendProps> = props => {
  const { label, color, count } = props;
  const text = count ? `${label} (${count})` : label;

  return (
    <Popover trigger="click" placement="left" content={<LengendContent {...props} />}>
      <Tag style={{ borderRadius: '8px', backgroundColor: color, cursor: 'pointer' }} bordered={false}>
        {text}
      </Tag>
    </Popover>
  );
};

export default memo(Legend);
