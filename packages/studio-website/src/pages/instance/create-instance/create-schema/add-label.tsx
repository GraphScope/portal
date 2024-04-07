import { FunctionComponent } from 'react';
import { Button, Space } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { FormattedMessage } from 'react-intl';
import { PlusOutlined } from '@ant-design/icons';
import { useContext } from '../useContext';
import DeleteLabel from './delete-label';
const index = {
  edge: 0,
  node: 0,
};
const { GS_ENGINE_TYPE } = window;
const AddLabel: FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { nodeList, edgeList, currentType, mode } = store;
  const disabled = mode === 'view' && GS_ENGINE_TYPE === 'interactive';
  /** 添加点边模版 */
  const addLabel = () => {
    const id = uuidv4();
    updateStore(draft => {
      if (currentType === 'node') {
        draft.nodeActiveKey = id;
        /** 二次进入创建点未重置上次顺序 */
        index.node = nodeList.length === 0 ? 1 : index.node + 1;
        draft.nodeList.push({
          key: id,
          label: `vlabel_${index.node}`,
          properties: [],
          isDraft: true,
        });
      }
      if (currentType === 'edge') {
        draft.edgeActiveKey = id;
        /** 二次进入创建边未重置上次顺序 */
        index.edge = edgeList.length === 0 ? 1 : index.edge + 1;
        draft.edgeList.push({
          key: id,
          label: `elabel_${index.edge}`,
          source: '',
          target: '',
          properties: [],
          isDraft: true,
        });
      }
    });
  };

  const IS_EMPTY = currentType === 'node' ? nodeList.length === 0 : edgeList.length === 0;

  /** 空的时候展示为一个 */
  if (IS_EMPTY) {
    return (
      <Button disabled={disabled} style={{ width: '100%' }} type="dashed" onClick={addLabel} icon={<PlusOutlined />}>
        <FormattedMessage id="Add new" />
      </Button>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Space>
        <Button onClick={addLabel} disabled={disabled} icon={<PlusOutlined />}>
          <FormattedMessage id="Add new" />
        </Button>
        <DeleteLabel />
      </Space>
    </div>
  );
};
export default AddLabel;
