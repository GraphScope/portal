import React, { useState } from 'react';

import { Space, Tag, Flex, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

import type { ParsedFile, IMeta } from '../Utils/parseCSV';

import { MoreOutlined } from '@ant-design/icons';

interface IMappingHeaderProps {
  id: string;
  updateState: React.Dispatch<
    React.SetStateAction<{
      files: ParsedFile[];
      loading: boolean;
    }>
  >;
  meta: IMeta;
}

const MappingHeader: React.FunctionComponent<IMappingHeaderProps> = props => {
  const { id, updateState, meta } = props;
  const { name, size } = meta;

  const dropdownMenu: MenuProps['items'] = [
    {
      label: 'delete',
      key: 'delete',
    },
  ];
  const onClickDropdownMenu: MenuProps['onClick'] = e => {
    const { key } = e;
    if (key === 'delete') {
      updateState(preState => {
        return {
          ...preState,
          files: preState.files.filter(file => {
            return file.id !== id;
          }),
        };
      });
    }
  };

  return (
    <Flex justify="space-between">
      <div
        style={{
          maxWidth: '180px',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {name}
      </div>
      <div
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Tag bordered={false}>{size}</Tag>
        <Dropdown menu={{ items: dropdownMenu, onClick: onClickDropdownMenu }} trigger={['click']}>
          <Space>
            <MoreOutlined />
          </Space>
        </Dropdown>
      </div>
    </Flex>
  );
};

export default MappingHeader;
