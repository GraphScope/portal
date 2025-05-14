目前 (Statement) 是固定垂直排列的、可以通过 React DnD 来实现拖拽排序；
添加全屏功能 （状态，按钮）
增删改查目前都有，可以优化
将 QueryCell (Statement) 组件重构为独立的模块
根据对 dnd-kit 的研究，实现一个 QueryCell 组件，添加展开、收起、排序和移动功能

header中搜索时添加一个statement不变、在app/content/index.tsx中添加dnd排序；
在statement中添加展开收起、全屏、在表格中添加复制粘贴导出等功能；
删除默认的 script 语句
只在查询后显示 Result 内容
改进全屏模式，让全屏按钮始终可见
全屏模式只显示当前 QueryCell