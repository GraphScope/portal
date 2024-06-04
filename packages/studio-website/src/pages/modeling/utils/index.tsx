export const getUrlParams = () => {
  let urlStr = window.location.href;
  return Object.fromEntries(new URLSearchParams(urlStr.split('?')[1]).entries());
};
