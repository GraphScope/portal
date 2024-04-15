import { notification as notifications } from 'antd';

export const getSearchParams = (location: Location) => {
  const { hash } = location;
  const [path, search] = hash.split('?');
  const searchParams = new URLSearchParams(search);
  return {
    path,
    searchParams,
  };
};

export const notification = (type: string, data: any) => {
  if (type === 'success') {
    notifications.success({ message: `${data}` });
  }
  if (type === 'error') {
    const { response } = data;
    const body = response.data.split('response body:')[1];
    notifications.error({ message: `${body}` });
  }
};
