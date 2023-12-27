## API Summary

| API                               | Comments                    | Groot      | Interactive |
| --------------------------------- | --------------------------- | ---------- | ----------- |
| /api/v1/deployment/info           | Cluster Meta Info           | K8s API    | ✅          |
| /api/v1/deployment/status         | Cluster Status              | K8s API    | ✅          |
| /api/v1/deployment/log            | Cluster Log                 | K8s API    | ✅          |
| /api/v1/deployment/resource       | Cluster Resource            | K8s API    | ✅          |
| /api/v1/graph                     | Graph Management            | K8s API    | ✅          |
| /api/v1/graph/schema              | Graph Schema Management     | Groot      | ✅          |
| /api/v1/graph/schema/vertex       | Graph Vertex Management     | Groot      | ❌          |
| /api/v1/graph/schema/edge         | Graph Edge Management       | Groot      | ❌          |
| /api/v1/graph/datasource          | Graph datasource Management | Data-Store | ❌          |
| /api/v1/job                       | Job Management              | Data-Store | ✅          |
| /api/v1/alert/rule                | Alert Rules Management      | Data-Store | ✅          |
| /api/v1/alert/message             | Alert Message Management    | Data-Store | ✅          |
| /api/v1/alert/receiver            | Alert Receiver Management   | Data-Store | ✅          |
| /api/v1/statement                 | management statement        | ✅         | ✅          |
| bolt://localhost:6878             | query statement             | ✅         | ✅          |
| ?                                 | query stored-procedure      | ✅         | ✅          |
| /api/v1/extension/storedprocedure | management stored-procedure | ❌         | ✅          |
| /api/v1/extension/algo            | management algo             | ❌         | ❌          |

- depolyment 部署
  - info 信息
  - status 状态
  - log 日志
  - resource CPU 内存
