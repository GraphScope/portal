import { message } from 'antd';

export function handleServerResponse(result: any) {
  // 根据实际需求进行处理
  if (result.status === 200) {
    return result.data;
  } else {
    message.error('请求失败，请稍后重试！');
    throw new Error('请求失败');
  }
}
