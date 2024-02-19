import { AlertApiFactory } from '@graphscope/studio-server';

export const listAlertMessages = async () => {
  const message = await AlertApiFactory(undefined, location.origin)
    .listAlertMessages()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  const info = message.map(item => {
    const { name } = item;
    return {
      info: '',
      name: '',
      severity: '',
      status: '',
    };
  });

  return info;
};
export const listAlertRules = async () => {
  const rules = await AlertApiFactory(undefined, location.origin)
    .listAlertRules()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  const info = rules.map(item => {
    const { name, severity, enable, conditions_desription, frequency, metric_type } = item;
    return {
      name,
      severity,
      type: metric_type,
      status: enable,
      condition: conditions_desription,
      frequency,
    };
  });

  return info;
};
export const listReceivers = async () => {
  const receivers = await AlertApiFactory(undefined, location.origin)
    .listReceivers()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  const info = receivers.map(item => {
    const { name } = item;
    return {
      webhookUrl: '',
      id: '',
      isAll: '',
      status: '',
    };
  });

  return info;
};
export const registerReceiver = async () => {
  const receivers = await AlertApiFactory(undefined, location.origin)
    .registerReceiver()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  const info = receivers.map(item => {
    const { name } = item;
    return {
      webhookUrl: '',
      id: '',
      isAll: '',
      status: '',
    };
  });

  return info;
};
