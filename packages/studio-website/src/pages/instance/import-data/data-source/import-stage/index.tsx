import React, { useState } from 'react';
import { Segmented } from 'antd';
import { FormattedMessage } from 'react-intl';
import Stage from './stages-import-packages';
import PeriodicImportDataworks from './periodic-import-dataworks';
type StagesImportPackagesProps = {
  onChange(val: boolean): void;
};
const StagesImportPackages: React.FunctionComponent<StagesImportPackagesProps> = props => {
  const { onChange } = props;
  const [status, setStatus] = useState('dataworks');
  const handleChange = (e: React.SetStateAction<string>) => {
    setStatus(e);
  };
  let Content;
  if (status === 'dataworks') {
    Content = <PeriodicImportDataworks />;
  }
  if (status === 'stage') {
    Content = <Stage onChange={onChange} />;
  }
  return (
    <>
      <Segmented
        options={[
          { label: <FormattedMessage id="Periodic import from Dataworks" />, value: 'dataworks' },
          { label: <FormattedMessage id="Periodic import from ODPS" />, value: 'stage' },
        ]}
        onChange={handleChange}
      />
      {Content}
    </>
  );
};
export default StagesImportPackages;
