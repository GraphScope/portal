import React, { useState } from 'react';
import { Breadcrumb, Divider, Typography, Tabs, Segmented, Select, Space, Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { GlobalOutlined } from '@ant-design/icons';
import type { BreadcrumbProps, TabsProps } from 'antd';
import { useContext } from './useContext';
import { STATUS_MAP } from './const';
import { history } from 'umi';
import { Utils } from '@graphscope/studio-components';

interface IConnectModelProps {}
const defaultOptions = [
  {
    value: 'movie-1',
    label: 'movie-1',
  },
];

const SelectGraph: React.FunctionComponent<IConnectModelProps> = props => {
  const { store, updateStore } = useContext();
  const { graphs, graphId } = store;
  const options = graphs.map(item => {
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
  const handleClick = () => {};
  const handleConnect = () => {};
  // console.log('graphId', graphId, options);
  const handleChange = value => {
    updateStore(draft => {
      draft.graphId = value;
    });
    const { pathname } = location;
    const { path, searchParams } = Utils.getSearchParams();
    searchParams.set('graph_id', value);
    const href = `${pathname}?${searchParams.toString()}`;
    console.log(searchParams.toString(), pathname, href);
    history.push(href);
  };
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
            <Divider style={{ margin: '4px 0px' }} />

            <Button type="default" onClick={handleConnect} style={{ width: '100%' }}>
              Connect
            </Button>
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
