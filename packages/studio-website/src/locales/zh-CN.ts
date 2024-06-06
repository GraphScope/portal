export default {
  'navbar.graphs': '图实例',
  'navbar.jobs': '作业管理',
  Query: '图查询',
  'navbar.extension': '扩展插件',
  'navbar.alert': '告警监控',
  'navbar.setting': '应用设置',
  Schema: '建模二期',
  /** graphs */
  day: '天',
  hrs: '小时',
  min: '分',
  'Listing all graphs on the cluster': '列出了当前所有的图实例',
  '{vertices} types of vertices {br} {edges} types of edges': '{vertices} 种类型的点 {br} {edges} 种类型的边',
  'Deleting a label': '确认删除',
  'Are you sure to delete this label?': '您确认删除该类型吗',
  /** create instance */
  'Creating a new graph': '创建图实例',
  Previous: '上一步',
  Next: '下一步',
  'Confirm and create': '确认创建',
  'Choose Engine Type': '选择引擎类型',
  'Define graph schema': '定义图模型(Schema)',
  Result: '创建结果',
  'Input Name': '引擎名称',
  'Directed or not': '有向图还是无向图',
  'Vertex label': '点的标签类型',
  'Edge Label': '边的标签类型',

  'Add vertex label': '添加点的标签类型',
  'Add edge label': '添加边的标签类型',
  'Vertex labels': '点的标签类型',
  'Edge labels': '边的标签类型',
  'Graph Model': '图模型的预览',
  Import: '导入',
  Export: '导出',
  'Graph name': '图实例名',
  label_name: '标签类型名',
  property_name: '属性名',
  property_type: '属性类型',
  property_keys: '是否主键？',
  Table: '表格',
  Json: 'Json',
  Graph: '图',
  'Export configuration': '导出配置',
  'Import Config': '导入配置',
  'Start import': '开始导入',
  Preview: '预览',
  'Binding the data source for vertices.': '点数据源绑定',
  'Binding the data source for edges.': '边数据源绑定',
  Save: '保存',
  'Mapping of properties': '属性映射',
  Location: '数据源地址',
  Label: '实例名称' /** double check, need to change the en or cn. */,
  Done: '完成',
  primary_name: '属性名',
  primary_key: '主键',
  primary_type: '类型',
  Properties: '属性',
  'Add property': '添加属性',
  'Mapping from file': '从文件映射',
  'Please input a valid string starting with an uppercase English letter.': '请输入合法字符且首字母为英文.',
  'You can restart the service after importing the data.': '您成功导入数据后再重启服务。',
  /** extensions */
  Name: '名称',
  Description: '描述',
  'Extension Type': '拓展插件类型',
  'Binding graph': '绑定的图实例',
  Create: '创建插件',
  'Edit code': '编辑代码',
  'Plugin Type': '插件类型',
  'Create Plugin': '创建插件',
  Action: '操作',
  Extensions: '扩展插件',
  Edit: '编辑',
  'Store Procedure': '存储过程',
  'Managing your own stored procedures or customized algorithms.': '管理扩展插件，包括自定义的存储过程和算法等。',
  'If you already have an algorithm plugin file, you can upload it here, which will help you quickly create a plugin.':
    '拖动文件到此区域进行上传以创建新的扩展插件。',
  'Click or drag file to this area to upload': '单击或拖动文件到此区域进行上传',
  /** job */
  'Job List': '作业列表',
  'Job ID': 'Job ID',
  Type: '类型',
  Status: '状态',
  'Start time': '开始时间',
  'End time': '结束时间',
  Delete: '删除',
  /** alert */
  'Alert info': '警报信息',
  'Alert rules': '警报规则',
  'Alert receiver': '警报接收人',
  'Alert information': '警报信息',
  'Alert name': '警报名称',
  Severity: '严重性',
  Metrics: '类型',
  'Trigger Time': '触发时间',
  'Alert conditions': '报警条件',
  'Alert frequency': '报警频率',
  '@user IDs': '被@用户ID',
  '@all?': '是否@所有人',
  'Receiver type': '接收人类型',
  'Create alert receiver': '创建警报接收人',
  'WebHook URL': 'WebHook URL',
  Reset: '重置',
  Search: '搜索',
  Time: '时间',
  Submit: '提交',
  'Managing long-running tasks, such as data importing, analytic jobs, and complex queries.':
    '查看和管理长时作业，例如数据导入、全图分析以及复杂查询等。',
  /** popconfirm */
  'Are you sure to delete this task?': '是否确认中止该作业？',
  Yes: '是',
  No: '否',
  /** setting */
  'Primary color': '主题颜色',
  International: '国际化',
  'Select language': '选择语言',
  'Set the primary color': '设置主题颜色',
  'Select theme': '主题交互',
  'Select or customize your UI theme': '选择或自定义 UI 主题',
  'Rounded corners': '圆角',
  'Corner radians': '圆角弧度',
  'Appearance Setting': '系统设置',
  'Change how Untitled UI looks and feels in your browser': '您可以在这里自定义系统语言，主题样式等',
  Light: '白天',
  Dark: '黑夜',
  /** import data */
  Labels: '标签',
  'Data sources': '数据源',
  Vertices: '点',
  Edges: '边',
  'Importing data': '导入数据',
  'Existing data bindings': '目前绑定了',
  'Bound data source': '已绑定数据源',
  'Unbound data source': '未绑定数据源',
  'Scheduled import': '周期导入',
  // 'Periodic import from ODPS': '周期性导入 ODPS 表',
  'Create a recurring import task': '创建周期性导入任务',
  Date: '日期',
  Repeat: '调度策略',
  'Periodic import': '周期性导入',
  'Periodic import from Dataworks': 'Dataworks 上构建数据导入流程',
  'Import now': '立即导入',
  'importing, for more information, see Tasks': '类型的节点正在导入中，详情查看任务',
  /** graphlist */
  'Define schema': '定义模型',
  'Query graph': '查询数据',
  'Graph schema': '图模型',
  'types of edges': '种边标签类型',
  'types of vertices': '种点标签类型',
  Endpoints: '服务地址',
  Statistics: '统计数据',
  'New graph': '新建实例',
  'Pause graph service': '暂停服务',
  'Start graph service': '启动服务',
  Uptime: '服务时间',
  'Last data import': '上次导入',
  'Served from': '本次启动时间',
  'Created on': '实例创建时间',
  running: '运行中',
  stopped: '已停止 ',
  /** instance  */
  'Graph Metadata': '图的元数据',
  'Graph instance name': '实例名称',
  'Graph store type': '存储类型',
  'graphs.engine.interactive.desc':
    'Interactive 是一种专为处理高并发图查询而设计的引擎，该引擎能实现超高的查询吞吐率。',
  'More details': '更多详情',
  'Add new': '新建',
  Interactive: 'Interactive',
  'View schema': '查看模型',
  Upload: '上传',
  delete: '删除',
  'Source vertex label': '起始点的标签类型',
  'Target vertex label': '终止点的标签类型',
  'Destination vertex label': '终止点的标签类型',
  'property name': '属性名称',
  'Data type': '数据类型',
  'Primary key': '是否是主键？',
  'Congratulations on successfully creating the graph! You are now encouraged to bind and import the graph data.':
    '图模型已经创建成功！接下来您可以设置数据源和导入数据。',
  'please name your graph instance.': '请输入图实例名称。',
  'Please enter vertex label.': '请输入点标题',
  'Please enter edge label.': '请输入边标题',
  'Please select source vertex label.': '请选择源点标签。',
  'Please select target vertex label.': '请选择目标点标签。',
  'Please manually input the odps file location': '请手动输入文件地址，也可直接上传本地 CSV 文件',
  'Your graph instance is of type {enginetype} and cannot be modified after creation. Instead, you may choose to create a new graph instance.':
    '您的图实例类型为 {enginetype}，一旦创建则不支持修改图模型，您可以选择新建图实例。',
  /** sidebar */
  docs: '文档',
  graphscope: '官网',
  github: 'github',
  /** jobs */
  Jobs: '作业管理',
  /** new navigation */
  Modeling: '建模',
  Importing: '导数',
  Querying: '查询',
  'Querying data': '查询数据',
  Stopped: '已停止',
  Running: '运行中',
};
