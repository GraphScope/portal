import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import StagesImportPackages from './import-stage';
interface IImportPeriodicProps {}

const ImportPeriodic: React.FunctionComponent<IImportPeriodicProps> = props => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        onClick={() => {
          setVisible(true);
        }}
        size="small"
      >
        Import Periodic
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
