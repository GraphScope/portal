import * as React from 'react';
import { Input, Tree, Button, Space ,Checkbox} from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { FolderOpenOutlined, DownOutlined, EditOutlined, EditTwoTone } from '@ant-design/icons';
interface IStatementListProps {}
const { useState, useRef } = React;
const treeData = [
  {
    title: 'parent 01',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0' },
      { title: 'leaf 0-1', key: '0-0-1' },
    ],
  },
  {
    title: 'parent 11',
    key: '0-1',
    level: 1,
    children: [
      { title: 'leaf 1-0', key: '0-1-0' },
      { title: 'leaf 1-1', key: '0-1-1' },
    ],
  },
];

const StatementList: React.FunctionComponent<IStatementListProps> = props => {
  const inputRef = useRef();
  const [gData, setGData] = useState(treeData);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checked, setChecked] = useState(true);
  const onDragEnter: TreeProps['onDragEnter'] = info => {
    console.log(info);
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps['onDrop'] = info => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...gData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setGData(data);
  };
  const closeNode = data =>
    data.forEach(item => {
      item.isEditable = false;
      if (item.children) {
        closeNode(item.children);
      }
    });
  const onAdd = key => {
    const data = [...gData];
    data.push({
      title: 'default',
      key: `0-${data.length}`, // 这个 key 应该是唯一的
      children: [],
    });
    setExpandedKeys([...expandedKeys, key]);
    setGData(data);
  };
  const onEdit = async key => {
    const data = [...gData];
    closeNode(data);
    loop(data, key, item => {
      item.editValue = item.title;
      item.isEditable = true;
    });
    await setGData(data);
    await inputRef.current?.focus();
  };
  // input 改变
  const onChange = (e, key) => {
    const data = [...gData];
    loop(data, key, item => {
      item.editValue = e.target.value;
    });
    setGData(data);
  };

  // 保存
  const onSave = key => {
    const data = [...gData];
    loop(data, key, item => {
      item.isEditable = false;
      item.title = item.editValue || '';
    });
    setGData(data);
  };
  // 找到节点数据并回调处理节点方法 callback回调: node-当前节点 i-当前节点序号 data-包含当前节点的节点组 parentNode 当前节点父节点
  const loop = (
    data: DataNode[],
    key: React.Key,
    callback: (node: DataNode, i: number, data: DataNode[], parent?: DataNode) => void,
    parentNode?: DataNode,
  ) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return callback(data[i], i, data, parentNode);
      }
      if (data[i].children) {
        loop(data[i].children!, key, callback, data[i]);
      }
    }
  };
  // 全选/反选
  const selectAll = () => {
    if (checked) {
      let keys = [];
      const collectKeys = node => {
        if (node.key) {
          keys.push(node.key);
        }
        if (node.children) {
          node.children.forEach(collectKeys);
        }
      };
      gData.forEach(collectKeys);
      setExpandedKeys(keys);
    } else {
      setExpandedKeys([]);
    }
    setChecked(!checked);
  };
  const delNode = () => {
    const filterArray = data => {
      return data.reduce((acc, item) => {
        if (expandedKeys.includes(item.key)) {
          return acc;
        }
        if (item.children) {
          item.children = filterArray(item.children);
        }
        acc.push(item);
        return acc;
      }, []);
    };
    setGData(filterArray(gData));
    setExpandedKeys([]);
    setChecked(true)
  };
  return (
    <div>
      <Space style={{marginBottom:'16px'}}>
        <Button size='small' onClick={() => onAdd(Math.random())}>Add</Button>
        <Checkbox checked={!checked} onClick={() => selectAll()}>Select all</Checkbox>
        <Button size='small' onClick={() => delNode()}>Delete</Button>
      </Space>
      <Tree
        checkable
        blockNode
        multiple
        showLine={gData?.length>1 ? true :false}
        defaultExpandAll
        draggable
        defaultExpandedKeys={expandedKeys}
        checkedKeys={expandedKeys}
        onCheck={checkedKeys => setExpandedKeys(checkedKeys)}
        switcherIcon={<DownOutlined />}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={gData}
        titleRender={(nodeData: DataNode) => {
          if (nodeData.isEditable) {
            return (
              <div style={{ height: '32px' }}>
                <FolderOpenOutlined style={{ marginRight: '5px' }} />
                <Input
                  ref={inputRef}
                  style={{ display: 'inline-block', width: '90%', whiteSpace: 'nowrap' }}
                  value={nodeData.editValue || ''}
                  onChange={e => onChange(e, nodeData.key)}
                  onBlur={() => onSave(nodeData.key)}
                />
              </div>
            );
          } else {
            return (
              <div
                style={{ display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap', height: '32px' }}
                onClick={e => e.stopPropagation()}
              >
                <span style={{ marginTop: '4px' }}>
                  <FolderOpenOutlined style={{ marginRight: '5px' }} />
                  <span>{nodeData.title}</span>
                </span>
                <EditTwoTone onClick={() => onEdit(nodeData.key)} style={{ paddingRight: '12px' }} />
              </div>
            );
          }
        }}
      />
    </div>
  );
};

export default StatementList;
