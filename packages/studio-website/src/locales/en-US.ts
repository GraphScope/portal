export default {
  'navbar.graphs': 'Graphs',
  Query: 'Query',
  'navbar.jobs': 'Jobs',
  'navbar.extension': 'Extensions',
  'navbar.alert': 'Alerts',
  'navbar.setting': 'Settings',
  /**  */
  'collapsed sidebar': 'Collapse',
  'Query App': 'Query App',
  /** graphs */
  'Listing all graphs on the cluster': 'Listing all graphs on the cluster.',
  '{vertices} types of Vertices {br} {edges} types of Edges':
    '{vertices} types of vertices {br} {edges} types of edges.',
  'Delete the label?': 'Deleting a label',
  'Are you sure to delete this label?': 'Are you sure you want to delete this label?',
  /** create instance */
  'Create Instance': 'Creating a new graph',
  Previous: 'Previous',
  Next: 'Next',
  'Confirm Create': 'Confirm and create',
  'Choose Engine Type': 'Choose the engine type',
  'Create Schema': 'Define graph schema',
  Result: 'Result',
  'Input Name': 'Input name', /** Not sure where to use */
  Directed: 'Directed or not',
  'Vertex Label': 'Vertex label',
  'Edge Label': 'Edge label',
  'Source Node Label': 'Source vertex label',
  'Target Node Label': 'Target vertex label',
  'Add Node': 'Add vertex label',
  'Add Edge': 'Add edge label',
  'Vertex labels': 'Vertex labels',
  'Edge Labels': 'Edge labels',
  'Graph Model': 'Graph schema',
  Import: 'Import',
  Export: 'Export',
  'Instance Name': 'Graph name',
  label_name: 'Label name', /** Not sure where to use, better to be Vertex label or Edge label, respectively */
  property_name: 'Property_name',  /** Not sure where to use, Property name, or Name (if in a scope of Property) */
  property_type: 'property_type', /** ditto */
  property_keys: 'property_keys', /** ditto */
  Table: 'Table', /** Not sure where to use */
  Json: 'Json', /** Not sure where to use */ 
  Graph: 'Graph', 
  'Export Config': 'Export configuration',
  'Import Config': 'Import configuration',
  'Start Import': 'Start import',
  Preview: 'Preview',
  'Binding the data source for vertices.': 'Binding the data source for vertices.',
  'Binding the data source for edges.': 'Binding the data source for edges.',
  'Save': 'Save',
  'Mapping of properties': 'Mapping of properties',
  Location: 'Location',
  Label: 'Label',
  Done: 'Done',
  primary_name: 'primary_name', /** Not sure where to use !! wired name!! */
  primary_key: 'Primary key?', 
  primary_type: 'primary_type', /** Not sure where to use !! wired name!! */ 
  Properties: 'Properties',
  'Add Property': 'Add property',
  'Map From File': 'Mapping from file',
  /** extension */
  Name: 'Name',
  'Extension Type': 'Extension type',
  'Binding Graph': 'Binding graph',
  'Create': 'Create',
  'Edit Code': 'Edit code',
  Action: 'Actions',
  Extensions: 'Extensions',
  Edit: 'Edit', /** Not sure where to use, Edit or Editing */ 
  'Store Procedure': 'Stored Procedure',
  'Managing your own stored procedures or customized algorithms.': 'Managing your own stored procedures or customized algorithms.',
  'If you already have an algorithm plugin file, you can upload it here, which will help you quickly create a plugin.':
    'Drag and drop your existing files (e.g., .cpp, .zip, .jar) to upload them and create an extension.',
  'Click or drag file to this area to upload': 'Click or drag file to this area to upload', /** Not sure where to use, ditto one? */
  'Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.': /** You are mixing a tip and a RED warning. */
    'Your data may be passed to a third party (e.g., OpenAI) for AI processing. Consider the risks carefully when handling sensitive data.', 
  /** job */
  'Job List': 'Jobs',
  'Job ID': 'Job ID',
  Type: 'Type',
  Status: 'Status',
  'Start Time': 'Start time',
  'End Time': 'End time',
  'Graph Name': 'Graph name',
  Delete: 'Delete',

  /** alert */
  'Alert Info': 'Alert info', /** see Line-93. */
  'Alert Rules': 'Alert rules',
  'Alert Recep': 'Alert recep', /** recep??? what's this? receiver? */
  'Alert Information': 'Alert information', 
  'Alert Name': 'Alert name',
  Severity: 'Severity', 
  Metric: 'Metrics',
  'Triggered Time': 'Triggered time',
  'Alert Conditions': 'Alert conditions',
  'Alert Frequency': 'Alert frequency',
  'At User Ids': '@user IDs',
  'Is At All': '@all?',
  'Receiver Type': 'Receiver type',
  'Create Alert Recep': 'Create alert receiver',
  'WebHook URL': 'WebHook URL',
  Reset: 'Reset',
  Search: 'Search',
  Time: 'Time',
  Submit: 'Submit', //** Create? */

  'GraphScope transforms tasks like data import, analysis, and other long-processing tasks into jobs, which you can monitor and manage here.':
    'Managing long-running tasks, such as data importing, analytic jobs, and complex queries.',
  /** popconfirm */
  'Are you sure to delete this task?': 'Are you sure you want to terminate the task?', /** Please confirm the action, assuming you are terminating it. */
  Yes: 'Yes', /** Sure, and Cancel, if you are buttons for dialog above. */
  No: 'No',
  /** setting */
  'Primary color': 'Primary color',
  International: 'International',
  'Select national language': 'Select language', /** what is national language??? */
  'Set the primary color': 'Select the primary color',
  'Interact theme': 'Interact theme', /** Not sure what is this. */
  'Select or customize your UI theme': 'Select or customize your UI theme',
  'Rounded corners': 'Rounded corners',
  'Corner radians': 'Corner radians',
  Light: 'Light',
  Dark: 'Dark',
  /** import data */
  Labels: 'Labels',
  Datasource: 'Data sources',
  Vertices: 'Vertices',
  Edges: 'Edges',
  'Import Data': 'Importing graph data',
  'Currently bound': 'Existing data bindings',
  'Bind source': 'Bound data source',
  'Unbound source': 'Unbound data source',
  'Import Periodic': 'Scheduled import',
  'Periodic Import From ODPS': 'Periodic import from ODPS',
  'Periodic Import From Dataworks': 'Periodic import from Dataworks', /** ditto to above? difference from L137?? */
  'Import Now': 'Import now',
  'importing, for more information, see Tasks': 'Data import job <a>#JOBID</a> is running.', /** TODO */
  /** graphlist */
  'Define Schema': 'Define schema',
  'Query Graph': 'Query graph',
  'Graph Schema': 'Graph schema',
  'types of Edges': 'types of edges',
  'types of Vertices': 'types of vertices',
  Endpoints: 'Endpoints',
  Statistics: 'Statistics',
  'New Graph': 'New graph',
  'Pause Service': 'Pause graph service',
  'Start Service': 'Start graph service',
  Uptime: 'UpTime',
  'Last data import': 'Last data import',
  'Served from': 'Served from',
  'Created on': 'Created on',
  running: 'Running',
  stopped: 'Stopped', /** more status? No schema/No data. */ 
  /** instance  */
  'Graph Metadata': 'Graph Metadata',
  'Graph instance name': 'Graph instance name',
  'Graph store type': 'Graph storage type',
  'graphs.engine.interactive.desc':
    'Interactive engine is designed to handle concurrent graph queries at an impressive speed. \
    Its primary goal is to process as many queries as possible within a given time frame, \
    emphasizing a high query throughput rate.',
  'More details': 'More details',
  'Add new': 'Add new',
  Interactive: 'Interactive',
  'View Schema': 'View schema',
  Upload: 'Upload',
  delete: 'delete',
  'Source Vertex Label': 'Source vertex label',
  'Target Vertex Label': 'Target vertex label',
  'Destination Vertex Label': 'Destination Vertex Label', /** should be unify. */
  'property name': 'Property name',
  'Data type': 'Data type',
  'Primary key': 'as primary key?',
  "Congratulations on the successful creation of the model, now let's start to guide the data.": /** guide the data??? good trans. */
    "Congratulations on successfully creating the graph! You are now encouraged to bind and import the graph data.",
  /** for validation from line 181-187: {input_label} must not be blank. */
    'please name your graph instance.': 'Please name your graph instance.', 
  'Please Enter {label}': 'Please Enter {label}',
  'Please Enter Vertex Label.': 'Please Enter Vertex Label.', 
  'Please Enter Edge Label.': 'Please Enter Edge Label.',
  'Please Select Source Vertex Label.': 'Please Select Source Vertex Label.',
  'Please Select Target Vertex Label.': 'Please Select Target Vertex Label.',
  'Please manually input the odps file location': 'Please manually input the odps file location',
  /** sidebar */
  docs: 'docs',
  graphscope: 'website',
  github: 'github',
};
