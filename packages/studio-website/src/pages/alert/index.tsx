import * as React from 'react';
import Section from '@/components/section';
import AlertInfo from './alert-info';
import AlertRule from './alert-rules';
import AlertRecep from './alert-recep/index';
import CreateRecep from './alert-recep/create-alert';
import SegmentedTabs from '@/components/segmented-tabs/index';
import { useContext } from './useContext';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';
interface AlertModuleProps {}

const AlertModule: React.FunctionComponent<AlertModuleProps> = props => {
  const { store, updateStore } = useContext();
  const { currentType, isEditRecep } = store;
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
  /**
   * 告警接收内容区组件切换
   */
  const handleChange = () => {
    updateStore(draft => {
      draft.isEditRecep = true;
    });
  };
  /**
   * 创建告警接收入口
   */
  const Content = currentType === 'recep' && (
    <Button type="text" onClick={handleChange}>
      <FormattedMessage id="Create Alert Rules" />
    </Button>
  );
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
    >
      <SegmentedTabs
        items={items}
        extra={Content}
        segmentedTabsChange={(e: 'info' | 'rule' | 'recep' | 'status') => {
          updateStore(draft => {
            draft.currentType = e;
          });
        }}
      />
      ;
    </Section>
  );
};

export default AlertModule;
