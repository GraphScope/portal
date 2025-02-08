import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Drawer, theme, Tag, Flex, Typography, Tooltip, Button } from 'antd';
import { Utils } from '@graphscope/studio-components';
import { DownloadOutlined } from '@ant-design/icons';
interface IScheduleDrawerProps {}

const ScheduleDrawer = forwardRef((props: IScheduleDrawerProps, ref) => {
  const [state, setState] = useState({
    open: false,
    content: '',
    label: '',
  });
  const { open, content, label } = state;
  const update = params => {
    setState(preState => {
      return {
        ...preState,
        ...params,
      };
    });
  };
  useImperativeHandle(ref, () => ({
    update,
  }));
  const handleClose = () => {
    update({
      open: false,
    });
  };

  const { token } = theme.useToken();
  const handleClick = async () => {
    Utils.createDownload(content, `load_config_${label}.txt`);
  };
  return (
    <Drawer
      width={400}
      title={
        <Flex justify="space-between" align="center">
          <Typography.Text>{label}</Typography.Text>
          <Tooltip title={'Download configuration'}>
            <Button type="text" icon={<DownloadOutlined />} onClick={handleClick}></Button>
          </Tooltip>
        </Flex>
      }
      open={open}
      closable
      onClose={handleClose}
      getContainer={false}
    >
      <pre
        style={{
          fontFamily: 'Consolas, Monaco, "Courier New", Courier, monospace',
          fontSize: 14,
          color: token.colorTextSecondary,
          lineHeight: 1.5,
          backgroundColor: token.colorBorderBg,
          padding: 20,
          border: '1px solid #ddd',
          borderRadius: token.borderRadius,
          whiteSpace: 'pre-wrap',
          maxHeight: '100%',
          overflowY: 'auto',
          overflowWrap: 'break-word',
          wordBreak: 'break-all',
          wordWrap: 'break-word',
        }}
      >
        {content}
      </pre>
    </Drawer>
  );
});

export default ScheduleDrawer;
