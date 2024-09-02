import React, { memo } from 'react';
import { useContext } from '../../hooks/useContext';
import { getStyleConfig, getDataMap } from './utils';
import { Utils } from '@graphscope/studio-components';
interface IPrepareProps {
  data: any;
  schema: any;
  graphId: string;
}

const Prepare: React.FunctionComponent<IPrepareProps> = props => {
  const { data, schema, graphId } = props;

  const { updateStore } = useContext();
  React.useEffect(() => {
    if (data) {
      const style = getStyleConfig(schema, graphId);
      updateStore(draft => {
        draft.data = data;
        draft.source = data;
        draft.schema = schema;
        draft.graphId = graphId;
        draft.nodeStyle = style.nodeStyle;
        draft.edgeStyle = style.edgeStyle;
        draft.dataMap = getDataMap(Utils.fakeSnapshot(data));
      });
    }
  }, [data, schema, graphId]);
  return null;
};

export default memo(Prepare);
