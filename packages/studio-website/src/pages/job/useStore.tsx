import React from 'react';
import dayjs from 'dayjs';
import type { IJobType } from './service';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
interface JobOption {
  value: string;
  label: string;
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
export const STATUSOPTIONS: JobOption[] = [
  { value: 'RUNNING', label: 'Running' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'SUCCESS', label: 'Succeed' },
  { value: 'WAITING', label: 'Waiting' },
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
  const getStatusColor = (status: string): string => {
    return statusColorMap[status];
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
  };
}

const timeAgo = date => {
  const now: any = new Date();
  const secondsPast = Math.floor((now - date) / 1000);

  if (secondsPast < 60) {
    return `${secondsPast} second ago`;
  }
  if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} min ago`;
  }
  if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} hour ago`;
  }
  if (secondsPast < 2592000) {
    const days = Math.floor(secondsPast / 86400);
    return `${days} day ago`;
  }
  if (secondsPast < 31536000) {
    const months = Math.floor(secondsPast / 2592000);
    return `${months} month ago`;
  }
  const years = Math.floor(secondsPast / 31536000);
  return `${years} year ago`;
};

const formatDateTime = date => {
  const now = dayjs();
  if (date.isSame(now, 'day')) {
    return date.format('Today at h:mm A');
  } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return `Yesterday at ${date.format('h:mm A')}`;
  } else {
    return date.format('MMM D [at] h:mm A');
  }
};
const map = new Map();
const handleChange = (selectedItems: string[], filterType: string, rawJobsList) => {
  // Update or remove the filter criteria in the map
  if (selectedItems.length > 0) {
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
