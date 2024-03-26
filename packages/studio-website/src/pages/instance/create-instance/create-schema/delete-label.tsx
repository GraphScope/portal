import { FunctionComponent } from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useContext } from '../useContext';
import { deleteVertexOrEdge } from './service';
const { GS_ENGINE_TYPE } = window;
type IDeleteGrootLabel = {};
const DeleteLabel: FunctionComponent<IDeleteGrootLabel> = props => {
  const { store, updateStore } = useContext();
  const {
    mode,
    nodeList,
    edgeList,
    currentType,
    graphName /** 查询状态默认第一项key,不然删除查不到key */,
    nodeActiveKey = nodeList[0]?.key,
    edgeActiveKey = edgeList[0]?.key,
  } = store;
  const disabled = mode == 'view' && GS_ENGINE_TYPE === 'interactive';
  /** 删除点边模版 */
  const deleteLabel = async () => {
    const key = currentType == 'node' ? nodeActiveKey : edgeActiveKey;
    const data = currentType == 'node' ? nodeList : edgeList;
    const newPanes = data.filter(pane => pane.key !== key);
    const activeKey = newPanes.length > 0 ? newPanes[newPanes.length - 1].key : '';
    const options = data.filter(pane => pane.key == key);
    const typeName = data.filter(pane => pane.key == key)[0].label;
    /** isDraft===true 新建 */
    const isDraft = options && options[0].isDraft;
    if (!isDraft) {
      await deleteVertexOrEdge(currentType, graphName, { typeName, nodes: nodeList, edges: options });
    }
    await updateStore(draft => {
      if (currentType === 'node') {
        //@ts-ignore
        draft.nodeList = newPanes;
        draft.nodeActiveKey = activeKey;
      }
      if (currentType === 'edge') {
        //@ts-ignore
        draft.edgeList = newPanes;
        draft.edgeActiveKey = activeKey;
      }
    });
  };
  if (GS_ENGINE_TYPE === 'groot') {
    return (
      <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this task?"
        onConfirm={deleteLabel}
        onCancel={() => {}}
        okText="Yes"
        cancelText="No"
      >
        <Button disabled={disabled} icon={<DeleteOutlined />} />
      </Popconfirm>
    );
  }
  if (GS_ENGINE_TYPE === 'interactive') {
    return <Button disabled={disabled} icon={<DeleteOutlined />} onClick={deleteLabel} />;
  }
};
export default DeleteLabel;