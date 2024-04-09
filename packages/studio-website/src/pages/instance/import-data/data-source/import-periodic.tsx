import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import StagesImportPackages from './import-stage';

const ImportPeriodic: React.FunctionComponent<{ handleSubmit(value: { repeat: string; schedule: string }): void }> = ({
  handleSubmit,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Button
        onClick={() => {
          setVisible(true);
        }}
        size="small"
      >
        <FormattedMessage id="Scheduled import" />
      </Button>
      <Modal width={'45%'} open={visible} onCancel={() => setVisible(false)} footer={null}>
        <StagesImportPackages
          handleSubmit={(value: { repeat: string; schedule: string }, isShow: boolean) => {
            setVisible(isShow);
            handleSubmit(value);
          }}
        />
      </Modal>
    </div>
  );
};

export default ImportPeriodic;
