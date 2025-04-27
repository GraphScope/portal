/**
 * Icons 组件库
 * 提供了一系列用于界面展示的图标组件
 */

import { theme } from 'antd';

/**
 * 图标组件通用属性接口
 */
export interface IconProps {
  /** 自定义样式，包含 fontSize 和 color */
  style?: React.CSSProperties & {
    /** 文本内容（仅用于特定图标） */
    text?: string;
  };
}

// 文件操作相关图标
export { default as File } from './File';
export { default as FileExport } from './FileExport';
export { default as FileYaml } from './FileYaml';

// 图形操作相关图标
export { default as Graph2D } from './Graph2D';
export { default as Graph3D } from './Graph3D';
export { default as ZoomFit } from './ZoomFit';
export { default as Cluster } from './Cluster';
export { default as Lasso } from './Lasso';
export { default as Arrow } from './Arrow';

// 节点操作相关图标
export { default as AddNode } from './AddNode';
export { default as PrimaryKey } from './primary-key';
export { default as Punctuation } from './Punctuation';

// 界面控制相关图标
export { default as Sidebar } from './Sidebar';
export { default as Explorer } from './Explorer';
export { default as Lock } from './Lock';
export { default as Unlock } from './Unlock';

// 数据相关图标
export { default as Database } from './Database';
export { default as Qps } from './Qps';
export { default as Model } from './Model';
export { default as Trash } from './Trash';
