import { SignatureOutlined } from '@ant-design/icons';
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
  const { schemaData, language } = store;

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
      return <DrawPattern onClick={handleClick} previewGraph={JSON.parse(JSON.stringify(schemaData))}></DrawPattern>;
    else return <></>;
  }, [visible]);

  if (language !== 'cypher') {
    return null;
  }

  return (
    <>
      <Tooltip title={'快速绘制语句'} placement="right">
        <Button
          onClick={() => {
            setVisiable(true);
          }}
          type="text"
          icon={<SignatureOutlined />}
        ></Button>
      </Tooltip>
      <Modal
        title=""
        centered
        open={visible}
        onOk={() => setVisiable(false)}
        onCancel={() => setVisiable(false)}
        width={'90%'}
        footer={null}
      >
        <div style={{ height: `${window.innerHeight * 0.8}px` }}>
          <MyDrawPattern></MyDrawPattern>
        </div>
      </Modal>
    </>
  );
};
