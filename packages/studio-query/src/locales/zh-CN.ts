export default {
  /** sidebar  */
  Recommended: '推荐查询',
  History: '历史查询',
  Copilot: '智能查询',
  Saved: '保存查询',
  'Stored Procedures': '存储过程',

  /** index */
  'You can write cypher or gremlin queries, and then click the {icon} button to query data':
    '您可以在这里编写 cypher 或 gremlin 语句，点击 {icon} 按钮查询数据',
  /** recommended */
  'Vertex Labels': '节点类型',
  'Edge Labels': '边类型',
  'Property Keys': '属性字段',
  /** saved */
  'No saved query statements {br} You can click {icon} to save.': '暂无保存的查询语句 {br} 您可以点击 {icon} 保存',
  /** store-procedure */
  'No stored procedures available. {br} Go to the <a>Extension</a> and create one now!':
    '暂无存储过程 {br} 快去 <a>插件市场</a> 创建一个吧',

  /** copilot */
  'Privacy Security Notice': '隐私安全说明',
  Setting: '设置',
  'query.app.sidebar.gpt.setting.security':
    '为了提高生成Cypher查询语句的质量，我们将使用您的图数据模式作为ChatGPT的提示。您的数据将被严格保密，仅用于此目的。此外，请注意我们的OpenAI API密钥仅存在于您的浏览器本地，以增加安全性。',
  'OpenAI API key is only stored locally in your browser': 'OpenAI API key 仅保存在您浏览器本地',
  'query.copilot.welcome': '您好！我是 GraphScope 查询助理，您有任何关于 Cypher 或者 Gremlin 查询的问题都可以随时问我',
  'recommend 5 interesting query statements': '帮我推荐5个有意思的查询',
  'query any subgraph': '查询任意一个子图',
  'insight the statistical distribution of vertex labels in the graph': '帮我分析图中节点类型的分布情况',
  /** Statement */
  Save: '保存',
  Delete: '删除',
  Query: '查询',
  Share: '分享',
  "query submmited on {submitTime}. It's running ... ": '查询提交于 {submitTime}. 正在运行中...',
  'query submmited on {submitTime}. Running {runningTime} ms': '查询提交于 {submitTime}. 查询时长 {runningTime} ms',
  'A total of {totalCount} records were retrieved': '一共检索到 {totalCount} 条记录',
  'A total of {totalCount} records were retrieved, including {nodeCount} nodes and  {edgeCount} edges.':
    '一共检索到 {totalCount} 条记录, 其中包含 {nodeCount} 个节点，{edgeCount} 条边',
  /** Lengend Tags */
  Color: '颜色',
  Size: '大小',
  Caption: '文本',
  LineWidth: '边宽',
  /** Properties detial */
  'Node properties': '属性详情',
  /** display mode */
  Graph: '图展示',
  Table: '表格展示',
  Raw: '原始数据',
  'Style Setting': '样式设置',
  'You can click on each label to set the color, size, and display text for vertices and edges.':
    '您可以单击每个标签来设置顶点和边缘的颜色、大小和显示文本。',
  'Export graph json': '导出 json',
  'Clustering layout': '集群布局',
  'Vertex Properties': '节点属性',
};
