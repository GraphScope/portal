# 贡献指南 Contribution Guide

欢迎来到我们的开源社区！本指南将帮助您快速了解如何参与贡献。

## 快速导航
- [📋 开始之前](#开始之前)
- [🐛 报告问题](#报告问题)
- [✨ 提交新功能](#提交新功能)
- [🤝 社区准则](#社区准则)
- [📜 许可协议](#社区准则)
---
## 开始之前
### 阅读项目文档：
- [使用指南](./README.md)
- [安全策略](./SECURITY.md)
- [版本发布](./PUBLISH.md)
### 开发环境搭建  
前置要求
| dependence | Version |
| ---------- | ------- |
| node       | >=16.x    |
| pnpm       | >=7.x     |
| react      | >=17.x    |
| umi        | >=3.x     |
| father     | >=4.x     |
| webpack    | >=5.x     |
快速启动  
```bash
git clone https://github.com/GraphScope/portal.git
cd portal
```
# 安装依赖
```bash
    pnpm install

    pnpm run build # 构建所有子包 只需一次

    docker pull registry.cn-hongkong.aliyuncs.com/graphscope/interactive:latest 
```

# 启动开发环境
```bash
    docker run -d --name gs -p 8080:8080 -p 7777:7777 -p 10000:10000 -p 7687:7687 registry.cn-hongkong.aliyuncs.com/graphscope/interactive --enable-coordinator --port-mapping "8080:8080,7777:7777,10000:10000,7687:7687" # 之后只需 docker start gs

    pnpm run start

    cd examples && pnpm run start

    cd packages/studio-website 

    echo "COORDINATOR_URL= http://127.0.0.1:8080" >> .env # 只需一次 配置环境变量
    
    pnpm run start
```
## 报告问题

### 问题描述
<!-- 清晰描述观察到的异常现象 -->
✅ 正确示例：  
"在数据建模页面连续添加超过10个顶点类型后，右侧属性面板出现布局错位"
### 重现步骤
1. 访问页面：`/modeling`
2. 操作步骤：
   ```bash
   # 需要提前执行的命令（如果有）
   docker exec -it gs ./bin/gs_interactive localhost:8080
   ```
3. 触发问题的具体操作：
   - 点击"添加节点"按钮10次
   - 滚动至面板底部

### 预期 vs 实际
| 预期行为 | 实际行为 |
|---------|----------|
| 属性面板应保持固定宽度 | 面板宽度随内容无限扩展 |

### 环境信息
- 相关依赖包的版本信息  
- 报错日志
- 浏览器信息
#### 附加信息
```typescript
// 相关代码片段（如有）
interface VertexType {
  id: string;
  properties: Record; // 问题发生时该对象结构
}
```
📎 附件要求：
- [ ] 浏览器控制台错误截图（F12 > Console）
- [ ] 网络请求异常截图（F12 > Network）
- [ ] Docker日志片段（`docker logs gs --tail 100`）

## 提交新功能
### 功能名称
[需包含GraphScope组件标识]    

例：`Interactive引擎-可视化查询构建器`
### 背景
#### 用户需求
- 目标用户：数据分析师/图数据库管理员
- 使用场景：在无Cypher知识情况下通过拖拽构建查询

#### 技术痛点
- 当前`/query`模块仅支持代码编辑器模式
- 缺乏可视化元素与Cypher语句的映射关系

### 设计方案
#### 前端实现
```typescript
// 核心组件结构建议
interface QueryBuilderProps {
  schema: GraphSchema; // 来自@antv/graphin的类型定义
  onCypherGenerate: (cypher: string) => void;
}

// 需新增的依赖
"@antv/g6": "^5.0.2", // 可视化引擎
"react-flow-renderer": "^11.7.0" // 拖拽组件
```
#### 后端实现
```
# 需要扩展的Interactive API端点
POST /interactive/v1/cypher/validate  # 新增查询验证接口
```
#### 数据流向
graph TD
  A[可视化面板] -->|生成AST| B(Transformer服务)
  B -->|输出Cypher| C[Interactive引擎]
  C -->|返回执行计划| A
#### 开发实施规范
1. **分支管理**
```bash
   # 从最新main分支创建
   git checkout -b feat/interactive-query-builder
   git push -u origin feat/interactive-query-builder
```
2. **提交消息规范**
```bash
   # 类型需对应功能模块
    feat(interactive): add query builder UI components
    fix(portal): resolve node dragging boundary issue
    docs(query): update cypher generation guidelines
```
3. **PR创建检查清单**
- [ ] 已关联Issue #123
- [ ] 通过所有CI检查（包括Docker构建）
- [ ] 文档更新已完成（至少包含API文档）
- [ ] 无冲突存在

##  社区准则

### 沟通渠道

- 技术讨论：GitHub Discussions

### 行为规范
1. 遵守[CNCF行为准则](https://github.com/cncf/foundation/blob/main/code-of-conduct.md)
2. 禁止提交恶意代码
3. 尊重所有贡献者

## 许可协议

所有贡献默认遵循[Apache 2.0许可证](./LICENSE)，提交即表示您同意授权代码给项目。