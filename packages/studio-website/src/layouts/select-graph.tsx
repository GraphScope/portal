import React, { useState } from 'react';
import { Divider, Select, Space, Button, Modal } from 'antd';
import { IGraph, useContext } from './useContext';
import { STATUS_MAP } from './const';
import { Utils } from '@graphscope/studio-components';
import { ConnectEndpoint } from '@graphscope/studio-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import Versions from '../pages/query/versions';
interface IConnectModelProps {
  id: string;
}

const SelectGraph: React.FunctionComponent<IConnectModelProps> = props => {
  const { store, updateStore } = useContext(props.id);
  const { graphs, graphId, currentnNav, draftGraph } = store;

  const options = ([draftGraph, ...graphs] as IGraph[])
    .filter(item => {
      return Object.keys(item).length > 0;
    })
    .map(item => {
      return {
        label: (
          <Space>
            <FontAwesomeIcon icon={faCoins} style={{ color: STATUS_MAP[item.status].color }} />
            {item.name}
          </Space>
        ),
        value: item.id,
      };
    });

  const [open, setOpen] = useState(false);

  const handleConnect = () => {
    setOpen(true);
  };

  const handleChange = (value: string) => {
    Utils.setSearchParams({
      graph_id: value,
    });
    updateStore(draft => {
      draft.graphId = value;
    });
  };

  const onFinish = () => {
    setOpen(false);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Space>
        <Select
          variant="borderless"
          style={{ flex: 1, minWidth: '120px' }}
          placeholder="Choose graph instance"
          value={graphId}
          onChange={handleChange}
          dropdownRender={menu => (
            <>
              {menu}
              {currentnNav === '/querying' && (
                <>
                  <Divider style={{ margin: '4px 0px' }} />
                  <Button type="default" onClick={handleConnect} style={{ width: '100%' }}>
                    Endpoint
                  </Button>
                </>
              )}
            </>
          )}
          options={options}
        />
        {window.GS_ENGINE_TYPE === 'gart' && <Versions />}
      </Space>

      <Modal
        centered
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title={null}
        open={open}
        footer={null}
        closable={false}
        width={1000}
      >
        <ConnectEndpoint onConnect={onFinish} onClose={onClose} />
      </Modal>
    </div>
  );
};

export default SelectGraph;
