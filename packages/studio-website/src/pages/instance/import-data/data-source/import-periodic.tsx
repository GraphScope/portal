import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
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
        <FormattedMessage id="Import Periodic" />
      </Button>
      <Modal width={'45%'} open={visible} onCancel={() => setVisible(false)} footer={null}>
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
