import React, { forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { Typography, Button, Flex, Space, theme } from 'antd';
import { CaretRightOutlined, OpenAIOutlined, CheckCircleOutlined } from '@ant-design/icons';
interface IThinkProps {}

const Think = forwardRef((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  const [state, setState] = React.useState<{
    content: string;
    complete: boolean;
    height: string;
    collapse: boolean;
  }>({
    content: '',
    complete: false,
    height: 'auto',
    collapse: false,
  });
  const update = (message: { content: string; complete: boolean }) => {
    const { content, complete } = message;
    let height = 'auto';
    let collapse = false;
    if (complete && containerRef.current) {
      height = containerRef.current.clientHeight + 'px';
      collapse = true;
    }
    setState(preState => {
      return {
        ...preState,
        content,
        complete,
        height,
        collapse,
      };
    });
  };
  useImperativeHandle(ref, () => ({
    update,
  }));
  const handleToggle = () => {
    setState(preState => {
      return {
        ...preState,
        collapse: !preState.collapse,
      };
    });
  };
  const { content, complete, height, collapse } = state;
  const rootStyle: React.CSSProperties = {
    padding: '8px',
    borderRadius: '8px',
    background: token.colorBgTextHover,
    boxSizing: 'border-box',
  };
  const style: React.CSSProperties = collapse
    ? {
        width: '170px',
        height: '36px',
        overflow: 'hidden',
        transition: 'all .3s cubic-bezier(.4,0,.1,1)',
      }
    : {
        width: '100%',
        height: height,
        transition: 'all .3s cubic-bezier(.4,0,.1,1)',
      };
  const icon = complete ? <CheckCircleOutlined style={{ color: 'green' }} /> : <OpenAIOutlined spin />;
  const title = complete ? 'Thinking result' : 'Thinking...';
  if (content === '') {
    return null;
  }
  return (
    <div style={{ ...rootStyle, ...style }} ref={containerRef}>
      <Flex
        justify="space-between"
        align="center"
        onClick={handleToggle}
        style={{ cursor: 'pointer', paddingBottom: '8px' }}
      >
        <Space>
          {icon}
          <Typography.Text>{title}</Typography.Text>
        </Space>
        <CaretRightOutlined rotate={collapse ? 90 : 0} />
      </Flex>
      <Typography.Text type="secondary" style={{ fontSize: '12px', borderLeft: '1px solid #ddd' }}>
        {content}
      </Typography.Text>
    </div>
  );
});

export default Think;

export const useThink = () => {
  const ref = React.useRef<any>(null);

  const updateThink = message => {
    ref.current.update(message);
  };
  return { thinkRef: ref, updateThink };
};
