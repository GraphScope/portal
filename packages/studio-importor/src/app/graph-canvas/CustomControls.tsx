import React from 'react';
import { Button, Flex, Divider } from 'antd';
import { PlusOutlined, MinusOutlined, ExpandOutlined } from '@ant-design/icons';
import { useReactFlow, Panel } from 'reactflow';
import { Icons, useThemeProvider } from '@graphscope/studio-components';

interface ICustomControlsProps {
  isLocked: boolean;
  handleLocked: (val: boolean) => void;
}
const CustomControls: React.FunctionComponent<ICustomControlsProps> = props => {
  const { isLocked, handleLocked } = props;
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { isLight } = useThemeProvider();
  // svg path fill
  const color = !isLight ? '#FFF' : '#000';
  // lock or unlock
  const Icon = isLocked ? <Icons.Lock style={{ color }} /> : <Icons.Unlock style={{ color }} />;
  const background = !isLight ? '#1d1d1d' : '#fff';
  return (
    <>
      <Panel
        position="bottom-left"
        style={{
          boxShadow:
            '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
          background,
        }}
      >
        <Flex vertical>
          <Button
            style={{ borderRadius: 0 }}
            size="small"
            type="text"
            icon={<PlusOutlined />}
            onClick={() => zoomIn({ duration: 100 })}
          />
          <Divider style={{ margin: 0 }} />
          <Button
            style={{ borderRadius: 0 }}
            size="small"
            type="text"
            icon={<MinusOutlined />}
            onClick={() => zoomOut({ duration: 100 })}
          />
          <Divider style={{ margin: 0 }} />
          <Button
            style={{ borderRadius: 0 }}
            size="small"
            type="text"
            icon={<ExpandOutlined />}
            onClick={() => fitView()}
          />
          <Divider style={{ margin: 0 }} />
          <Button
            style={{ borderRadius: 0 }}
            size="small"
            type="text"
            icon={Icon}
            onClick={() => {
              handleLocked(!isLocked);
            }}
          />
        </Flex>
      </Panel>
    </>
  );
};

export default CustomControls;
