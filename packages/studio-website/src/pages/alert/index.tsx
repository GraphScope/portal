import * as React from 'react';
import Section from '@/components/section';
/** 告警信息 */
import AlertInfo from './alert-info';
/** 告警规则 */
import AlertRule from './alert-rules';
/** 告警接收 */
import AlertRecep from './alert-recep';
import { FormattedMessage } from 'react-intl';
interface AlertModuleProps {}

const AlertModule: React.FunctionComponent<AlertModuleProps> = props => {
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
      children: <AlertRecep />,
      label: <FormattedMessage id="Alert Recep" />,
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
