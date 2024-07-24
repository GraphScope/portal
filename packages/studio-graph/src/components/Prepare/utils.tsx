import type { ISchema, ConfigItem } from './typing';
import { useThemeContainer } from '@graphscope/studio-components';
import { Utils } from '@graphscope/studio-components';
import { colors, sizes, widths } from './const';
const { storage } = Utils;
export function getStyleConfig(schema: ISchema, graphId: string) {
  const localStyle = storage.get<ConfigItem[]>(`GRAPH_${graphId}_STYLE`);
  if (localStyle) {
    return localStyle;
  }
  const defaultStyle = {
    nodeStyle: {},
    edgeStyle: {},
  };

  schema.nodes.forEach((item, index) => {
    const { label } = item;
    defaultStyle.nodeStyle[label] = {
      label: item.label,
      size: sizes[3],
      color: colors[index],
      caption: Object.keys(item.properties || {})[0] || 'id',
    };
  });
  schema.edges.forEach((item, index) => {
    const { label } = item;
    defaultStyle.edgeStyle[label] = {
      label: item.label,

      size: widths[1],
      color: '#D9D9D9',
      caption: Object.keys(item.properties || {})[0] || '',
    };
  });

  return defaultStyle;
}
