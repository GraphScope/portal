import React from 'react';
import dayjs from 'dayjs';
import { Flex, Typography } from 'antd';
import type { IJobType } from '../service';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
interface JobOption {
  value: string;
  label: React.ReactNode;
}
type TaskStatus = 'RUNNING' | 'CANCELLED' | 'SUCCESS' | 'FAILED' | 'WAITING';
const statusColorMap: Record<TaskStatus, string> = {
  RUNNING: '#1677ff',
  CANCELLED: '#000000e0',
  SUCCESS: '#52c41a',
  FAILED: '#ff4d4f',
  WAITING: '#faad14',
};
const statusColor: Record<TaskStatus, string> = {
  RUNNING: 'processing',
  CANCELLED: 'default',
  SUCCESS: 'success',
  FAILED: 'error',
  WAITING: 'warning',
};
const getStatusColor = (status: string): string => {
  return statusColorMap[status];
};
/** 定义状态选项 */
export const STATUSOPTIONS: JobOption[] = [
  {
    value: 'RUNNING',
    label: (
      <Flex align="center" gap={3}>
        <Typography.Text
          style={{ width: '12px', height: '12px', backgroundColor: getStatusColor('RUNNING'), borderRadius: '50%' }}
        ></Typography.Text>
        <Typography.Text>Running</Typography.Text>
      </Flex>
    ),
  },
  {
    value: 'CANCELLED',
    label: (
      <Flex align="center" gap={3}>
        <Typography.Text
          style={{ width: '12px', height: '12px', backgroundColor: getStatusColor('CANCELLED'), borderRadius: '50%' }}
        ></Typography.Text>
        <Typography.Text>Cancelled</Typography.Text>
      </Flex>
    ),
  },
  {
    value: 'FAILED',
    label: (
      <Flex align="center" gap={3}>
        <Typography.Text
          style={{ width: '12px', height: '12px', backgroundColor: getStatusColor('FAILED'), borderRadius: '50%' }}
        ></Typography.Text>
        <Typography.Text>Failed</Typography.Text>
      </Flex>
    ),
  },
  {
    value: 'SUCCESS',
    label: (
      <Flex align="center" gap={3}>
        <Typography.Text
          style={{ width: '12px', height: '12px', backgroundColor: getStatusColor('SUCCESS'), borderRadius: '50%' }}
        ></Typography.Text>
        <Typography.Text>Succeed</Typography.Text>
      </Flex>
    ),
  },
  {
    value: 'WAITING',
    label: (
      <Flex align="center" gap={3}>
        <Typography.Text
          style={{ width: '12px', height: '12px', backgroundColor: getStatusColor('WAITING'), borderRadius: '50%' }}
        ></Typography.Text>
        <Typography.Text>Waiting</Typography.Text>
      </Flex>
    ),
  },
];
// 筛选逻辑
const map = new Map<string, any>();
const handleChange = (selectedItems: string[], filterType: string, rawJobsList) => {
  // Update or remove the filter criteria in the map
  if (selectedItems && selectedItems.length > 0) {
    map.set(filterType, selectedItems);
  } else {
    map.delete(filterType);
  }

  // Define the filter functions for each filter type
  const filterFunctions: Record<string, (item: IJobType) => boolean> = {
    search: item => {
      const searchItems = map.get('search');
      return searchItems ? searchItems.includes(item.id) : true;
    },
    picker: item => {
      const pickerRange = map.get('picker');
      return pickerRange
        ? dayjs(pickerRange[0]).isBefore(dayjs(item.end_time, 'YYYY-MM-DD')) &&
            dayjs(item.end_time, 'YYYY-MM-DD').isBefore(dayjs(pickerRange[1]))
        : true;
    },
    type: item => {
      const typeItems = map.get('type');
      return typeItems ? typeItems.includes(item.type) : true;
    },
    status: item => {
      const statusItems = map.get('status');
      return statusItems ? statusItems.includes(item.status) : true;
    },
  };

  // Start with the unfiltered job list
  let filteredData = rawJobsList; // Assume rawJobsList is your initial unfiltered job list

  // Apply all active filter conditions
  filteredData = filteredData.filter(
    item =>
      filterFunctions.search(item) &&
      filterFunctions.picker(item) &&
      filterFunctions.type(item) &&
      filterFunctions.status(item),
  );

  // Update the map with the new filtered data
  map.set('data', filteredData);
  // Update the component's state with the filtered list
  return filteredData;
};

export default function useStore() {
  /** job状态显示图标 */
  const JOB_TYPE_ICONS: Record<string, JSX.Element> = {
    RUNNING: <SyncOutlined spin />,
    CANCELLED: <MinusCircleOutlined />,
    SUCCESS: <CheckCircleOutlined />,
    FAILED: <CloseCircleOutlined />,
    WAITING: <ExclamationCircleOutlined />,
  };

  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return {
    STATUSOPTIONS,
    JOB_TYPE_ICONS,
    getStatusColor,
    capitalizeFirstLetter,
    timeAgo,
    formatDateTime,
    handleChange,
    statusColor,
  };
}

// 时间格式化函数
const timeAgo = (date: Date): string => {
  const now = new Date().getTime();
  const secondsPast = Math.floor((now - date.getTime()) / 1000);

  if (secondsPast < 60) return `${secondsPast} second${secondsPast > 1 ? 's' : ''} ago`;
  if (secondsPast < 3600) return `${Math.floor(secondsPast / 60)} minute${secondsPast >= 120 ? 's' : ''} ago`;
  if (secondsPast < 86400) return `${Math.floor(secondsPast / 3600)} hour${secondsPast >= 7200 ? 's' : ''} ago`;
  if (secondsPast < 2592000) return `${Math.floor(secondsPast / 86400)} day${secondsPast >= 2 ? 's' : ''} ago`;
  if (secondsPast < 31536000) return `${Math.floor(secondsPast / 2592000)} month${secondsPast >= 2 ? 's' : ''} ago`;
  return `${Math.floor(secondsPast / 31536000)} year${secondsPast >= 2 ? 's' : ''} ago`;
};

// 日期时间格式化函数
const formatDateTime = (date: dayjs.Dayjs, locale = 'en'): string => {
  const now = dayjs();
  dayjs.locale(locale);

  if (date.isSame(now, 'day')) return `Today at ${date.format('h:mm A')}`;
  if (date.isSame(now.subtract(1, 'day'), 'day')) return `Yesterday at ${date.format('h:mm A')}`;
  if (date.isSame(now.add(1, 'day'), 'day')) return `Tomorrow at ${date.format('h:mm A')}`;
  if (date.isBefore(now, 'year')) return date.format('MMM D, YYYY [at] h:mm A');
  return date.format('MMM D [at] h:mm A');
};
