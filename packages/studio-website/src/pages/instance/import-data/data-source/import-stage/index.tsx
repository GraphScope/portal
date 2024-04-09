import React, { useState } from 'react';
import { Segmented, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';
import Stage from './stages-import-packages';
// import PeriodicImportDataworks from './periodic-import-dataworks';
type StagesImportPackagesProps = {
  handleSubmit(value: { repeat: string; schedule: string }, isShow: boolean): void;
};
const { Title } = Typography;
const StagesImportPackages: React.FunctionComponent<StagesImportPackagesProps> = props => {
  const { handleSubmit } = props;
  const [status, setStatus] = useState('dataworks');
  const handleChange = (e: React.SetStateAction<string>) => {
    setStatus(e);
  };
  // let Content;
  // if (status === 'dataworks') {
  //   Content = <PeriodicImportDataworks />;
  // }
  // if (status === 'stage') {
  //   Content = <Stage onChange={handleSubmit} />;
  // }
  return (
    <>
      {/* <Segmented
        options={[
          // { label: <FormattedMessage id="Periodic import from Dataworks" />, value: 'dataworks' },
          { label: <FormattedMessage id="Periodic import" />, value: 'stage' },
        ]}
        onChange={handleChange}
      /> */}
      <Title level={4} style={{ marginTop: '0px' }}>
        <FormattedMessage id="Periodic import" />
      </Title>
      {/* {Content} */}
      <Stage onChange={handleSubmit} />
    </>
  );
};
export default StagesImportPackages;
