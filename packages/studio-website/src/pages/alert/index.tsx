import * as React from 'react';
import Section from '@/components/section';
import AlertInfo from './alert-info';
import AlertRule from './alert-rules';
import AlertRecep from './alert-recep';
import { FormattedMessage } from 'react-intl';
interface AlertModuleProps {}

const AlertModule: React.FunctionComponent<AlertModuleProps> = props => {
  const items = [
    {
      key: 'info',
      children: <AlertInfo />,
      label: <FormattedMessage id="Alert info" />,
    },
    {
      key: 'rule',
      children: <AlertRule />,
      label: <FormattedMessage id="Alert rules" />,
    },
    {
      key: 'recep',
      children: <AlertRecep />,
      label: <FormattedMessage id="Alert receiver" />,
    },
    // {
    //   key: 'status',
    //   children: <>部署状态</>,
    //   label: <FormattedMessage id="Deployment Status" />,
    // },
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
