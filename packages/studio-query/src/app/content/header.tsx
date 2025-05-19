import React, { useRef, useState, Suspense } from 'react';
import { InsertRowAboveOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Segmented, Space, Flex, theme } from 'antd';
import { IStudioQueryProps, localStorageVars } from '../context';
import { useContext } from '../context';
import { Utils } from '@graphscope/studio-components';
import ToggleButton from './toggle-button';
import { DrawPatternModal } from '../../components/draw-pattern-modal';

interface IHeaderProps {
  connectComponent?: IStudioQueryProps['connectComponent'];
  displaySidebarPosition?: IStudioQueryProps['displaySidebarPosition'];
}

const options = [
  {
    icon: <InsertRowAboveOutlined />,
    value: 'tabs',
  },
  { icon: <OrderedListOutlined />, value: 'flow' },
];

const { useToken } = theme;

const ModeSwitch = () => {
  const { updateStore, store } = useContext();
  const { mode } = store;
  const onChangeMode = value => {
    updateStore(draft => {
      draft.mode = value;
      localStorage.setItem(localStorageVars.mode, value);
    });
  };
  return (
    <Segmented
      value={mode}
      options={[
        {
          icon: <InsertRowAboveOutlined />,
          value: 'tabs',
        },
        { icon: <OrderedListOutlined />, value: 'flow' },
      ]}
      onChange={onChangeMode}
    />
  );
};

const LanguageSwitch = () => {
  const { updateStore, store } = useContext();
  const { language } = store;
  const onChange = value => {
    updateStore(draft => {
      draft.language = value;
    });
  };
  return (
    <Segmented
      value={language}
      options={[
        {
          label: 'Gremlin',
          value: 'gremlin',
          disabled: language === 'cypher',
        },
        { label: 'Cypher', value: 'cypher', disabled: language === 'gremlin' },
      ]}
      onChange={onChange}
    />
  );
};

const Header: React.FunctionComponent<IHeaderProps> = props => {
  const { connectComponent, displaySidebarPosition } = props;
  const { store } = useContext();
  const { language } = store;
  const { token } = useToken();

  return (
    <div
      style={{
        width: '100%',
        padding: '10px 0px',
        backgroundColor: token.colorBgContainer,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}
    >
      <Flex justify="space-between" align="center">
        <Space>
          {displaySidebarPosition === 'left' && <ToggleButton displaySidebarPosition={displaySidebarPosition} />}
          <LanguageSwitch />
        </Space>

        {connectComponent}
        <Space>
          <DrawPatternModal />
          <ModeSwitch />
          {displaySidebarPosition === 'right' && <ToggleButton displaySidebarPosition={displaySidebarPosition} />}
        </Space>
      </Flex>
    </div>
  );
};

export default Header;
