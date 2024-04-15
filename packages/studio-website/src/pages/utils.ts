import { notification as notifications } from 'antd';
import { createTheme } from '@uiw/codemirror-themes';
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

export const updateTheme = (mode: string, isEdit: boolean) => {
  //@ts-ignore
  return createTheme({
    theme: mode === 'defaultAlgorithm' ? 'light' : 'dark',
    settings: {
      background: isEdit ? '#F5F5F5' : mode === 'defaultAlgorithm' ? '#fff' : '#151515',
      backgroundImage: '',
      foreground: mode === 'defaultAlgorithm' ? '#212121' : '#FFF',
      gutterBackground: isEdit ? '#F5F5F5' : mode === 'defaultAlgorithm' ? '#fff' : '#151515',
    },
  });
};
