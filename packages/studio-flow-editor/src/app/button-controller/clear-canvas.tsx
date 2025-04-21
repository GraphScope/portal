import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { useGraphStore } from '../store';
import { Icons, useStudioProvier } from '@graphscope/studio-components';
import { FormattedMessage } from 'react-intl';
import { useClearCanvas } from '../hooks/useClearCanvas';
interface IAddNodeProps {
  style?: React.CSSProperties;
}
const ClearCanvas: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;
  const { store } = useGraphStore();
  const { elementOptions } = store;
  const { algorithm } = useStudioProvier();
  const isLight = algorithm === 'defaultAlgorithm';
  /** svg pathFill */
  let pathFill = () => {
    if (!isLight) {
      return elementOptions.isEditable ? '#fff' : '#585858';
    } else {
      return elementOptions.isEditable ? '#000' : '#ddd';
    }
  };
  const tooltipText = !elementOptions.isEditable ? (
    <FormattedMessage id="The current mode is preview only, and does not support clearing the model" />
  ) : (
    <FormattedMessage id="Clear graph model" />
  );
  const { handleClear } = useClearCanvas();
  return (
    <Tooltip title={tooltipText} placement="right">
      <Button
        disabled={!elementOptions.isEditable}
        onClick={handleClear}
        style={style}
        type="text"
        icon={<Icons.Trash style={{ color: pathFill() }} />}
      ></Button>
    </Tooltip>
  );
};

export default ClearCanvas;
