import ContextMenu from '../graph/components/ContextMenu';
import PropertiesPanel from '../graph/components/PropertiesPanel';
import BasicContainer from '../graph/components/BasicContainer';
import ImportFromJSON from './import-from-csv';
import BasicCanvas from './canvas';
export type Type = 'components' | 'menu' | 'canvas' | 'container' | 'menuitem';
export type Spec = {
  id: string;
  props: any;
  type: Type;
  serviceId?: string[];
}[];

export const spec: Spec = [
  {
    id: 'PropertiesPanel',
    type: 'components',
    props: PropertiesPanel.defaultProps,
    serviceId: ['/api/query/property'],
  },
  {
    id: 'ClearNode',
    type: 'menuitem',
    props: {},
  },
  {
    id: 'ImportFromJSON',
    type: 'components',
    props: {},
  },
  {
    id: 'ContextMenu',
    type: 'menu',
    props: {},
  },
  {
    id: 'BasicContainer',
    type: 'container',
    props: {
      // 唯一hack的地方
      items: [['ImportFromJSON', 'PropertiesPanel'], ['PropertiesPanel']],
    },
  },
];

export const assets = {
  ContextMenu,
  PropertiesPanel,
  BasicContainer,
  ImportFromJSON,
};

export const services = [
  {
    id: '/api/query/property',
    service: async () => {
      return {
        data: {
          name: 'test',
        },
      };
    },
  },
];

export const defaultCanvas = {
  id: 'BasicCanvas',
  props: {},
  render: BasicCanvas,
};
export const defaultContainer = {
  id: 'BasicContainer',
  props: {
    items: [],
  },
  render: BasicContainer,
};
