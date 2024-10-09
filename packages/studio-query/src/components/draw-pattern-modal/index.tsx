import { HighlightOutlined } from '@ant-design/icons';
import { DrawPattern, DrawPatternValue, GraphProps } from '@graphscope/studio-draw-pattern';
import { Button, Modal, Tooltip } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useContext } from '../../app/context';
import { snapshot } from 'valtio';

export interface DrawPatternModalProps {
  previewSchema?: GraphProps;
  onClick?: (value: DrawPatternModalProps) => void;
}

export const DrawPatternModal: React.FC<DrawPatternModalProps> = ({ previewSchema, onClick }) => {
  const [visible, setVisiable] = useState<boolean>(false);
  const { updateStore, store } = useContext();
  const { previewGraphSchema } = store;

  const handleClick = useCallback((value: DrawPatternValue) => {
    setVisiable(false);
    const script = [value.MATCHs, value.WHEREs, value.RETURNs].join('\n');
    updateStore(draft => {
      draft.globalScript = script;
      draft.autoRun = false;
    });
  }, []);

  const MyDrawPattern = useCallback(() => {
    // @ts-ignore
    if (visible)
      return (
        <DrawPattern onClick={handleClick} previewGraph={JSON.parse(JSON.stringify(previewGraphSchema))}></DrawPattern>
      );
    else return <></>;
  }, [visible]);

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
        title=""
        centered
        open={visible}
        onOk={() => setVisiable(false)}
        onCancel={() => setVisiable(false)}
        width={window.innerWidth * 0.8}
        height={window.innerHeight * 0.9}
        footer={null}
      >
        <div style={{ height: `${window.innerHeight * 0.8}px` }}>
          <MyDrawPattern></MyDrawPattern>
        </div>
      </Modal>
    </>
  );
};
