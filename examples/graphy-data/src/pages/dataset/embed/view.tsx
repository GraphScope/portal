import * as React from 'react';

import ImportorApp, { useContext } from '@graphscope/studio-importor';
import { Button } from 'antd';
import { Toolbar, Utils, MultipleInstance } from '@graphscope/studio-components';

import SaveButton from './save';
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
      const { nodes, edges } = transformDataToSchema(data);
      updateStore(draft => {
        draft.nodes = nodes;
        draft.edges = edges;
      });
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [data]);
  return null;
};
const EmbedSchemaView: React.FunctionComponent<IModelingProps> = props => {
  const { data } = props;
  return (
    <MultipleInstance>
      <ImportorApp
        style={{
          height: '300px',
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
    </MultipleInstance>
  );
};

export default EmbedSchemaView;
