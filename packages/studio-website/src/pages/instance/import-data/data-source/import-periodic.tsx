import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import StagesImportPackages from './import-stage/stages-import-packages';
interface IImportPeriodicProps {}

const ImportPeriodic: React.FunctionComponent<IImportPeriodicProps> = props => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        周期导入
      </Button>
      <Modal width={'75%'} open={visible} footer={null}>
        <StagesImportPackages
          onChange={(val: boolean) => {
            setVisible(val);
          }}
        />
      </Modal>
    </div>
  );
};

export default ImportPeriodic;
