import * as React from 'react';
import { Typography, theme, Alert, Card, Button, Space, Tooltip, Modal, Input, Form } from 'antd';
import { PlusOutlined, FileOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { useContext, INotebook } from '../context';
import { useDynamicStyle } from '@graphscope/studio-components';
import dayjs from 'dayjs';
import { FormattedMessage, useIntl } from 'react-intl';

interface IWelcomeProps {}
const { useToken } = theme;
const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

const Welcome: React.FunctionComponent<IWelcomeProps> = props => {
  const { token } = useToken();
  const { store, updateStore } = useContext();
  const { welcome, statements, language, graphId, notebooks, showWelcomePage } = store;
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [newNotebookName, setNewNotebookName] = React.useState('');
  const [editingNotebook, setEditingNotebook] = React.useState<INotebook | null>(null);
  const intl = useIntl();

  // 使用 useDynamicStyle 添加样式
  useDynamicStyle(` 
    .welcome-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 12px;
      background-color: ${token.colorBgLayout};
      box-sizing: border-box;
      overflow: hidden;
    }
    
    .welcome-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: ${token.colorBgContainer};
      width: 100%;
      height: 100%;
      border-radius: 8px;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    
    .welcome-title-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
      margin-top: 40px;
      padding: 0 20px;
    }
    
    .notebook-icon {
      font-size: 42px;
      color: #1890ff;
      margin-bottom: 16px;
    }
    
    .welcome-title {
      font-size: 24px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .welcome-description {
      font-size: 14px;
      color: #8c8c8c;
      margin-bottom: 0;
      text-align: center;
    }
    
    .empty-icon {
      margin-bottom: 24px;
    }
    
    .empty-message {
      font-size: 14px;
      color: #8c8c8c;
      margin-bottom: 60px;
    }
    
    .notebooks-scroll-container {
      width: 100%;
      flex: 1;
      overflow-y: auto;
      padding: 0 20px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .notebooks-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 20px;
      width: 100%;
      max-width: 900px;
      padding-bottom: 20px;
    }
    
    .notebook-card {
      width: 240px;
      height: 160px;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      transition: all 0.2s;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin-bottom: 0;
    }
    
    .notebook-card:hover {
      border-color: #1890ff;
      box-shadow: 0 3px 6px -4px rgba(0,0,0,0.12), 0 6px 16px 0 rgba(0,0,0,0.08), 0 9px 28px 8px rgba(0,0,0,0.05);
    }
    
    .notebook-card-header {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .notebook-card-content {
      padding: 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .notebook-meta {
      display: flex;
      justify-content: space-between;
      color: #8c8c8c;
      font-size: 12px;
    }
    
    .create-options-container {
      padding: 20px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
    
    .create-options {
      display: flex;
      gap: 24px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .create-button {
      height: 56px;
      width: 180px;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      color: #595959;
      background-color: white;
    }
    
    .create-button:hover {
      color: #1890ff;
      border-color: #1890ff;
      background-color: #e6f7ff;
    }
    
    .create-button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .create-icon {
      color: #1890ff;
      font-size: 16px;
    }
  `,'welcome-page-styles');

  // 如果不显示欢迎页，返回null
  if (!showWelcomePage) {
    return null;
  }

  // 创建空白 Notebook
  const createBlankNotebook = () => {
    // 显示创建 Notebook 对话框
    setEditingNotebook(null);
    setNewNotebookName('');
    setIsModalVisible(true);
  };

  // 创建示例 Notebook
  const createExampleNotebook = () => {
    // 显示创建示例 Notebook 对话框
    setEditingNotebook(null);
    setNewNotebookName(intl.formatMessage({ id: 'notebook.example' }));
    setIsModalVisible(true);
  };

  // 确认创建 Notebook
  const handleCreateNotebook = (isExample: boolean = false) => {
    const id = uuidv4();
    const now = Date.now();
    
    // 如果是示例笔记本，添加示例语句
    const ids = isExample ? [uuidv4(), uuidv4(), uuidv4()] : [uuidv4()];
    
    // 根据语言选择示例查询
    const exampleQueries = language === 'cypher' 
      ? [
         // 获取任意几个节点
          'MATCH (n) RETURN n LIMIT 3',
   
         // 获取任意几条边及其连接的节点
          'MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 5',
   
         // 获取图中的节点标签和关系类型组合，用于查看图模式
          'MATCH (n)--(r)--(m) RETURN DISTINCT labels(n), type(r), labels(m) LIMIT 10'
        ]
      : [
         // 获取任意几个顶点
          'g.V().limit(3)',
   
         // 获取边及其起点和终点路径信息
          'g.E().limit(5).as("e").inV().as("in").outV().as("out").select("out","e","in")',
   
         // 查看图中不同标签的分布情况
          'g.V().groupCount().by(label).limit(10)'
        ];
    
    // 创建语句数组，保存在 notebook 和 statements 中
    const notebookStatements = isExample
      ? [
          {
            id: ids[0],
            script: exampleQueries[0],
            language,
            graphId,
          },
          {
            id: ids[1],
            script: exampleQueries[1],
            language,
            graphId,
          },
          {
            id: ids[2],
            script: exampleQueries[2],
            language,
            graphId,
          }
        ]
      : [
          {
            id: ids[0],
            script: '',
            language,
            graphId,
          }
        ];
    
    const defaultNotebookName = intl.formatMessage(
      { id: 'notebook.default.name' },
      { number: notebooks.length + 1 }
    );
    
    const newNotebook: INotebook = {
      id,
      name: newNotebookName || defaultNotebookName,
      createdAt: now,
      updatedAt: now,
      statements: notebookStatements
    };
    
    // 更新 notebooks 列表
    updateStore(draft => {
      // 添加到 notebooks 列表
      draft.notebooks = [...draft.notebooks, newNotebook];
      // 设置为当前活动 notebook
      draft.activeNotebook = newNotebook;
      // 不再显示欢迎页
      draft.showWelcomePage = false;
      
      // 将 notebook 中的语句应用到当前语句
      draft.statements = [...notebookStatements];
      draft.activeId = ids[0];
      
      // 保存到本地存储
      try {
        localStorage.setItem(
          'GS_STUDIO_QUERY_NOTEBOOKS',
          JSON.stringify([...draft.notebooks])
        );
      } catch (error) {
        console.error(intl.formatMessage({ id: 'notebook.save.error' }), error);
      }
    });
    
    setIsModalVisible(false);
  };

  // 打开已有的 Notebook
  const openNotebook = (notebook: INotebook) => {
    updateStore(draft => {
      draft.activeNotebook = notebook;
      draft.showWelcomePage = false;
      
      // 从笔记本中加载语句
      if (notebook.statements && notebook.statements.length > 0) {
        draft.statements = [...notebook.statements];
        draft.activeId = notebook.statements[0].id;
      } else {
        // 如果笔记本中没有语句，创建一个空的语句
        const statementId = uuidv4();
        const emptyStatement = {
          id: statementId,
          script: '',
          language,
          graphId,
        };
        draft.statements = [emptyStatement];
        draft.activeId = statementId;
        
        // 更新笔记本，添加空语句
        const index = draft.notebooks.findIndex(n => n.id === notebook.id);
        if (index !== -1) {
          draft.notebooks[index].statements = [emptyStatement];
          draft.notebooks[index].updatedAt = Date.now();
          
          // 同步更新 activeNotebook
          draft.activeNotebook = draft.notebooks[index];
          
          try {
            localStorage.setItem(
              'GS_STUDIO_QUERY_NOTEBOOKS',
              JSON.stringify(draft.notebooks)
            );
          } catch (error) {
            console.error(intl.formatMessage({ id: 'notebook.save.error' }), error);
          }
        }
      }
    });
  };

  // 编辑 Notebook
  const editNotebook = (notebook: INotebook, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNotebook(notebook);
    setNewNotebookName(notebook.name);
    setIsModalVisible(true);
  };

  // 确认编辑 Notebook
  const handleEditNotebook = () => {
    if (!editingNotebook) return;
    
    updateStore(draft => {
      const index = draft.notebooks.findIndex(n => n.id === editingNotebook.id);
      if (index !== -1) {
        draft.notebooks[index] = {
          ...draft.notebooks[index],
          name: newNotebookName || draft.notebooks[index].name,
          updatedAt: Date.now()
        };
        
        // 如果正在编辑当前活动的 notebook，也更新它
        if (draft.activeNotebook && draft.activeNotebook.id === editingNotebook.id) {
          draft.activeNotebook = draft.notebooks[index];
        }
        
        // 保存到本地存储
        try {
          localStorage.setItem(
            'GS_STUDIO_QUERY_NOTEBOOKS',
            JSON.stringify(draft.notebooks)
          );
        } catch (error) {
          console.error(intl.formatMessage({ id: 'notebook.save.error' }), error);
        }
      }
    });
    
    setIsModalVisible(false);
    setEditingNotebook(null);
  };

  // 删除 Notebook
  const deleteNotebook = (notebook: INotebook, e: React.MouseEvent) => {
    e.stopPropagation();
    
    confirm({
      title: intl.formatMessage({ id: 'notebook.delete.confirm.title' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: 'notebook.delete.confirm.content' }),
      okText: intl.formatMessage({ id: 'common.delete' }),
      okType: 'danger',
      cancelText: intl.formatMessage({ id: 'common.cancel' }),
      onOk() {
        updateStore(draft => {
          draft.notebooks = draft.notebooks.filter(n => n.id !== notebook.id);
          
          // 如果删除的是当前活动的 notebook，清空当前活动的 notebook
          if (draft.activeNotebook && draft.activeNotebook.id === notebook.id) {
            draft.activeNotebook = null;
          }
          
          // 保存到本地存储
          try {
            localStorage.setItem(
              'GS_STUDIO_QUERY_NOTEBOOKS',
              JSON.stringify(draft.notebooks)
            );
          } catch (error) {
            console.error(intl.formatMessage({ id: 'notebook.save.error' }), error);
          }
        });
      }
    });
  };

  // 检查是否应该显示欢迎消息
  if (welcome) {
    const { title, description } = welcome;
    return (
      <div
        style={{
          margin: '12px',
          borderRadius: '8px',
          background: token.colorBgContainer,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Alert message={title} description={description} type="info" closable />
      </div>
    );
  }

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <div className="welcome-title-container">
          <div className="notebook-icon">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" stroke="#1890ff" strokeWidth="2" fill="#e6f7ff"/>
              <path d="M7 7H17" stroke="#1890ff" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 11H17" stroke="#1890ff" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 15H13" stroke="#1890ff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="welcome-title">
            <FormattedMessage id="notebook.title" />
          </h2>
          <p className="welcome-description">
            <FormattedMessage id="notebook.description" />
          </p>
        </div>
        
        <div className="notebooks-scroll-container">
          {notebooks.length > 0 ? (
            <div className="notebooks-grid">
              {notebooks.map(notebook => (
                <div 
                  key={notebook.id}
                  className="notebook-card"
                  onClick={() => openNotebook(notebook)}
                >
                  <div className="notebook-card-header">
                    <Text strong ellipsis style={{ maxWidth: '160px' }}>{notebook.name}</Text>
                    <Space size={4}>
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        size="small" 
                        onClick={(e) => editNotebook(notebook, e)}
                        title={intl.formatMessage({ id: 'common.edit' })}
                      />
                      <Button 
                        type="text" 
                        danger
                        icon={<DeleteOutlined />} 
                        size="small" 
                        onClick={(e) => deleteNotebook(notebook, e)}
                        title={intl.formatMessage({ id: 'common.delete' })}
                      />
                    </Space>
                  </div>
                  <div className="notebook-card-content">
                    <div className="notebook-meta">
                      <div>
                        <FormattedMessage 
                          id="notebook.last.modified" 
                          values={{ date: dayjs(notebook.updatedAt).format('YYYY-MM-DD') }}
                        />
                      </div>
                      <div>
                        <FormattedMessage 
                          id="notebook.query.count" 
                          values={{ count: notebook.statements?.length || 0 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <div className="empty-icon">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="16" width="80" height="88" rx="4" stroke="#1890ff" strokeWidth="2" fill="white"/>
                  <rect x="34" y="40" width="52" height="30" rx="2" stroke="#1890ff" strokeWidth="2" fill="#e6f7ff"/>
                  <rect x="34" y="30" width="52" height="4" rx="1" stroke="#1890ff" strokeWidth="1" fill="#e6f7ff"/>
                  <rect x="34" y="38" width="52" height="4" rx="1" stroke="#1890ff" strokeWidth="1" fill="#e6f7ff"/>
                  <rect x="34" y="76" width="20" height="12" rx="2" stroke="#1890ff" strokeWidth="1" fill="#e6f7ff"/>
                  <rect x="66" y="76" width="20" height="12" rx="2" stroke="#1890ff" strokeWidth="1" fill="#e6f7ff"/>
                </svg>
              </div>
              <div className="empty-message">
                <FormattedMessage id="notebook.empty.message" />
              </div>
            </div>
          )}
        </div>
        
        <div className="create-options-container">
          <div className="create-options">
            <div className="create-button" onClick={createBlankNotebook}>
              <div className="create-button-content">
                <PlusOutlined className="create-icon" />
                <span><FormattedMessage id="notebook.create.blank" /></span>
              </div>
            </div>
            <div className="create-button" onClick={createExampleNotebook}>
              <div className="create-button-content">
                <FileOutlined className="create-icon" />
                <span><FormattedMessage id="notebook.create.example" /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 创建/编辑笔记本对话框 */}
      <Modal
        title={
          editingNotebook 
            ? intl.formatMessage({ id: 'notebook.edit.title' })
            : intl.formatMessage({ id: 'notebook.create.title' })
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingNotebook(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setIsModalVisible(false);
              setEditingNotebook(null);
            }}
          >
            <FormattedMessage id="common.cancel" />
          </Button>,
          <Button 
            key="submit" 
            type="primary"
            onClick={() => {
              if (editingNotebook) {
                handleEditNotebook();
              } else {
                // 参数表示是否是示例笔记本
                handleCreateNotebook(newNotebookName === intl.formatMessage({ id: 'notebook.example' }));
              }
            }}
          >
            {editingNotebook 
              ? <FormattedMessage id="common.save" />
              : <FormattedMessage id="common.create" />
            }
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item 
            label={intl.formatMessage({ id: 'notebook.name.label' })}
            required
            rules={[{ required: true, message: intl.formatMessage({ id: 'notebook.name.required' }) }]}
          >
            <Input 
              placeholder={intl.formatMessage({ id: 'notebook.name.placeholder' })}
              value={newNotebookName}
              onChange={e => setNewNotebookName(e.target.value)}
              autoFocus
              prefix={<FileOutlined style={{ color: '#1890ff' }} />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Welcome;