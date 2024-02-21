import { AlertApiFactory, UpdateAlertMessagesRequest } from '@graphscope/studio-server';

export type IAlertMessages = {
  type?: string;
  status?: 'unsolved' | 'solved' | 'dealing';
  severity?: 'warning' | 'emergency';
  startTime?: string;
  endTime?: string;
};
export const listAlertMessages = async (params: IAlertMessages) => {
  const message = await AlertApiFactory(undefined, location.origin)
    .listAlertMessages(params)
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  return message;
};

export const updateAlertMessages = async (params: UpdateAlertMessagesRequest) => {
  const message = await AlertApiFactory(undefined, location.origin)
    .updateAlertMessages(params)
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });

  return message;
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
