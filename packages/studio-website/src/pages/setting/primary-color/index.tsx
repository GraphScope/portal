import React from 'react';
import { ColorPicker, Flex, Col, theme } from 'antd';
import SelectColor from './select-color';
import { useThemeProvider } from '@graphscope/studio-components';
import SettingParcel from '../../../components/setting-parcel';

const { useToken } = theme;
const PrimaryColor: React.FunctionComponent = () => {
  const { handleTheme } = useThemeProvider();
  const { token } = useToken();
  const { colorPrimary } = token;

  // Function to handle primary color change
  const handlePrimaryColor = (color: string) => {
    handleTheme({ token: { colorPrimary: color } });
  };
  return (
    <SettingParcel title="Primary color" text="Set the primary color">
      <Flex align="center">
        <ColorPicker
          showText
          value={colorPrimary}
          onChangeComplete={color => handlePrimaryColor(color.toHexString())}
        />
        <SelectColor value={colorPrimary} onChange={handlePrimaryColor} />
      </Flex>
    </SettingParcel>
  );
};

export default PrimaryColor;
