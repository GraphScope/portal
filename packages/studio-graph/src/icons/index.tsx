//see: https://www.iconfont.cn/

const builtinIconFontId = 'font_4775957_de91ktmrghn';
import { loadFontJson, loadUnicodeFont } from './loader';

export let icons: Record<string, string> = {};
export const registerIcons = async (id: string = builtinIconFontId) => {
  const { glyphs } = await loadFontJson(id);
  await loadUnicodeFont(builtinIconFontId);
  icons = glyphs.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.name]: String.fromCodePoint(curr.unicode_decimal),
    };
  }, {});
  return icons;
};
