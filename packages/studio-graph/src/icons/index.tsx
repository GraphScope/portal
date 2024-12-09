//see: https://www.iconfont.cn/

const builtinIconFontId = 'font_4633296_9exxn3p3tzj';
import { loadFontJson, loadUnicodeFont } from './loader';

export let icons: Record<string, string> = {};
export const registerIcons = async () => {
  const { glyphs } = await loadFontJson(builtinIconFontId);
  await loadUnicodeFont(builtinIconFontId);
  icons = glyphs.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.name]: String.fromCodePoint(curr.unicode_decimal),
    };
  }, {});
};
