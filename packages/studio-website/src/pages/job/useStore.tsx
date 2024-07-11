import React from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
interface JobOption {
  value: string;
  text: string;
}
type TaskStatus = 'RUNNING' | 'CANCELLED' | 'SUCCESS' | 'FAILED' | 'WAITING';
const statusColorMap: Record<TaskStatus, string> = {
  RUNNING: 'blue',
  CANCELLED: 'grey',
  SUCCESS: 'green',
  FAILED: 'red',
  WAITING: 'orange',
};
/** 定义状态选项 */
const STATUSOPTIONS: JobOption[] = [
  { value: '', text: 'All' },
  { value: 'RUNNING', text: 'Running' },
  { value: 'CANCELLED', text: 'Cancelled' },
  { value: 'FAILED', text: 'Failed' },
  { value: 'SUCCESS', text: 'Succeed' },
  { value: 'WAITING', text: 'Waiting' },
];

export default function useStore() {
  /** job状态显示图标 */
  const JOB_TYPE_ICONS: Record<string, JSX.Element> = {
    RUNNING: <SyncOutlined spin />,
    CANCELLED: <MinusCircleOutlined />,
    SUCCESS: <CheckCircleOutlined />,
    FAILED: <CloseCircleOutlined />,
    WAITING: <ExclamationCircleOutlined />,
  };
  const getStatusColor = (status: TaskStatus): string => {
    return statusColorMap[status];
  };

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return {
    STATUSOPTIONS,
    JOB_TYPE_ICONS,
    getStatusColor,
    capitalizeFirstLetter,
  };
}
