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
