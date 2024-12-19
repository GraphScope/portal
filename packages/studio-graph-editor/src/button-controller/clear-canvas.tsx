import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { Icons } from '@graphscope/studio-components';
import { resetIndex } from '../elements/utils';
import { FormattedMessage } from 'react-intl';
interface IAddNodeProps {
  style?: React.CSSProperties;
}
import { useContext } from '../canvas/useContext';
const ClearCanvas: React.FunctionComponent<IAddNodeProps> = props => {
  const { style } = props;
  const { updateStore, store } = useContext();
  const { elementOptions } = store;
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
        icon={<Icons.Trash />}
      ></Button>
    </Tooltip>
  );
};

export default ClearCanvas;
