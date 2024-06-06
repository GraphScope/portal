import React, { useState } from 'react';
import { Breadcrumb, Divider, Typography, Tabs, Segmented, Select, Space, Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { GlobalOutlined } from '@ant-design/icons';
import type { BreadcrumbProps, TabsProps } from 'antd';
interface IConnectModelProps {
  style?: React.CSSProperties;
  options: any[];
  value: string;
}
const defaultOptions = [
  {
    value: 'movie-1',
    label: 'movie-1',
  },
];

const SelectGraph: React.FunctionComponent<IConnectModelProps> = props => {
  const { style, options = defaultOptions, value } = props;
  const [open, setOpen] = useState(false);
  const handleClick = () => {};
  const handleConnect = () => {};

  return (
    <div>
      <Select
        variant="borderless"
        style={{ flex: 1, minWidth: '120px' }}
        placeholder="Choose graph instance"
        value={value}
        dropdownRender={menu => (
          <>
            {menu}
            <Divider style={{ margin: '4px 0px' }} />

            <Button type="default" onClick={handleConnect} style={{ width: '100%' }}>
              Connect
            </Button>
          </>
        )}
        options={options}
      />

      <Modal
        title="Connect"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={'80%'}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </div>
  );
};

export default SelectGraph;
