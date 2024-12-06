---
order: 2
title: <GraphProvider />
---

## GraphProvider

`<GraphProvider />` 是一个全局数据的提供者，源码在[这里](https://github.com/GraphScope/portal/blob/main/packages/studio-graph/src/hooks/useContext.tsx#L101)，在其内部的组件，即可通过 `useContext`获得全局数据

| props    | desc                                    | default          |
| -------- | --------------------------------------- | ---------------- |
| id       | 多实例管理需要的唯一表示                | 默认是uuid生成的 |
| services | 注册的数据服务，可以通过getServices获得 | {}               |

## useContext

通过 `<GraphProvider />` 包裹的组件，在内部可以通过 `useContext` 获得全局数据，这也是有且仅有这一个API
