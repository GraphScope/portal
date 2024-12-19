import { message } from 'antd';
export function handleResponse(result: any) {
  // 根据实际需求进行处理
  if (result.status === 200) {
    return result.data;
  } else {
    throw new Error('请求失败');
  }
}
export function handleError(error: any, defaultReturn?: any) {
  message.error(error.message);
  console.error(error);
  return defaultReturn;
}
