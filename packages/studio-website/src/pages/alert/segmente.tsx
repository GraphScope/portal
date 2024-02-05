import React from 'react';
import AlertInfo from './alert-info';
import AlertRule from './alert-rules';
import AlertRecep from './alert-recep/index';
import CreateRecep from './alert-recep/create-alert';
import SegmentedTabs from './segmented-tabs';
import { useContext } from './useContext';
import { Button } from 'antd';

type ISegmenteProps = {};

const AlertSegmente: React.FC<ISegmenteProps> = () => {
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
  return <SegmentedTabs items={items} extra={Content} />;
};

export default AlertSegmente;
