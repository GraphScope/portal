# 📊 @graphscope/studio-draw-pattern

[![NPM version](https://img.shields.io/npm/v/studio-draw-pattern.svg?style=flat)](https://npmjs.com/package/studio-draw-pattern)
[![NPM downloads](http://img.shields.io/npm/dm/studio-draw-pattern.svg?style=flat)](https://npmjs.com/package/studio-draw-pattern)

## 🛠 工具开发

```bash
$ git clone https://github.com/BQXBQX/studio-draw-pattern.git
$ pnpm install
```

```bash
$ npm run dev
$ npm run build
```

## 🦴 项目架构

主要开发集中在 src 文件夹内

```bash
.
├── README.md
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── components   # 相关组件,计划封装为<DrawPattern />组件
│   ├── hooks        # 相关的React Hook, 计划最后封装两个Hook, useGenerate&useDeconstruct,
│   ├── index.ts     # 项目入口
│   ├── stores       # 项目的状态管理,使用valtio进行封装
│   ├── types        # 项目的所有类型
│   │   ├── edge.d.ts
│   │   ├── node.d.ts
│   │   ├── property.d.ts
│   │   └── variable.d.ts
│   └── utils        # 相关工具函数
└── tsconfig.json
```

## 🛠 API

## 🌞 TODO

- [ ] Cypher 语句适配
- [ ] Cypher Node 正则匹配
- [ ] Cypher Edge 正则匹配
- [ ] Cypher MATCH 语句正则匹配
- [ ] Cypher Node 字符串拼接
- [ ] Cypher Edge 字符串拼接
- [ ] Cypher MATCH 字符串拼接

## 😊 交互设计

### `Model.json`

我认为 `Model.json`是 `MATCH` 语句的重要组成部分，也是这个项目最基础的部分，我需要做的就是根据传入的 Model.json 去生成相应的 `MATCH`语句。我将具体的实现分为三个部分实现。

具体的思想是先更具每一个节点和路径生成对应的节点 `Cypher` 语言和路径 `Cypher` 语言，然后根据每个节点的关系将对应的节点连接聚合起来形成一条语句。

- 节点
- 路径
- 聚合：我认为在一条 `MATCH` 中 `edge` 是整条 `MATCH` 中最重要的部分，所以我会从 `edge` 开始遍历，同时保证每一条 `edge` 语句都被遍历，使用深度优先遍历的思想和递归实现每一条语句。

具体实现，在 `utils` 文件夹的 `cypher/encode` 里面建立文件 `encodeNode` , `encodeEdge` `encodeVariable` , `encodeProperty` , `encodeLabel` 这些文件分别解析 `Node` 和 `Edge` 和内部的相关属性。再建立一个 `generateMATCH` 实现通过关系生成 `MATCH` 语句。
