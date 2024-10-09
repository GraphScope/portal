import React from 'react';
import { ColorPicker, Flex, Col, theme } from 'antd';
import SelectColor from './select-color';
import { useStudioProvier } from '@graphscope/studio-components';
import SettingParcel from '@/components/setting-parcel';

const { useToken } = theme;
const PrimaryColor: React.FunctionComponent = () => {
  const { handleThemeOrLocale } = useStudioProvier();
  const { token } = useToken();
  const { borderRadius, colorPrimary } = token;

  // Function to handle primary color change
  const handlePrimaryColor = (color: string) => {
    handleThemeOrLocale({ token: { colorPrimary: color, borderRadius } });
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
