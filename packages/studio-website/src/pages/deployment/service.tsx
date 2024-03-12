import { DeploymentApiFactory } from '@graphscope/studio-server';
import type { Procedure } from '@graphscope/studio-server';
import { v4 as uuidv4 } from 'uuid';

/** 获取部署列表 */
export const getDeploymentInfo = async () => {
  const message = await DeploymentApiFactory(undefined, location.origin)
    .getDeploymentInfo()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
  const Status = await DeploymentApiFactory(undefined, location.origin)
    .getDeploymentStatus()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
  console.log(message, Status);

  const info = message.map((item: Procedure) => {
    return {
      ...item,
      key: uuidv4(),
    };
  });
  return message;
};
/** 获取部署状态 */
export const getDeploymentStatus = async () => {
  const message = await DeploymentApiFactory(undefined, location.origin)
    .getDeploymentStatus()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
  // const info = message.map((item: Procedure) => {
  //   return {
  //     ...item,
  //     key: '',
  //   };
  // });
  return message;
};
/** 查看部署日志 */
export const fetchLog = async (component: string, podName: string, containerName: string, sinceSeconds: number) => {
  const message = await DeploymentApiFactory(undefined, location.origin)
    .fetchLog(component, podName, containerName, sinceSeconds)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
  const info = message.map((item: Procedure) => {
    return {
      ...item,
      key: '',
    };
  });
  return info;
};
export const getNodeStatus = async () => {
  const message = await DeploymentApiFactory(undefined, location.origin)
    .getNodeStatus()
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
      return [];
    });
  const info = message.map((item: Procedure) => {
    return {
      ...item,
      key: '',
    };
  });
  return info;
};
