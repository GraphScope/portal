import React, { useRef } from 'react';
import { Button, Input, theme, InputRef, Space, Flex } from 'antd';
import { Utils } from '@graphscope/studio-components';
import SettingParcel from '../../components/setting-parcel';
import { SaveOutlined } from '@ant-design/icons';
const { useToken } = theme;
const Coordinator: React.FunctionComponent = () => {
  const inputRef = useRef<InputRef>(null);
  const handleSave = () => {
    if (inputRef) {
      Utils.storage.set('coordinator', inputRef.current?.input?.value || location.origin);
      window.location.reload();
    }
  };
  const defaultValue = Utils.storage.get<string>('coordinator') || location.origin;
  return (
    <SettingParcel
      style={{ margin: '0px' }}
      title="Coordinator URL"
      text="refers to the address of the GraphScope engine. If you have also started the GraphScope engine locally using Docker."
      leftModule={
        <Flex gap={12}>
          <Input ref={inputRef} defaultValue={defaultValue} style={{ width: '100%' }} />
          <Button onClick={handleSave} icon={<SaveOutlined />}>
            Save and Reload website
          </Button>
        </Flex>
      }
    />
  );
};

export default Coordinator;
