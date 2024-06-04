import React, { useState } from 'react';
import { Breadcrumb, Divider, Typography, Tabs, Segmented, Select, Space, Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { GlobalOutlined } from '@ant-design/icons';
import type { BreadcrumbProps, TabsProps } from 'antd';
interface IConnectModelProps {
  style?: React.CSSProperties;
}

const ConnectModel: React.FunctionComponent<IConnectModelProps> = props => {
  const { style } = props;
  const [open, setOpen] = useState(false);
  const handleClick = () => {};
  return (
    <div>
      <Button icon={<GlobalOutlined style={{ color: 'green' }} />} onClick={handleClick} style={style}>
        Movie-1
      </Button>
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

export default ConnectModel;
