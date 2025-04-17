/**
 * @file index.tsx - 主入口文件
 * 该文件导出了所有组件、钩子和类型定义
 */

// 组件
export { default as EditableText } from './EditableText'; // 可编辑文本组件
export { default as EmptyCanvas } from './EmptyCanvas'; // 空白画布组件
export { default as SegmentedTabs } from './SegmentedTabs'; // 分段标签组件
export { default as TableCard } from './TableCard'; // 表格卡片组件
export { default as Toolbar } from './Toolbar'; // 工具栏组件
export { default as Logo, LogoImage, LogoText } from './Logo'; // Logo 组件
export { default as PropertiesList } from './PropertiesList'; // 属性列表组件
export { default as MappingFields } from './PropertiesList/MappingFields'; // 映射字段组件
export { default as Section } from './Section'; // 段落组件
export { default as MultipleInstance } from './MultipleInstance'; // 多实例组件
export { default as SplitSection } from './SplitSection'; // 分割段落组件
export { default as ResultConfig } from './ResultConfig'; // 结果配置组件
export { default as StudioProvider } from './Provider'; // 提供者组件
export { default as StudioProvier } from './Provider'; // 提供者组件（兼容旧版本）
export { default as ImportFiles } from './ImportFiles'; // 导入文件组件
export { default as SideTabs } from './SideTabs'; // 侧边标签组件
export { default as ResizablePanel } from './ResizablePanel'; // 可调整大小面板组件
export { default as FullScreen } from './FullScreen'; // 全屏组件
export { default as Slot } from './Slot'; // 插槽组件
export { default as TypingText } from './TypingText'; // 打字效果文本组件
export { default as CreatePortal } from './CreatePortal'; // 创建门户组件
export { default as Layout } from './layout'; // 布局组件
export { default as GlobalSpin } from './GlobalSpin'; // 全局加载中组件
export * as Utils from './Utils'; // 工具函数
export * as Icons from './Icons'; // 图标组件
export { default as Illustration } from './Illustration'; // 插图组件
export { default as CollapseCard } from './CollapseCard'; // 可折叠卡片组件
export { default as EngineFeature } from './EngineFeature'; // 引擎特性组件
export { default as HomePage } from './HomePage'; // 首页组件

// 钩子
export { useSection } from './Section/useSection'; // 段落钩子
export { useMultipleInstance } from './MultipleInstance/useMultipleInstance'; // 多实例钩子
export { useStudioProvider } from './Provider/useThemeConfigProvider'; // 提供者钩子
export { useStudioProvier } from './Provider/useThemeConfigProvider'; // 提供者钩子（兼容旧版本）
export { useCustomToken } from './Provider/useCustomToken'; // 自定义令牌钩子
export { useDynamicStyle } from './hooks/useDynamicStyle'; // 动态样式钩子
export { useHistory } from './hooks/useHistory'; // 历史记录钩子

// 类型
import type { SegmentedTabsProps } from './SegmentedTabs';
import type { Property } from './PropertiesList/typing';
import type { ParsedFile } from './Utils/parseCSV';

export type { SegmentedTabsProps, Property, ParsedFile };
