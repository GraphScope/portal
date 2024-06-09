import React, { useState } from 'react';
import { Breadcrumb, Divider, Typography, Tabs, Segmented, Select, Space, Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { GlobalOutlined } from '@ant-design/icons';
import type { BreadcrumbProps, TabsProps } from 'antd';
import { IGraph, useContext } from './useContext';
import { STATUS_MAP } from './const';
import { history } from 'umi';
import { Utils } from '@graphscope/studio-components';

interface IConnectModelProps {}

const SelectGraph: React.FunctionComponent<IConnectModelProps> = props => {
  const { store, updateStore } = useContext();
  const { graphs, graphId, currentnNav, draftGraph } = store;
  const options = ([draftGraph, ...graphs] as IGraph[])
    .filter(item => {
      return Object.keys(item).length > 0;
    })
    .map(item => {
      return {
        label: (
          <Space>
            <GlobalOutlined style={{ color: STATUS_MAP[item.status].color }} />
            {item.name}
          </Space>
        ),
        value: item.id,
      };
    });

  const [open, setOpen] = useState(false);

  const handleConnect = () => {};

  const handleChange = (value: string) => {
    updateStore(draft => {
      draft.graphId = value;
    });
    const { pathname } = location;
    const { searchParams } = Utils.getSearchParams();
    searchParams.set('graph_id', value);
    const href = `${pathname}?${searchParams.toString()}`;
    history.push(href);
  };
  const handleCreate = () => {};

  return (
    <div>
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
                  Connect
                </Button>
              </>
            )}
          </>
        )}
        options={options}
      />

      <Modal
        title="Connect"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={'80%'}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
    </div>
  );
};

export default SelectGraph;
