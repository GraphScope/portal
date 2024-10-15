import React, { useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Popover
      getPopupContainer={node => {
        if (containerRef.current) {
          return containerRef.current;
        }
        return node;
      }}
      trigger="click"
      placement="left"
      content={<LengendContent {...props} />}
    >
      <Tag
        style={{
          textAlign: 'center',
          borderRadius: '8px',
          backgroundColor: color,
          cursor: 'pointer',
          minWidth: '60px',
          minHeight: '22px',
          color: '#000',
        }}
        bordered={false}
      >
        {text}
      </Tag>
    </Popover>
  );
};

export default memo(Legend);
