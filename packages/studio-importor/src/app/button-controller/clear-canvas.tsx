import * as React from 'react';
import { Button, Tooltip } from 'antd';

import { Icons, useThemeProvider } from '@graphscope/studio-components';
import { resetIndex } from '../utils';
import { FormattedMessage } from 'react-intl';
interface IAddNodeProps {
  style?: React.CSSProperties;
}
import { useContext } from '@graphscope/use-zustand';
const ClearCanvas: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;
  const { updateStore, store } = useContext();
  const { elementOptions } = store;
  const { isLight } = useThemeProvider();
  /** svg pathFill */
  let pathFill = () => {
    if (!isLight) {
      return elementOptions.isEditable ? '#585858' : '#fff';
    } else {
      return elementOptions.isEditable ? '#ddd' : '#000';
    }
  };
  const tooltipText = elementOptions.isEditable ? (
    <FormattedMessage id="The current mode is preview only, and does not support clearing the model" />
  ) : (
    <FormattedMessage id="Clear graph model" />
  );

  const handleClear = () => {
    resetIndex();
    updateStore(draft => {
      draft.nodes = [];
      draft.edges = [];
    });
  };

  return (
    <Tooltip title={tooltipText} placement="right">
      <Button
        disabled={elementOptions.isEditable}
        onClick={handleClear}
        style={style}
        type="text"
        icon={<Icons.Trash style={{ color: pathFill() }} />}
      ></Button>
    </Tooltip>
  );
};

export default ClearCanvas;
