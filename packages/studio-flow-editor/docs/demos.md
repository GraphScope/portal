---
order: 8
title: 进阶示例
---

# 进阶示例

本文档提供了一些 `@graphscope/studio-flow-editor` 的进阶使用示例，帮助您深入了解如何利用这个库构建复杂的图编辑应用。

## 示例一：节点和边标签编辑器

这个示例展示了如何实现自定义的节点和边标签编辑功能。

```jsx
import React, { useState } from 'react';
import { GraphProvider, GraphCanvas, useGraphStore, useAddNode, useClearCanvas } from '@graphscope/studio-flow-editor';

// 标签编辑面板组件
const LabelEditor = () => {
  const { store, updateStore } = useGraphStore();
  const { currentId, currentType, nodes, edges } = store;
  const [labelValue, setLabelValue] = useState('');

  // 当选中元素变化时，更新输入框的值
  React.useEffect(() => {
    if (currentId && currentType) {
      const currentItem =
        currentType === 'nodes' ? nodes.find(item => item.id === currentId) : edges.find(item => item.id === currentId);

      if (currentItem && currentItem.data) {
        setLabelValue(currentItem.data.label || '');
      }
    }
  }, [currentId, currentType, nodes, edges]);

  // 没有选中任何元素时不显示编辑器
  if (!currentId) {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          padding: '8px',
          background: '#f5f5f5',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#999',
        }}
      >
        请选择一个节点或边来编辑标签
      </div>
    );
  }

  // 处理标签变更
  const handleLabelChange = e => {
    setLabelValue(e.target.value);
  };

  // 应用标签变更
  const applyLabelChange = () => {
    updateStore(draft => {
      if (currentType === 'nodes') {
        const node = draft.nodes.find(n => n.id === currentId);
        if (node) {
          node.data.label = labelValue;
        }
      } else {
        const edge = draft.edges.find(e => e.id === currentId);
        if (edge) {
          edge.data.label = labelValue;
        }
      }
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        padding: '12px',
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 10,
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>编辑 {currentType === 'nodes' ? '节点' : '边'} 标签</div>
      <input
        type="text"
        value={labelValue}
        onChange={handleLabelChange}
        style={{
          padding: '6px 8px',
          border: '1px solid #d9d9d9',
          borderRadius: '2px',
          width: '200px',
        }}
      />
      <button
        onClick={applyLabelChange}
        style={{
          padding: '6px 12px',
          background: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '2px',
          cursor: 'pointer',
        }}
      >
        应用
      </button>
    </div>
  );
};

// 工具栏组件
const Toolbar = () => {
  const { handleAddVertex } = useAddNode();
  const { handleClear } = useClearCanvas();

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
      }}
    >
      <button
        onClick={() => handleAddVertex({ x: 100, y: 100 })}
        style={{
          padding: '6px 12px',
          background: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '2px',
          cursor: 'pointer',
        }}
      >
        添加节点
      </button>
      <button
        onClick={handleClear}
        style={{
          padding: '6px 12px',
          background: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '2px',
          cursor: 'pointer',
        }}
      >
        删除
      </button>
    </div>
  );
};

// 应用组件
const App = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <GraphProvider>
        <GraphCanvas>
          <Toolbar />
          <LabelEditor />
        </GraphCanvas>
      </GraphProvider>
    </div>
  );
};

export default App;
```

## 示例二：生成Cypher查询语句

这个示例展示了如何根据图编辑器中的节点和边生成Cypher查询语句。

```jsx
import React, { useState, useEffect } from 'react';
import { MiniMap, Background } from 'reactflow';
import { GraphProvider, GraphCanvas, useGraphStore, useAddNode, useClearCanvas } from '@graphscope/studio-flow-editor';

// Cypher生成器组件
const CypherGenerator = () => {
  const { store } = useGraphStore();
  const { nodes, edges } = store;
  const [cypherQuery, setCypherQuery] = useState('');

  // 当节点或边变化时，生成Cypher查询
  useEffect(() => {
    if (nodes.length === 0) {
      setCypherQuery('// 请添加节点');
      return;
    }

    // 生成MATCH语句
    const matchClauses = nodes.map((node, index) => {
      // 使用节点标签作为节点类型，默认为"Node"
      const nodeLabel = node.data.label || 'Node';
      // 使用"n0", "n1"等作为变量名
      const variableName = `n${index}`;

      // 生成属性对象
      const properties = node.data.properties
        ? Object.entries(node.data.properties)
            .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
            .join(', ')
        : '';

      const propertiesClause = properties ? `{${properties}}` : '';

      // 返回完整的匹配模式
      return `MATCH (${variableName}:${nodeLabel.replace(/\s+/g, '_')}${propertiesClause})`;
    });

    // 生成关系语句(WHERE子句)
    const whereClauses = edges
      .map((edge, index) => {
        // 找到源节点和目标节点的索引
        const sourceIndex = nodes.findIndex(node => node.id === edge.source);
        const targetIndex = nodes.findIndex(node => node.id === edge.target);

        if (sourceIndex === -1 || targetIndex === -1) return null;

        // 使用边标签作为关系类型，默认为"RELATES_TO"
        const relationshipType = (edge.data.label || 'RELATES_TO').replace(/\s+/g, '_');

        // 返回关系条件
        return `MATCH (n${sourceIndex})-[:${relationshipType}]->(n${targetIndex})`;
      })
      .filter(Boolean); // 过滤掉无效的关系

    // 生成RETURN语句
    const returnClause = `RETURN ${nodes.map((_, index) => `n${index}`).join(', ')}`;

    // 组合完整查询
    const query = [...matchClauses, ...whereClauses, returnClause].join('\n');

    setCypherQuery(query);
  }, [nodes, edges]);

  // 复制查询到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(cypherQuery)
      .then(() => {
        alert('已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        padding: '12px',
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '300px',
        maxHeight: '300px',
        overflow: 'auto',
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span>Cypher查询</span>
        <button
          onClick={copyToClipboard}
          style={{
            padding: '4px 8px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          复制
        </button>
      </div>
      <pre
        style={{
          background: '#f5f5f5',
          padding: '8px',
          margin: 0,
          borderRadius: '2px',
          overflow: 'auto',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        {cypherQuery}
      </pre>
    </div>
  );
};

// 工具栏组件
const Toolbar = () => {
  const { handleAddVertex } = useAddNode();
  const { handleClear } = useClearCanvas();
  const { store, updateStore } = useGraphStore();

  // 添加示例图
  const addExampleGraph = () => {
    // 先清空现有图
    updateStore(draft => {
      draft.nodes = [];
      draft.edges = [];
    });

    // 添加示例节点
    const personNode = {
      id: 'node-1',
      position: { x: 100, y: 100 },
      type: 'graph-node',
      data: {
        label: 'Person',
        properties: {
          name: 'Alice',
          age: 30,
        },
      },
    };

    const companyNode = {
      id: 'node-2',
      position: { x: 300, y: 100 },
      type: 'graph-node',
      data: {
        label: 'Company',
        properties: {
          name: 'ACME Corp',
          founded: 2010,
        },
      },
    };

    const productNode = {
      id: 'node-3',
      position: { x: 300, y: 250 },
      type: 'graph-node',
      data: {
        label: 'Product',
        properties: {
          name: 'Widget X',
          price: 99.99,
        },
      },
    };

    // 添加示例边
    const worksAtEdge = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      type: 'graph-edge',
      data: { label: 'WORKS_AT' },
    };

    const createdEdge = {
      id: 'edge-2',
      source: 'node-2',
      target: 'node-3',
      type: 'graph-edge',
      data: { label: 'CREATED' },
    };

    const purchasedEdge = {
      id: 'edge-3',
      source: 'node-1',
      target: 'node-3',
      type: 'graph-edge',
      data: { label: 'PURCHASED' },
    };

    // 更新图
    updateStore(draft => {
      draft.nodes = [personNode, companyNode, productNode];
      draft.edges = [worksAtEdge, createdEdge, purchasedEdge];
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
      }}
    >
      <button
        onClick={() => handleAddVertex({ x: 100, y: 100 })}
        style={{
          padding: '6px 12px',
          background: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '2px',
          cursor: 'pointer',
        }}
      >
        添加节点
      </button>
      <button
        onClick={addExampleGraph}
        style={{
          padding: '6px 12px',
          background: '#52c41a',
          color: 'white',
          border: 'none',
          borderRadius: '2px',
          cursor: 'pointer',
        }}
      >
        添加示例图
      </button>
      <button
        onClick={handleClear}
        style={{
          padding: '6px 12px',
          background: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '2px',
          cursor: 'pointer',
        }}
      >
        清空画布
      </button>
    </div>
  );
};

// 节点数据面板
const NodeDataPanel = () => {
  const { store, updateStore } = useGraphStore();
  const { currentId, currentType, nodes } = store;
  const [properties, setProperties] = useState({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // 当选中节点变化时，更新属性面板
  useEffect(() => {
    if (currentId && currentType === 'nodes') {
      const currentNode = nodes.find(node => node.id === currentId);
      if (currentNode && currentNode.data) {
        setProperties(currentNode.data.properties || {});
      } else {
        setProperties({});
      }
    } else {
      setProperties({});
    }
  }, [currentId, currentType, nodes]);

  // 没有选中节点时不显示面板
  if (!currentId || currentType !== 'nodes') {
    return null;
  }

  // 添加新属性
  const addProperty = () => {
    if (!newKey.trim()) return;

    // 尝试转换为数字
    let parsedValue = newValue;
    if (!isNaN(Number(newValue))) {
      parsedValue = Number(newValue);
    }

    const updatedProperties = {
      ...properties,
      [newKey]: parsedValue,
    };

    setProperties(updatedProperties);
    updateStore(draft => {
      const node = draft.nodes.find(n => n.id === currentId);
      if (node) {
        node.data.properties = updatedProperties;
      }
    });

    // 清空输入框
    setNewKey('');
    setNewValue('');
  };

  // 删除属性
  const removeProperty = key => {
    const { [key]: _, ...rest } = properties;
    setProperties(rest);

    updateStore(draft => {
      const node = draft.nodes.find(n => n.id === currentId);
      if (node) {
        node.data.properties = rest;
      }
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        left: '10px',
        padding: '12px',
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '300px',
        zIndex: 10,
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>节点属性编辑</div>

      {/* 现有属性 */}
      <div style={{ marginBottom: '12px' }}>
        {Object.entries(properties).length === 0 ? (
          <div style={{ color: '#999', fontSize: '12px' }}>暂无属性</div>
        ) : (
          Object.entries(properties).map(([key, value]) => (
            <div
              key={key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
                padding: '4px',
                background: '#f5f5f5',
                borderRadius: '2px',
              }}
            >
              <div>
                <span style={{ fontWeight: 'bold' }}>{key}:</span> {String(value)}
              </div>
              <button
                onClick={() => removeProperty(key)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4d4f',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                删除
              </button>
            </div>
          ))
        )}
      </div>

      {/* 添加新属性 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder="属性名"
            style={{
              padding: '6px 8px',
              border: '1px solid #d9d9d9',
              borderRadius: '2px',
              flex: 1,
            }}
          />
          <input
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            placeholder="属性值"
            style={{
              padding: '6px 8px',
              border: '1px solid #d9d9d9',
              borderRadius: '2px',
              flex: 1,
            }}
          />
        </div>
        <button
          onClick={addProperty}
          style={{
            padding: '6px 0',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        >
          添加属性
        </button>
      </div>
    </div>
  );
};

// 应用组件
const App = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <GraphProvider>
        <GraphCanvas>
          <Toolbar />
          <CypherGenerator />
          <NodeDataPanel />
          <MiniMap />
          <Background />
        </GraphCanvas>
      </GraphProvider>
    </div>
  );
};

export default App;
```

## 示例三：结合多个功能的完整应用

以下是一个结合了多项功能的完整应用示例，包括：

- 节点和边标签编辑
- 节点属性编辑
- Cypher查询生成
- 图数据导入/导出
- 自定义样式

```jsx
import React, { useState, useEffect } from 'react';
import {
  GraphProvider,
  GraphCanvas,
  useGraphStore,
  useAddNode,
  useClearCanvas,
  useExportSvg,
} from '@graphscope/studio-flow-editor';

// 主应用组件
const GraphApplication = () => {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <GraphProvider>
        <GraphCanvas>
          <MainToolbar />
          <PropertiesPanel />
          <CypherPanel />
          <StatusBar />
        </GraphCanvas>
      </GraphProvider>
    </div>
  );
};

// 主工具栏
const MainToolbar = () => {
  const {handleAddVertex} = useAddNode();
  const { handleClear } = useClearCanvas();
  const {exportSvg} = useExportSvg();
  const { store, updateStore } = useGraphStore();

  // 导出图数据为JSON
  const exportJSON = () => {
    const { nodes, edges } = store;
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', 'graph-data.json');
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
  };

  // 导入JSON数据
  const importJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = event => {
        try {
          const { nodes, edges } = JSON.parse(event.target.result);
          updateStore(draft => {
            draft.nodes = nodes;
            draft.edges = edges;
          });
        } catch (error) {
          console.error('导入失败:', error);
          alert('导入失败: ' + error.message);
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 10,
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '8px',
        display: 'flex',
        gap: '8px',
      }}
    >
      <button onClick={() => handleAddVertex()} style={buttonStyle}>
        添加节点
      </button>
      <button onClick={handleClear} style={{ ...buttonStyle, background: '#ff4d4f' }}>
        删除
      </button>
      <button onClick={() => exportSvg({ name: 'graph.svg' })} style={buttonStyle}>
        导出SVG
      </button>
      <button onClick={exportJSON} style={buttonStyle}>
        导出JSON
      </button>
      <button onClick={importJSON} style={buttonStyle}>
        导入JSON
      </button>
    </div>
  );
};

// 属性面板
const PropertiesPanel = () => {
  const { store, updateStore } = useGraphStore();
  const { currentId, currentType, nodes, edges } = store;
  const [labelValue, setLabelValue] = useState('');
  const [properties, setProperties] = useState({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // 当选中元素变化时，更新面板
  useEffect(() => {
    if (currentId && currentType) {
      const currentItem =
        currentType === 'nodes' ? nodes.find(item => item.id === currentId) : edges.find(item => item.id === currentId);

      if (currentItem && currentItem.data) {
        setLabelValue(currentItem.data.label || '');
        setProperties(currentItem.data.properties || {});
      }
    } else {
      setLabelValue('');
      setProperties({});
    }
  }, [currentId, currentType, nodes, edges]);

  if (!currentId) return null;

  // 更新标签
  const updateLabel = () => {
    updateStore(draft => {
      if (currentType === 'nodes') {
        const node = draft.nodes.find(n => n.id === currentId);
        if (node) {
          node.data.label = labelValue;
        }
      } else {
        const edge = draft.edges.find(e => e.id === currentId);
        if (edge) {
          edge.data.label = labelValue;
        }
      }
    });
  };

  // 添加属性
  const addProperty = () => {
    if (!newKey.trim()) return;

    // 尝试转换为数字
    let parsedValue = newValue;
    if (!isNaN(Number(newValue))) {
      parsedValue = Number(newValue);
    }

    const updatedProperties = {
      ...properties,
      [newKey]: parsedValue,
    };

    setProperties(updatedProperties);
    updateStore(draft => {
      if (currentType === 'nodes') {
        const node = draft.nodes.find(n => n.id === currentId);
        if (node) {
          node.data.properties = updatedProperties;
        }
      } else {
        const edge = draft.edges.find(e => e.id === currentId);
        if (edge) {
          edge.data.properties = updatedProperties;
        }
      }
    });

    setNewKey('');
    setNewValue('');
  };

  // 删除属性
  const removeProperty = key => {
    const { [key]: _, ...rest } = properties;
    setProperties(rest);

    updateStore(draft => {
      if (currentType === 'nodes') {
        const node = draft.nodes.find(n => n.id === currentId);
        if (node) {
          node.data.properties = rest;
        }
      } else {
        const edge = draft.edges.find(e => e.id === currentId);
        if (edge) {
          edge.data.properties = rest;
        }
      }
    });
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10,
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '12px',
        width: '300px',
      }}
    >
      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
        {currentType === 'nodes' ? '节点属性' : '边属性'}
      </div>

      {/* 标签编辑 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>标签:</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={labelValue}
            onChange={e => setLabelValue(e.target.value)}
            style={{
              padding: '6px 8px',
              border: '1px solid #d9d9d9',
              borderRadius: '2px',
              flex: 1,
            }}
          />
          <button onClick={updateLabel} style={buttonStyle}>
            更新
          </button>
        </div>
      </div>

      {/* 属性列表 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>属性:</div>
        {Object.entries(properties).length === 0 ? (
          <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>暂无属性</div>
        ) : (
          <div style={{ marginBottom: '8px' }}>
            {Object.entries(properties).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                  padding: '4px',
                  background: '#f5f5f5',
                  borderRadius: '2px',
                }}
              >
                <div>
                  <span style={{ fontWeight: 'bold' }}>{key}:</span> {String(value)}
                </div>
                <button
                  onClick={() => removeProperty(key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff4d4f',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 添加新属性 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="属性名"
              style={{
                padding: '6px 8px',
                border: '1px solid #d9d9d9',
                borderRadius: '2px',
                flex: 1,
              }}
            />
            <input
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              placeholder="属性值"
              style={{
                padding: '6px 8px',
                border: '1px solid #d9d9d9',
                borderRadius: '2px',
                flex: 1,
              }}
            />
          </div>
          <button onClick={addProperty} style={buttonStyle}>
            添加属性
          </button>
        </div>
      </div>
    </div>
  );
};

// Cypher查询面板
const CypherPanel = () => {
  const { store } = useGraphStore();
  const { nodes, edges } = store;
  const [cypherQuery, setCypherQuery] = useState('');

  // 当节点或边变化时，生成Cypher查询
  useEffect(() => {
    if (nodes.length === 0) {
      setCypherQuery('// 请添加节点');
      return;
    }

    // 生成MATCH语句
    const matchClauses = nodes.map((node, index) => {
      const nodeLabel = node.data.label || 'Node';
      const variableName = `n${index}`;

      // 生成属性对象
      let propertiesClause = '';
      if (node.data.properties && Object.keys(node.data.properties).length > 0) {
        const properties = Object.entries(node.data.properties)
          .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
          .join(', ');
        propertiesClause = `{${properties}}`;
      }

      return `MATCH (${variableName}:${nodeLabel.replace(/\s+/g, '_')}${propertiesClause})`;
    });

    // 生成关系语句
    const whereClauses = edges
      .map((edge, index) => {
        const sourceIndex = nodes.findIndex(node => node.id === edge.source);
        const targetIndex = nodes.findIndex(node => node.id === edge.target);

        if (sourceIndex === -1 || targetIndex === -1) return null;

        const relationshipType = (edge.data.label || 'RELATES_TO').replace(/\s+/g, '_');

        // 生成关系属性
        let propertiesClause = '';
        if (edge.data.properties && Object.keys(edge.data.properties).length > 0) {
          const properties = Object.entries(edge.data.properties)
            .map(([key, value]) => `${key}: ${typeof value === 'string' ? `"${value}"` : value}`)
            .join(', ');
          propertiesClause = `{${properties}}`;
        }

        return `MATCH (n${sourceIndex})-[:${relationshipType}${propertiesClause}]->(n${targetIndex})`;
      })
      .filter(Boolean);

    // 生成RETURN语句
    const returnClause = `RETURN ${nodes.map((_, index) => `n${index}`).join(', ')}`;

    // 组合完整查询
    const query = [...matchClauses, ...whereClauses, returnClause].join('\n');

    setCypherQuery(query);
  }, [nodes, edges]);

  // 复制查询到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(cypherQuery)
      .then(() => {
        alert('已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '40px',
        left: '10px',
        padding: '12px',
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '400px',
        maxHeight: '300px',
        overflow: 'auto',
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <span>Cypher查询</span>
        <button onClick={copyToClipboard} style={buttonStyle}>
          复制
        </button>
      </div>
      <pre
        style={{
          background: '#f5f5f5',
          padding: '8px',
          margin: 0,
          borderRadius: '2px',
          overflow: 'auto',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        {cypherQuery}
      </pre>
    </div>
  );
};

// 状态栏
const StatusBar = () => {
  const { store } = useGraphStore();
  const { nodes, edges, currentId, currentType } = store;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid #d9d9d9',
        fontSize: '12px',
      }}
    >
      <div>
        节点: {nodes.length} | 边: {edges.length}
      </div>
      <div>{currentId && `当前选中: ${currentType === 'nodes' ? '节点' : '边'} ${currentId}`}</div>
    </div>
  );
};

// 共用样式
const buttonStyle = {
  padding: '6px 12px',
  background: '#1890ff',
  color: 'white',
  border: 'none',
  borderRadius: '2px',
  cursor: 'pointer',
};

export default GraphApplication;
```
