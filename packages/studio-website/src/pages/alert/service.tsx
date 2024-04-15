import { AlertApiFactory, UpdateAlertMessagesRequest } from '@graphscope/studio-server';
import type { AlertReceiver, AlertRule } from '@graphscope/studio-server';
import { setNotification } from '@/pages/utils';
export type IAlertMessages = {
  type?: string;
  status?: 'unsolved' | 'solved' | 'dealing';
  severity?: 'warning' | 'emergency';
  startTime?: string;
  endTime?: string;
};
export type IMessageType = {
  key: string;
  message_id: string;
};
export type IAlertRules = {
  key: string;
  name: string;
  severity: string;
  metric_type: string;
  conditions_desription: string;
  frequency: number;
  enable: true;
};
/**
 *
 * @param params
 * 告警信息接口
 * @returns
 */
export const listAlertMessages = async (params: IAlertMessages) => {
  const message = await AlertApiFactory(undefined, location.origin)
    .listAlertMessages(params)
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      setNotification('error', error);
    });
  const info = message.map((item: IAlertMessages & IMessageType) => {
    const { message_id } = item;
    return {
      ...item,
      key: message_id,
    };
  });
  return info;
};

export const updateAlertMessages = async (params: UpdateAlertMessagesRequest) => {
  const message = await AlertApiFactory(undefined, location.origin)
    .updateAlertMessages(params)
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      setNotification('error', error);
    });

  return message;
};
/**
 * 告警规则接口
 * @returns
 */
export const listAlertRules = async () => {
  const rules = await AlertApiFactory(undefined, location.origin)
    .listAlertRules()
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      setNotification('error', error);
    });

  const info = rules.map((item: IAlertRules) => {
    const { name } = item;
    return {
      ...item,
      key: name,
    };
  });
  return info;
};
export const deleteAlertRuleByName = async (params: string) => {
  const rules = await AlertApiFactory(undefined, location.origin)
    .deleteAlertRuleByName(params)
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      setNotification('error', error);
    });

  return rules;
};
export const updateAlertRuleByName = async (params: string, alertRule: AlertRule) => {
  const rules = await AlertApiFactory(undefined, location.origin)
    .updateAlertRuleByName(params, alertRule)
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      setNotification('error', error);
    });

  return rules;
};
/**
 * 告警接收接口
 * @returns
 */
export const listReceivers = async () => {
  const receivers = await AlertApiFactory(undefined, location.origin)
    .listReceivers()
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      setNotification('error', error);
    });
  const info = receivers.map((item: AlertReceiver & { key: string }) => {
    const { receiver_id } = item;
    return {
      ...item,
      key: receiver_id,
    };
  });
  return info;
};
export const registerReceiver = async (params: AlertReceiver) => {
  const receivers = await AlertApiFactory(undefined, location.origin)
    .registerReceiver(params)
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      setNotification('error', error);
    });

  return receivers;
};
export const deleteReceiverById = async (receiverId: string) => {
  const receivers = await AlertApiFactory(undefined, location.origin)
    .deleteReceiverById(receiverId)
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      setNotification('error', error);
    });

  return receivers;
};
export const updateReceiverById = async (receiverId: string, alertReceiver: AlertReceiver) => {
  const receivers = await AlertApiFactory(undefined, location.origin)
    .updateReceiverById(receiverId, alertReceiver)
    .then((res: { status: number; data: any }) => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    })
    .catch(error => {
      setNotification('error', error);
    });

  return receivers;
};
