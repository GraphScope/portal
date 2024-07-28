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

### `Panel.json`

`panel.json` 的实现没有共性，这个使用数学归纳法，并且根据下面的具体情况进行讨论（每个个例都可以在 `case.ts` 中找到）

`panel.json` 的设计考虑到用户群体是不了解 `cyoher` 语言的人，所以所有的交互都基于自然语言的对话实现。

- case1

  ```sql
  MATCH (keanu:Person {name:'Keanu Reeves'})
  RETURN keanu.name AS name, keanu.born AS born
  ```

  下面是对于返回值 `RETURN`的设计：

  Q：请在左侧点击选中你想要返回的节点或者路径（ `Enter` 跳过）

  A：用户可以直接从左侧点击相关节点选择想要的返回值

  Q：那你想了解他的什么呢？（ `input` 框输入实现）

  A： name

  Q：需要起什么别名吗？（ `input` 框输入实现）

  A：name

  Q：还要其他的想要的吗？请在左侧点击选中你想要返回的节点或者路径 （ `Enter` 跳过）

- case2
  ```sql
  MATCH (people:Person)
  RETURN people
  LIMIT 5
  ```
  下面是对 `LIMIT` 的设计：
  Q：对于返回值有什么数量限制吗？
  A：输入数字
- case3
  ```sql
  MATCH (bornInEighties:Person)
  WHERE bornInEighties.born >= 1980 AND bornInEighties.born < 1990
  RETURN bornInEighties.name as name, bornInEighties.born as born
  ORDER BY born DESC
  ```
  下面是对 `ORDER BY` 的设计：
  Q：你想根据那个返回值进行排序？请在左侧点击选中你想要返回的节点或者路径（高亮 `RETURN` 选中过的所有节点。）
  A：点击选中想要返回的节点
  Q：你想根据他的什么属性排序 （ `input` 框输入）
  A：born
  Q：选择升序还是降序？（两个按钮）
  A：点击选择
  下面是对 `WHERE` 的设计：
  Q：你想根据什么哪一个节点进行筛查，请在左侧点击选中你想要返回的节点或者路径 （ `enter` 跳过）
  A：点击选中
  Q：你想根据当前节点的那个属性（property）进行筛选，请以等式或者不等式的形式输入 （ `input` 框输入）
  A：born ≥ 1980
- case4

  ```sql
  MATCH (m:Movie {title: 'The Matrix'})<-[d:DIRECTED]-(p:Person)
  RETURN p.name as director
  ```

- case5
  ```sql
  MATCH (tom:Person {name:'Tom Hanks'})-[r]->(m:Movie)
  RETURN type(r) AS type, m.title AS movie
  ```
  对应 `RETURN` 的属性添加是否使用函数
  Q：是否使用函数解析选中节点或者边界（提供一个 `select` 框，展示所有提供的可以使用的函数）
  A：点击选择
- case6

  ```sql
  MATCH (:Person {name:'Tom Hanks'})-[r:!ACTED_IN]->(m:Movie)
  Return type(r) AS type, m.title AS movies
  ```

- case7
  ```sql
  MATCH (p:Person {name:'Tom Hanks'})--{2}(colleagues:Person)
  RETURN DISTINCT colleagues.name AS name, colleagues.born AS bornIn
  ORDER BY bornIn, name
  LIMIT 5
  ```
- case8

  ```sql
  MATCH (p:Person {name:'Tom Hanks'})--{1,4}(colleagues:Person)
  RETURN DISTINCT colleagues.name AS name, colleagues.born AS bornIn
  ORDER BY bornIn, name
  LIMIT 5
  ```

- case9
  ```sql
  MATCH p=shortestPath(
  (:Person {name:"Keanu Reeves"})-[*]-(:Person {name:"Tom Hanks"})
  )
  RETURN p
  ```
  上面三种情况比较特使，而且我认为对于 `cypher` 查询初学者的使用难度较大，可以作为 `plugin` 功能贴在侧边栏
  1. 对于查询跳后的节点，点击侧边栏按钮，进行新的对话

     Q：请选择开始节点

     A：点击选择

     Q：是跳出还是跳入（按钮呈现）

     A：点击选择

     Q：请选择跳跃步数范围（输入框呈现）

     A：输入一个范围

     Q：（高亮选中范围可以涉及的所有节点）请在左侧点击选中你想要返回的节点。

     A：点击选择

  2. 查询两点直接最短路径，可以点击侧边栏按钮，进行新的对话

     Q：请选择开始节点

     A：点击选择

     Q：请选择结束节点

     A：点击选择

     Q：想选择这两点之间最长还是最短路径？

     A：点击选择
- case10
  ```sql
  MATCH (:Person {name: 'Keanu Reeves'})-[:ACTED_IN]->(:Movie)<-[:ACTED_IN]-(coActor:Person),
  (coActor) - [: ACTED_IN] -> (: Movie)<-[: ACTED_IN] - (:Person { name: 'Tom Hanks' })
  RETURN DISTINCT coActor.name AS coActor
  ```
