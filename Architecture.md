
## 项目架构

Monorepo 架构，并使用 Turbo 和 Father 作为前端构建工具，将多个相关的子包集中在一个仓库中进行管理。

### 前端构建工具
- Turbo：用于管理和执行多个包的构建任务，通过并行构建和缓存优化构建效率。
- Father：基于 Webpack 的构建工具，主要用于 React 和 TypeScript 项目的快速开发和构建。

## 数据流与组件库

1. 数据建模：用户可以通过手动创建节点类型和边类型来构建图模型，或者通过解析 CSV、JSON 等数据文件自动生成图模型。

2. 数据导入：用户可以绑定数据文件到已定义的顶点和边模型中，支持单个或批量导入。对于 CSV 文件，提供本地上传和字段映射解析功能。

3. 查询与可视化：在数据准备好后，用户可以在Query模块中编写和执行查询语句，支持多种查询方法和丰富的可视化展示。

## 组件库
- Ant Design：作为主要的 UI 组件库，提供了丰富的 UI 组件和样式配置选项。
- React Flow：用于图形界面中的图形编辑和监听图形变化。
- Custom Components：根据项目需求自定义的一些组件，如 studio-components包下StudioProvider、StoreProvider 等。

## 主题管理与国际化  
- 主题管理：通过 StudioProvider 实现主题管理，支持亮/暗模式切换和自定义 Token。
- 国际化：使用 react-intl 实现中英语言切换，支持 Ant Design 组件库的国际化配置。
全局状态管理

## 数据存储
- StoreProvider：全局存储不同 Context ID 的 Store
- Immer 集成：简化复杂状态操作，支持不可变更新。
- 调试支持：将全局 Store 挂载到 window 对象方便调试。
- 动态路由配置(website)：
  1. index.tsx：根据条件动态注册路由配置
  2. pages/index.tsx：主路由定义。
  3. @graphscope/graphy-website：子模块路由。

## 子模块介绍
### studio-importor
- 功能：监听图形界面中的图形变化，最终数据存储在 @graphscope/use-zustand 包的 StoreProvider 中。
## @graphscope/studio-server
- 功能：封装定义好的 API 接口，为前端提供数据交互能力。
## studio-query
- 功能：query 页面的重要组件，支持多种查询方法和丰富的可视化展示。
