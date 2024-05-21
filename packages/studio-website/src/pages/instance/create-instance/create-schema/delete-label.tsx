import { FunctionComponent } from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useContext } from '../useContext';
import { deleteVertexOrEdge } from './service';
import { searchParamOf } from '@/components/utils/index';
const { GS_ENGINE_TYPE } = window;

const DeleteLabel: FunctionComponent = () => {
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
  const disabled = mode === 'view' && GS_ENGINE_TYPE === 'interactive';
  /** 删除点边模版 */
  const data = currentType === 'node' ? nodeList : edgeList;
  const key = currentType === 'node' ? nodeActiveKey : edgeActiveKey;
  const options = data.filter(pane => pane.key === key);
  const isDraft = options.length && options[0].isDraft;
  const deleteLabel = async () => {
    const newPanes = data.filter(pane => pane.key !== key);
    const typeName = data.filter(pane => pane.key === key)[0].label;
    const activeKey = newPanes.length > 0 ? newPanes[newPanes.length - 1].key : '';
    let isDelete = false;
    /** isDraft===true 新建 */
    if (!isDraft && GS_ENGINE_TYPE === 'groot') {
      const graph_id = searchParamOf('graph_id') || '';
      const res = await deleteVertexOrEdge(currentType, graph_id, { typeName, nodes: nodeList, edges: options });
      isDelete = (res && res[0].status === 500) || false;
    }

    if (!isDelete) {
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
    }
  };
  if (GS_ENGINE_TYPE === 'groot') {
    return (
      <>
        {isDraft ? (
          <Button disabled={disabled} icon={<DeleteOutlined />} onClick={deleteLabel} />
        ) : (
          <Popconfirm
            title="Deleting a label"
            description="Are you sure to delete this label?"
            onConfirm={deleteLabel}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <Button disabled={disabled} icon={<DeleteOutlined />} />
          </Popconfirm>
        )}
      </>
    );
  }
  if (GS_ENGINE_TYPE === 'interactive') {
    return <Button disabled={disabled} icon={<DeleteOutlined />} onClick={deleteLabel} />;
  }
};
export default DeleteLabel;
