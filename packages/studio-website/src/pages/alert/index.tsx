import * as React from 'react';
import Section from '@/components/section';
import AlertInfo from './alert-info';
import AlertRule from './alert-rules';
import AlertRecep from './alert-recep';
import CreateRecep from './alert-recep/create-alert';
import { useContext } from './useContext';
import { FormattedMessage } from 'react-intl';
interface AlertModuleProps {}

const AlertModule: React.FunctionComponent<AlertModuleProps> = props => {
  const { store } = useContext();
  const { isEditRecep } = store;
  const items = [
    {
      key: 'info',
      children: <AlertInfo />,
      label: <FormattedMessage id="Alert Info" />,
    },
    {
      key: 'rule',
      children: <AlertRule />,
      label: <FormattedMessage id="Alert Rules" />,
    },
    {
      key: 'recep',
      children: !isEditRecep ? <AlertRecep /> : <CreateRecep />,
      label: <FormattedMessage id="Alert Recep" />,
    },
    {
      key: 'status',
      children: <>部署状态</>,
      label: <FormattedMessage id="Deployment Status" />,
    },
  ];

  return (
    <Section
      breadcrumb={[
        {
          title: 'Home',
        },
        {
          title: 'Alert',
        },
      ]}
      title="Alert"
      desc="Alert"
      items={items}
    ></Section>
  );
};

export default AlertModule;
