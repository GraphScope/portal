import { FunctionComponent } from 'react';
import { Button, Space } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useContext } from '../useContext';

const AddLabel: FunctionComponent = () => {
  const { store, updateStore } = useContext();
  const { nodeList, edgeList, currentType, nodeActiveKey, edgeActiveKey, mode } = store;
  const disabled = mode == 'view';
  /** 添加点边模版 */
  const addLabel = () => {
    const id = uuidv4();
    updateStore(draft => {
      if (currentType == 'node') {
        draft.nodeActiveKey = id;
        draft.nodeList.push({
          key: id,
          label: 'undefined',
          properties: [],
        });
      }
      if (currentType === 'edge') {
        draft.edgeActiveKey = id;
        draft.edgeList.push({
          key: id,
          label: 'undefined',
          source: '',
          target: '',
          properties: [],
        });
      }
    });
  };

  /** 删除点边模版 */
  const deleteLabel = (type: string, key: string) => {
    const data = type == 'node' ? nodeList : edgeList;
    const newPanes = data.filter(pane => pane.key !== key);
    const activeKey = newPanes.length > 0 ? newPanes[newPanes.length - 1].key : '';

    updateStore(draft => {
      if (type === 'node') {
        //@ts-ignore
        draft.nodeList = newPanes;
        draft.nodeActiveKey = activeKey;
      }
      if (type === 'edge') {
        //@ts-ignore
        draft.edgeList = newPanes;
        draft.edgeActiveKey = activeKey;
      }
    });
  };

  const IS_EMPTY = currentType === 'node' ? nodeList.length === 0 : edgeList.length === 0;

  /** 空的时候展示为一个 */
  if (IS_EMPTY) {
    return (
      <Button disabled={disabled} style={{ width: '100%' }} type="dashed" onClick={addLabel} icon={<PlusOutlined />}>
        {currentType == 'node' ? <FormattedMessage id="Add Node" /> : <FormattedMessage id="Add Edge" />}
      </Button>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Space>
        <Button onClick={addLabel} disabled={disabled} icon={<PlusOutlined />}>
          {currentType == 'node' ? <FormattedMessage id="Add Node" /> : <FormattedMessage id="Add Edge" />}
        </Button>
        <Button
          disabled={disabled}
          icon={<DeleteOutlined />}
          onClick={() => deleteLabel(currentType, currentType == 'node' ? nodeActiveKey : edgeActiveKey)}
        />
      </Space>
    </div>
  );
};
export default AddLabel;
