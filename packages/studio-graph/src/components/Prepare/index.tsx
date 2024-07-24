import * as React from 'react';
import { useContext } from '../../hooks/useContext';

interface IPrepareProps {
  data: any;
  schema: any;
  graphId: string;
}

const Prepare: React.FunctionComponent<IPrepareProps> = props => {
  const { data, schema, graphId } = props;
  const { updateStore } = useContext();
  React.useEffect(() => {
    if (data && graphId) {
      updateStore(draft => {
        draft.data = data;
        draft.schema = schema;
        draft.graphId = graphId;
      });
    }
  }, [data]);
  return null;
};

export default Prepare;
