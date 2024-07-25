import { LoadCSV, ContextMenu, PropertiesPanel, BasicContainer, SwitchEngine, Canvas } from '../components';

export interface AtomSpec {
  /** 原子组件唯一ID */
  id: string;
  /** 运行时参数 */
  props: any;
  /** 元信息 */
  meta?: {
    /** 排序 */
    order?: number;
    /** 分组 */
    group?: string;
    /** 标题 */
    title?: string;
    /** 描述 */
    description?: string;
    /** 图标 */
    icon?: string;
  };
  /** 服务ID */
  serviceId?: string[];
}
export interface ContainerSpec {
  id: string;
  props: any;
  children: AtomSpec[];
}
export interface Spec {
  container: ContainerSpec;
  contextmenu: ContainerSpec;
  toolbar: ContainerSpec;
  atoms: AtomSpec[];
}
export const spec: Spec = {
  container: {
    id: 'BasicContainer',
    props: {
      displayIcon: true,
    },
    children: [
      {
        id: 'LoadCSV',
        props: {},
        meta: {
          order: 1,
          group: 'xxxxx',
          icon: 'file-json',
        },
      },
      {
        id: 'PropertiesPanel',
        props: PropertiesPanel.defaultProps,
        serviceId: ['/api/query/property'],
        meta: {
          order: 2,
          icon: 'icon-info',
        },
      },
    ],
  },
  contextmenu: {
    id: 'ContextMenu',
    props: {},
    children: [
      {
        id: 'ClearNode',
        props: {},
      },
    ],
  },
  toolbar: {
    id: 'Toolbar',
    props: {},
    children: [
      {
        id: 'SwitchEngine',
        props: {},
      },
    ],
  },
  atoms: [
    {
      id: 'SwitchEngine',
      props: {},
    },
  ],
};

export const assets = {
  ContextMenu,
  PropertiesPanel,
  BasicContainer,
  LoadCSV,
  SwitchEngine,
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
  id: 'Canvas',
  props: {},
  render: Canvas,
};
export const defaultContainer = {
  id: 'BasicContainer',
  props: {
    items: [],
  },
  render: BasicContainer,
};
