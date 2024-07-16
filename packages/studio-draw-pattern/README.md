# 📊 Generate_Query

双向解析图数据库查询语言工具库

## 🍜 食用方法

```sh
# 将仓库克隆到本地
git clone git@github.com:BQXBQX/Generate_Query.git

# 确保电脑上装有Bun
bun -v

# 如果没有请安装bun
npm install -g bun

# 进入项目文件夹并且安装依赖
cd Generate_Query
bun install

# 将脚本link到项目中
bun link
bun link generate_query

# 测试用例： 根据语言生成GPE JSON
bun x generate_query deconstruct --cypher  "MATCH (:Person:Director:Woman:Mather {name: 'Anna',age:34,sex:'woman'})-[:KNOWS]->(:Person)-[:FATHER]->(:Person)" ./examples/test.json

# 测试用例： 根据GPE JSON 生成语言
bun x generate_query generate --cypher ./examples/test.json
```

⚠️ Warning 目前实现了cypher MATCH语句的双向转换
