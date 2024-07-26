import React from 'react';
import { Col, InputNumber, Slider, theme } from 'antd';
import { useThemeContainer } from '@graphscope/studio-components';
import SettingParcel from '@/components/setting-parcel';
// type IRoundedCornerProps = {};
const { useToken } = theme;
const RoundedCorner: React.FunctionComponent = () => {
  const { token } = useToken();
  const { borderRadius } = token;
  const { handleTheme } = useThemeContainer();

  const handleBorderRadiusChange: (newBorderRadius: number | null) => void = newBorderRadius => {
    handleTheme({ token: { ...token, borderRadius: newBorderRadius } });
  };

  return (
    <SettingParcel
      style={{ margin: '0px' }}
      title="Rounded corners"
      text="Corner radians"
      leftModule={<InputNumber min={1} addonAfter="px" value={borderRadius} onChange={handleBorderRadiusChange} />}
      rightModule={
        <Slider
          min={1}
          onChange={handleBorderRadiusChange}
          value={typeof borderRadius === 'number' ? borderRadius : 0}
        />
      }
    />
  );
};

export default RoundedCorner;
