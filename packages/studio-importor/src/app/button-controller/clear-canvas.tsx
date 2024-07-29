import * as React from 'react';
import { Button, Tooltip } from 'antd';

import { Icons } from '@graphscope/studio-components';
import { resetIndex } from '../utils';
import { FormattedMessage } from 'react-intl';
interface IAddNodeProps {
  style?: React.CSSProperties;
}
import { useContext } from '../useContext';
const ClearCanvas: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;
  const { updateStore, store } = useContext();
  const { elementOptions, isQueryData } = store;
  const disabled = !elementOptions.isConnectable || isQueryData;
  const tooltipText = disabled ? (
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
        disabled={disabled}
        onClick={handleClear}
        style={style}
        type="text"
        icon={<Icons.Trash disabled={disabled} />}
      ></Button>
    </Tooltip>
  );
};

export default ClearCanvas;
