import * as React from 'react';
import Section from '@/components/section';
import AlertInfo from './alert-info';
import AlertRule from './alert-rules';
import AlertRecep from './alert-recep/index';
import CreateRecep from './alert-recep/create-alert';
import SegmentedTabs from '@/components/segmented-tabs/index';
import { useContext } from './useContext';
import { Button } from 'antd';
interface AlertModuleProps {}

const AlertModule: React.FunctionComponent<AlertModuleProps> = props => {
  const { store, updateStore } = useContext();
  const { currentType, isEditRecep } = store;
  const items = [
    {
      key: 'info',
      children: <AlertInfo />,
      label: '告警信息',
    },
    {
      key: 'rule',
      children: <AlertRule />,
      label: '告警规则',
    },
    {
      key: 'recep',
      children: !isEditRecep ? <AlertRecep /> : <CreateRecep />,
      label: '告警接收',
    },
    {
      key: 'status',
      children: <>部署状态</>,
      label: '部署状态',
    },
  ];
  const handleChange = () => {
    updateStore(draft => {
      draft.isEditRecep = true;
    });
  };
  const Content = currentType === 'recep' && <Button onClick={handleChange}>创建告警规则</Button>;
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
        segmentedTabsChange={e => {
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
