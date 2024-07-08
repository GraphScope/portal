import React from 'react';
import { ColorPicker, Flex, Col, theme } from 'antd';
import SelectColor from './select-color';
import { useThemeContainer } from '@graphscope/studio-components';
import SettingParcel from '@/components/setting-parcel';

// Style constants
const TITLE_STYLE = { margin: '0px 24px 0px 0px' };
const { useToken } = theme;
const PrimaryColor: React.FunctionComponent = () => {
  const { handleTheme } = useThemeContainer();
  const { token } = useToken();
  const { borderRadius, colorPrimary } = token;

  // Function to handle primary color change
  const handlePrimaryColor = (color: string) => {
    handleTheme({ token: { colorPrimary: color, borderRadius } });
  };
  return (
    <SettingParcel style={TITLE_STYLE} title="Primary color" text="Set the primary color">
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
