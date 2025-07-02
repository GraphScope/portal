# NotebookList

帮我在 `neug-ui/src/components` 中新建一个文件夹来实现这个 UI 组件，注意

组件样式：

- css使用`taildwind@4`，要考虑主题色，可用通用的主题变量，尽量做到和图片中的样式还原
- 如需要`shadcn/ui`组件，可使用 `shadcn@latest add {component}` 安装

组件交互

- 可通过右上角的 + 号添加一个 `Untitiled Notebook`
- Hover 每个notebook，会有浅灰色阴影，同时在最右端出现一个 EllipsisVertical ICON
- Hover EllipsisVertical ICON 可展示 Dropmenu：`delete notebook`

组件实现：

- 使用 React + Typescript 实现，类型定义要清晰，要有必要的代码注释
- 模块代码不要过长，过长时考虑组件拆分，要代码清晰，便于维护

组件文档

- 请务必新建index.stories.tsx 用来 storybook 的组件测试和展示
- 至少需要三个故事：Default / DarkMode / Interactive

# QueryCell

帮我在 `neug-ui/src/components` 中新建一个文件夹来实现这个 UI 组件，注意

组件样式：

- css使用`taildwind@4`，要考虑主题色，可用通用的主题变量，尽量做到和图片中的样式还原
- 如需要`shadcn/ui`组件，可使用 `shadcn@latest add {component}` 安装

组件交互

- 默认情况下，QueryCell 是一个 Header + CodeEditor 组合
- Header 区域，左边是运行ICON，右边是一个下拉选择框，默认是当前选择的数据库，CodeEditor 区域是一个 Cypher 代码编辑器
- 当 Hover QueryCell的时候，会在左侧出现一个可拖拽的ICON 和 可折叠的ICON，表达该Cell可以拖拽也可以被折叠，右侧会出现两个icon，一个是全屏放大，一个是更多操作（比如dropmenu后出现delete notebook）
- 当键入QueryCell的CodeEditor区域，整个QueryCell会出现一个主题色边框（蓝色）

组件实现：

- 使用 React + Typescript 实现，类型定义要清晰，要有必要的代码注释
- 模块代码不要过长，过长时考虑组件拆分，要代码清晰，便于维护

组件文档

- 请务必新建index.stories.tsx 用来 storybook 的组件测试和展示
- 至少需要三个故事：Default / DarkMode / Interactive
