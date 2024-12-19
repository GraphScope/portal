import * as React from 'react';

import ImportorApp, { useContext, transSchemaToOptions } from '@graphscope/studio-importor';
import { transformDataToSchema } from './transform';
interface IModelingProps {
  data: any;
}

const RightSide = () => {
  return <div></div>;
};
const LeftSide = () => {
  return <div></div>;
};
let timer: any = null;
const Init = ({ data }) => {
  const { updateStore } = useContext();
  React.useEffect(() => {
    timer = setTimeout(() => {
      const { nodes, edges } = transformDataToSchema(transSchemaToOptions(data));
      updateStore(draft => {
        draft.nodes = nodes;
        draft.edges = edges;
      });
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return null;
};
const EmbedSchemaView: React.FunctionComponent<IModelingProps> = props => {
  const { data } = props;

  return (
    <ImportorApp
      style={{
        height: '170px',
        width: '300px',
      }}
      appMode="PURE"
      defaultCollapsed={{
        leftSide: true,
        rightSide: true,
      }}
      leftSide={<LeftSide />}
      rightSide={<RightSide />}
      rightSideStyle={{
        width: '0px',
        padding: '0px 12px',
      }}
      queryPrimitiveTypes={() => {
        return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
          return { label: item, value: item };
        });
      }}
    >
      <Init data={data} />
    </ImportorApp>
  );
};

export default EmbedSchemaView;
