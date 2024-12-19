import React, { memo } from 'react';
import { useContext } from '../../hooks/useContext';
import { getStyleConfig } from './utils';
import { getDataMap } from '../../hooks/utils';

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
        //@ts-ignore
        draft.dataMap = getDataMap(data);
      });
    }
  }, [data, schema, graphId]);
  return null;
};

export default memo(Prepare);
