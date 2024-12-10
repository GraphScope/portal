//see: https://www.iconfont.cn/

const builtinIconFontId = 'font_4775957_de91ktmrghn';
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
