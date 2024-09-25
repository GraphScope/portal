import { HighlightOutlined } from '@ant-design/icons';
import { DrawPattern, GraphProps } from '@graphscope/studio-draw-pattern';
import { Button, Modal, Tooltip } from 'antd';
import React, { useState } from 'react';

export interface DrawPatternModalProps {
  previewSchema?: GraphProps;
  onClick?: (value: DrawPatternModalProps) => void;
}

export const DrawPatternModal: React.FC<DrawPatternModalProps> = ({ previewSchema, onClick }) => {
  const [visible, setVisiable] = useState<boolean>(false);

  return (
    <>
      <Tooltip title={'快速绘制语句'} placement="right">
        <Button
          onClick={() => {
            setVisiable(true);
          }}
          type="text"
          icon={<HighlightOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        title="Modal 1000px width"
        centered
        open={visible}
        onOk={() => setVisiable(false)}
        onCancel={() => setVisiable(false)}
        width={window.innerWidth * 0.8}
        height={window.innerHeight * 0.9}
        footer={null}
      >
        <div style={{ height: `${window.innerHeight * 0.8}px` }}>
          <DrawPattern></DrawPattern>
        </div>
      </Modal>
    </>
  );
};
