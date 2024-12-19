# 交互设计

## Quick Start

为了更好的交互,会提供用户一个 Quick Start , Qucik Start 里面提供一系列的模式匹配, 三角环, 多跳, 两点之间最短距离, 两点关系 ... 提供用户使用体验.

## `Model.json`

我认为 `Model.json`是 `MATCH` 语句的重要组成部分，也是这个项目最基础的部分，我需要做的就是根据传入的 Model.json 去生成相应的 `MATCH`语句。我将具体的实现分为三个部分实现。

具体的思想是先更具每一个节点和路径生成对应的节点 `Cypher` 语言和路径 `Cypher` 语言，然后根据每个节点的关系将对应的节点连接聚合起来形成一条语句。

- 节点
- 路径
- 聚合：我认为在一条 `MATCH` 中 `edge` 是整条 `MATCH` 中最重要的部分，所以我会从 `edge` 开始遍历，同时保证每一条 `edge` 语句都被遍历，使用深度优先遍历的思想和递归实现每一条语句。

具体实现，在 `utils` 文件夹的 `cypher/encode` 里面建立文件 `encodeNode` , `encodeEdge` `encodeVariable` , `encodeProperty` , `encodeLabel` 这些文件分别解析 `Node` 和 `Edge` 和内部的相关属性。再建立一个 `generateMATCH` 实现通过关系生成 `MATCH` 语句。

## `Panel.json`

`panel.json` 的设计考虑到用户群体是不了解 `cyoher` 语言的人，所以这个模块最重要的是易用性，而不是功能的强大，计划所有的交互现在计划是都基于表单的形式呈现，后期将接入 `ChatGPT`，实现更容易的交互操作。

## 下面是我的 `Figma` 设计稿链接

https://www.figma.com/design/XFJ3eTssOzimdk52b8Kw39/draw-pattern?node-id=0-1&t=o3ahDgl6wSdvJSrN-1
