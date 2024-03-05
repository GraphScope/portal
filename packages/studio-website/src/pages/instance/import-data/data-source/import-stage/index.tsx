import React from 'react';
import { Segmented } from 'antd';
import { FormattedMessage } from 'react-intl';
import Stage from './stages-import-packages';
type StagesImportPackagesProps = {
  onChange(val: boolean): void;
};
const StagesImportPackages: React.FunctionComponent<StagesImportPackagesProps> = props => {
  const { onChange } = props;
  return (
    <>
      <Segmented
        options={[
          { label: <FormattedMessage id="Periodic Import From Dataworks" />, value: 'dataworks' },
          { label: <FormattedMessage id="Periodic Import From ODPS" />, value: 'stage' },
        ]}
      />
      <Stage onChange={onChange} />
    </>
  );
};
export default StagesImportPackages;
