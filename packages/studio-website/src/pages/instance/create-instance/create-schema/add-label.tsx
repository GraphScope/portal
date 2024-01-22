import { FunctionComponent } from 'react';
import { Button, Space } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { createFromIconfontCN } from '@ant-design/icons';
import { useContext } from '../useContext';
import Schema from './schema';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_q386omvduv.js',
});

const AddLabel: FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { nodeList, edgeList, currentType, detail, nodeActiveKey, edgeActiveKey } = store;
  /** 添加点边模版 */
  const addLabel = () => {
    if (currentType == 'node') {
      const newActiveKey = uuidv4();
      const node = [
        ...nodeList,
        {
          label: 'undefine',
          children: <Schema newActiveKey={newActiveKey} deleteNode={deleteLabel} />,
          key: newActiveKey,
        },
      ];
      updateStore(draft => {
        draft.nodeActiveKey = newActiveKey;
        draft.nodeList = node;
      });
    } else {
      const newActiveKey = uuidv4();
      const node = [
        ...edgeList,
        {
          label: 'undefine',
          children: <Schema newActiveKey={newActiveKey} deleteNode={deleteLabel} />,
          key: newActiveKey,
        },
      ];
      updateStore(draft => {
        draft.edgeActiveKey = newActiveKey;
        draft.edgeList = node;
      });
    }
  };

  /** 删除点边模版 */
  const deleteLabel = (val: string, key: string) => {
    let data = val == 'node' ? cloneDeep(nodeList) : cloneDeep(edgeList);
    const newPanes = data.filter(pane => pane.key !== key);
    if (val == 'node') {
      const activeKey = newPanes.length > 0 ? newPanes[newPanes.length - 1].key : '';
      updateStore(draft => {
        draft.nodeList = newPanes;
        draft.nodeActiveKey = activeKey;
      });
    } else {
      const activeKey = newPanes.length > 0 ? newPanes[newPanes.length - 1].key : '';
      updateStore(draft => {
        draft.edgeList = newPanes;
        draft.edgeActiveKey = activeKey;
      });
    }
  };
  return (
    <>
      {(currentType == 'node' ? nodeList.length : edgeList.length) == 0 ? (
        <Button disabled={detail} style={{ width: '100%', color: '#1650ff' }} type="dashed" onClick={addLabel}>
          + 添加{currentType == 'node' ? '点' : '边'}
        </Button>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Button onClick={addLabel} disabled={detail}>
              + 添加{currentType == 'node' ? '点' : '边'}
            </Button>
            <Button
              icon={<IconFont type="icon-delete1" />}
              onClick={() => deleteLabel(currentType, currentType == 'node' ? nodeActiveKey : edgeActiveKey)}
            />
          </Space>
        </div>
      )}
    </>
  );
};
export default AddLabel;
