## API Summary

| Method and URL                                                   | Explanation                                |Groot|Interactive|Analytical|
| -----------------------------------------------------------------| ------------------------------------------ | --- | --------- | ---------|
| POST /api/v1/graph                                               | (GRAPH) 新建图                             | x   |     ✓     |    ✓     |
| DELETE /api/v1/graph/{graph_name}                                | (GRAPH) 删除图                             | x   |     ✓     |    ✓     |
| GET /api/v1/graph                                                | (GRAPH) 获取图实例列表                     | ✓   |     ✓     |    ✓     |
| POST /api/v1/graph/{graph_name}/schema                           | (GRAPH) 批量导入图 schema 信息             | ✓   |     x     |    x     |
| GET /api/v1/graph/{graph_name}/schema                            | (GRAPH) 获取图 schema 信息                 | ✓   |     ✓     |    ✓     |
| POST /api/v1/graph/{graph_name}/schema/vertex                    | (GRAPH) 新增点类型                         | ✓   |     x     |    x     |
| DELETE /api/v1/graph/{graph_name}/schema/vertex/{label_name}     | (GRAPH) 删除点类型                         | ✓   |     x     |    x     |
| POST /api/v1/graph/{graph_name}/schema/edge                      | (GRAPH) 新增边类型                         | ✓   |     x     |    x     |
| DELETE /api/v1/graph/{graph_name}/schema/edge/{label_name}       | (GRAPH) 删除边类型                         | ✓   |     x     |    x     |
| GET /api/v1/graph/{graph_name}/datasource                        | (DATASOURCE) 获取数据源绑定信息            | ✓   |     ✓     |    ✓     |
| POST /api/v1/graph/{graph_name}/datasource/vertex/{label_name}   | (DATASOURCE) 绑定点类型数据源              | ✓   |     ✓     |    ✓     |
| POST /api/v1/graph/{graph_name}/datasource/edge/{label_name}     | (DATASOURCE) 绑定点类型数据源              | ✓   |     ✓     |    ✓     |
| POST /api/v1/job                                                 | (JOB) 创建任务(载图、运行算法)             | ✓   |     ✓     |    ✓     |
| GET /api/v1/job                                                  | (JOB) 获取任务信息列表                     | ✓   |     ✓     |    ✓     |
| DELETE /api/v1/job/{job_id}                                      | (JOB) 取消任务                             | ✓   |     ✓     |    ✓     |
| POST /api/v1/extension/query                                     | (EXTENSION) 新建 gremlin/cypher 语句       | ✓   |     ✓     |    x     |
| PUT /api/v1/extension/query/{query_id}                           | (EXTENSION) 修改查询语句信息               | ✓   |     ✓     |    x     |
| GET /api/v1/extension/query                                      | (EXTENSION) 获取查询语句列表               | ✓   |     ✓     |    x     |
| DELETE /api/v1/extension/query/{query_id}                        | (EXTENSION) 删除某一查询语句               | ✓   |     ✓     |    x     |
| POST /api/v1/extension/procedure                                 | (EXTENSION) 新建 storedprocedure           | x   |     ✓     |    x     |
| PUT /api/v1/extension/procedure/{procedure_id}                   | (EXTENSION) 修改 storedprocedure 信息      | x   |     ✓     |    x     |
| GET /api/v1/extension/procedure                                  | (EXTENSION) 获取 storedprocedure 列表      | x   |     ✓     |    x     |
| DELETE /api/v1/extension/procedure/{procedure_id}                | (EXTENSION) 删除某一 storedprocedure       | x   |     ✓     |    x     |
| POST /api/v1/extension/algo                                      | (EXTENSION) 新建算法应用                   | x   |     x     |    ✓     |
| PUT /api/v1/extension/algo/{algo_id}                             | (EXTENSION) 修改算法信息                   | x   |     x     |    ✓     |
| GET /api/v1/extension/algo                                       | (EXTENSION) 获取算法列表                   | x   |     x     |    ✓     |
| DELETE /api/v1/extension/algo/{algo_id}                          | (EXTENSION) 删除某一算法                   | x   |     x     |    ✓     |
| GET /api/v1/deployment/status                                    | (DEPLOYMENT) 获取集群状态(cpu/memory/disk) | ✓   |     ✓     |    ✓     |
| GET /api/v1/deployment/log                                       | (DEPLOYMENT) 获取集群日志 (可能废弃)       | ✓   |     ✓     |    ✓     |
| GET /api/v1/alert/rule                                           | (ALERT) 获取报警规则列表                   | ✓   |     ✓     |    ✓     |
| PUT /api/v1/alert/rule/{rule_name}                               | (ALERT) 修改某一报警规则                   | ✓   |     ✓     |    ✓     |
| POST /api/v1/alert/rule                                          | (ALERT) 自定义报警规则 (暂不支持)          | ✓   |     ✓     |    ✓     |
| GET /api/v1/alert/message                                        | (ALERT) 获取报警信息列表                   | ✓   |     ✓     |    ✓     |
| PUT /api/v1/alert/message/{message_id}                           | (ALERT) 修改报警信息状态(solved、dealing)  | ✓   |     ✓     |    ✓     |
| GET /api/v1/alert/receiver                                       | (ALERT) 获取警报接收列表(email、dingtalk)  | ✓   |     ✓     |    ✓     |
| DELETE /api/v1/alert/receiver/{receiver_id}                      | (ALERT) 删除某一警报接收对象               | ✓   |     ✓     |    ✓     |
| PUT /api/v1/alert/receiver/{receiver_id}                         | (ALERT) 修改某一警报接收对象信息           | ✓   |     ✓     |    ✓     |
| POST /api/v1/alert/receiver                                      | (ALERT) 新增某一警报接收对象               | ✓   |     ✓     |    ✓     |
| bolt://localhost:6878                                            | 查询走 frontend 暴露的 cypher/gremlin 协议 | ✓   |     ✓     |    x     |
