import * as React from 'react';
import { Button, Dropdown, Typography, MenuProps, Tooltip, Checkbox } from 'antd';
import { MoreOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useContext, useApis } from '@graphscope/studio-graph';
interface ISaveSelectedProps {}

const SelectAll: React.FunctionComponent<ISaveSelectedProps> = props => {
  const { store, updateStore } = useContext();
  const { selectNodes, data } = store;

  const handleChange = e => {
    const { checked } = e.target;
    updateStore(draft => {
      const newSelectedNodes = checked ? data.nodes : [];
      draft.selectNodes = newSelectedNodes;
      draft.nodeStatus = newSelectedNodes.reduce((acc, cur) => {
        acc[cur.id] = {
          selected: true,
        };
        return acc;
      }, {});
    });
  };

  const indeterminate = selectNodes.length > 0 && selectNodes.length < data.nodes.length;
  const checkAll = selectNodes.length === data.nodes.length;

  return (
    <Tooltip title="Check all items" placement="top">
      <Button
        type="text"
        icon={<Checkbox onChange={handleChange} indeterminate={indeterminate} checked={checkAll}></Checkbox>}
      ></Button>
    </Tooltip>
  );
};

export default SelectAll;
