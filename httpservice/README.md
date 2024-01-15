## API Summary

| Method and URL                                                   | Explanation                                            |Groot|Interactive|Analytical|  M1  |
| -----------------------------------------------------------------| ------------------------------------------------------ | --- | --------- | ---------|------|
| POST /api/v1/connection                                          | (CONNECTION) 连接服务，获取配置信息                    | ✓   |     ✓     |    ✓     | ✓   |
| DELETE /api/v1/connection                                        | (CONNECTION) 断开连接                                  | ✓   |     ✓     |    ✓     | ✓   |
| POST /api/v1/graph                                               | (GRAPH) 新建图                                         | x   |     ✓     |    ✓     | ✓   |
| DELETE /api/v1/graph/{graph_name}                                | (GRAPH) 删除图                                         | x   |     ✓     |    ✓     | ✓   |
| GET /api/v1/graph                                                | (GRAPH) 获取图实例列表(Groot暂不支持新接口)            | x(✓)|     ✓     |    ✓     | ✓   |
| POST /api/v1/graph/{graph_name}/schema                           | (GRAPH) 批量导入图 schema 信息(Groot暂不支持新接口)    | x(✓)|     x     |    x     |     ｜
| GET /api/v1/graph/{graph_name}/schema                            | (GRAPH) 获取图 schema 信息(Groot暂不支持新接口)        | x(✓)|     ✓     |    ✓     | ✓   |
| POST /api/v1/graph/{graph_name}/schema/vertex                    | (GRAPH) 新增点类型                                     | ✓   |     x     |    x     | ✓   |
| DELETE /api/v1/graph/{graph_name}/schema/vertex/{label_name}     | (GRAPH) 删除点类型                                     | ✓   |     x     |    x     | ✓   |
| POST /api/v1/graph/{graph_name}/schema/edge                      | (GRAPH) 新增边类型                                     | ✓   |     x     |    x     | ✓   |
| DELETE /api/v1/graph/{graph_name}/schema/edge/{label_name}       | (GRAPH) 删除边类型                                     | ✓   |     x     |    x     | ✓   |
| GET /api/v1/groot/graph                                          | (LEGACY GROOT ONLY) 获取图实例列表(Groot遗留接口)      | ✓   |     x     |    x     | ✓   |
| POST /api/v1/groot/graph/{graph_name}/schema                     | (LEGACY GROOT ONLY) 批量导入 schema 信息(Groot遗留接口)| ✓   |     x     |    x     | ✓   |
| GET /api/v1/groot/graph/{graph_name}/schema                      | (LEGACY GROOT ONLY) 获取图 schema 信息(Groot遗留接口)  | ✓   |     x     |    x     | ✓   |
| POST /api/v1/graph/{graph_name}/datasource/vertex/{label_name}   | (DATASOURCE) 绑定点类型数据源                          | ✓   |     ✓     |    ✓     | ✓   |
| GET /api/v1/graph/{graph_name}/datasource/vertex/{label_name}    | (DATASOURCE) 获取点类型数据源                          | ✓   |     ✓     |    ✓     | ✓   |
| PUT /api/v1/graph/{graph_name}/datasource/vertex/{label_name}    | (DATASOURCE) 修改点类型数据源                          | ✓   |     ✓     |    ✓     | ✓   |
| POST /api/v1/graph/{graph_name}/datasource/edge/{label_name}     | (DATASOURCE) 绑定边类型数据源                          | ✓   |     ✓     |    ✓     | ✓   |
| GET /api/v1/graph/{graph_name}/datasource/edge/{label_name}      | (DATASOURCE) 获取边类型数据源                          | ✓   |     ✓     |    ✓     | ✓   |
| PUT /api/v1/graph/{graph_name}/datasource/edge/{label_name}      | (DATASOURCE) 修改边类型数据源                          | ✓   |     ✓     |    ✓     | ✓   |
| POST /api/v1/job/dataloading                                     | (JOB) 创建数据导入任务                                 | ✓   |     ✓     |    x     | ✓   |
| POST /api/v1/job/analysis                                        | (JOB) 创建图分析任务                                   | x   |     x     |    ✓     |     ｜
| GET /api/v1/job                                                  | (JOB) 获取任务信息列表                                 | ✓   |     ✓     |    ✓     | ✓   |
| GET /api/v1/job/{job_id}                                         | (JOB) 获取某一任务状态                                 | ✓   |     ✓     |    ✓     | ✓   |
| DELETE /api/v1/job/{job_id}                                      | (JOB) 取消任务                                         | ✓   |     ✓     |    ✓     | ✓   |
| POST /api/v1/statement                                           | (STATEMENT) 新建 gremlin/cypher 语句                   | ✓   |     ✓     |    x     | ✓   |
| GET /api/v1/statement                                            | (STATEMENT) 获取查询语句列表                           | ✓   |     ✓     |    x     | ✓   |
| PUT /api/v1/statement/{statement_id}                             | (STATEMENT) 修改查询语句信息                           | ✓   |     ✓     |    x     | ✓   |
| DELETE /api/v1/statement/{statement_id}                          | (STATEMENT) 删除某一查询语句                           | ✓   |     ✓     |    x     | ✓   |
| GET /api/v1/procedure                                            | (EXTENSION) 获取全部 storedprocedure 列表              | x   |     ✓     |    x     | ✓   |
| POST /api/v1/graph/{graph_name}/procedure                        | (EXTENSION) 新建 storedprocedure                       | x   |     ✓     |    x     | ✓   |
| GET /api/v1/graph/{graph_name}/procedure                         | (EXTENSION) 获取某张图上 storedprocedure 列表          | x   |     ✓     |    x     | ✓   |
| PUT /api/v1/graph/{graph_name}/procedure/{procedure_name}        | (EXTENSION) 修改 storedprocedure 信息                  | x   |     ✓     |    x     | ✓   |
| DELETE /api/v1/graph/{graph_name}/procedure/{procedure_name}     | (EXTENSION) 删除某一 storedprocedure                   | x   |     ✓     |    x     | ✓   |
| GET /api/v1/deployment/info                                      | (DEPLOYMENT) 获取集群信息                              | ✓   |     ✓     |    ✓     | ✓   |
| GET /api/v1/deployment/status                                    | (DEPLOYMENT) 获取集群状态(k8s only)                    | ✓   |     ✓     |    ✓     | ✓   |
| GET /api/v1/deployment/log                                       | (DEPLOYMENT) 获取集群日志 (可能废弃)                   | ✓   |     ✓     |    ✓     | ✓   |
| GET /api/v1/node/status                                          | (DEPLOYMENT) 获取集群节点状态 (cpu/memory)             | ✓   |     ✓     |    ✓     | ✓   |
| GET /api/v1/alert/rule                                           | (ALERT) 获取报警规则列表                               | ✓   |     ✓     |    ✓     | ✓   |
| PUT /api/v1/alert/rule/{rule_name}                               | (ALERT) 修改某一报警规则                               | ✓   |     ✓     |    ✓     | ✓   |
| POST /api/v1/alert/rule                                          | (ALERT) 自定义报警规则 (暂不支持)                      | ✓   |     ✓     |    ✓     |     ｜
| DELETE /api/v1/alert/rule/{rule_name}                            | (ALERT) 删除某一报警负责                               | ✓   |     ✓     |    ✓     | ✓   |
| GET /api/v1/alert/message                                        | (ALERT) 获取报警信息列表                               | ✓   |     ✓     |    ✓     | ✓   |
| PUT /api/v1/alert/message                                        | (ALERT) 批量修改信息状态(solved、dealing)              | ✓   |     ✓     |    ✓     | ✓   |
| GET /api/v1/alert/receiver                                       | (ALERT) 获取警报接收列表(email、dingtalk)              | ✓   |     ✓     |    ✓     | ✓   |
| DELETE /api/v1/alert/receiver/{receiver_id}                      | (ALERT) 删除某一警报接收对象                           | ✓   |     ✓     |    ✓     | ✓   |
| PUT /api/v1/alert/receiver/{receiver_id}                         | (ALERT) 修改某一警报接收对象信息                       | ✓   |     ✓     |    ✓     | ✓   |
| POST /api/v1/alert/receiver                                      | (ALERT) 新增某一警报接收对象                           | ✓   |     ✓     |    ✓     | ✓   |
| POST /api/v1/service/start                                       | (SERVICE) 在某张图上启动 Interactive 服务              | x   |     ✓     |    x     | ✓   |
| POST /api/v1/service/stop                                        | (SERVICE) 停止当前 Interactive 服务                    | x   |     ✓     |    x     | ✓   |
| POST /api/v1/service/restart                                     | (SERVICE) 重启当前服务                                 | x   |     ✓     |    x     | ✓   |
| GET /api/v1/service/status                                       | (SERVICE) 获取 Interactive 服务状态                    | x   |     ✓     |    x     | ✓   |
| POST /api/v1/extension/algo                                      | (EXTENSION) 新建算法应用                               | x   |     x     |    ✓     |     ｜
| PUT /api/v1/extension/algo/{algo_id}                             | (EXTENSION) 修改算法信息                               | x   |     x     |    ✓     |     ｜
| GET /api/v1/extension/algo                                       | (EXTENSION) 获取算法列表                               | x   |     x     |    ✓     |     ｜
| DELETE /api/v1/extension/algo/{algo_id}                          | (EXTENSION) 删除某一算法                               | x   |     x     |    ✓     |     ｜
