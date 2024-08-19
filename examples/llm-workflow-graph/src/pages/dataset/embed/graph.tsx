import * as React from 'react';

import { useContext, getDataMap, getStyleConfig } from '@graphscope/studio-graph';
import ImportorApp, { useContext as useModeling, transSchemaToOptions } from '@graphscope/studio-importor';
import { Button } from 'antd';
import { Toolbar, Utils } from '@graphscope/studio-components';

const { generatorSchemaByGraphData } = Utils;
interface IModelingProps {}

const EmbedSchema: React.FunctionComponent<IModelingProps> = props => {
  return (
    <ImportorApp
      style={{
        height: 'calc(100vh - 100px)',
      }}
      appMode="DATA_MODELING"
      defaultCollapsed={{
        leftSide: true,
        rightSide: true,
      }}
      rightSideStyle={{
        width: '250px',
        padding: '0px 12px',
      }}
      // queryGraphSchema={queryGraphSchema}
      queryPrimitiveTypes={() => {
        return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
          return { label: item, value: item };
        });
      }}
    >
      {/* <Toolbar style={{ top: '12px', right: '124px', left: 'unset' }} direction="horizontal">
        <SaveButton />
      </Toolbar> */}
    </ImportorApp>
  );
};

export default EmbedSchema;

// function SaveButton() {
//   const { store } = useModeling();
//   const { updateStore } = useContext();
//   const { nodes, edges } = store;
//   console.log('modelingStore', store);
//   const handleClick = async () => {
//     // console.log('modelingStore', modelingStore);

//     const nodePromise = nodes.map(item => {
//       const { label } = item.data;
//       // return query({
//       //   name: label,
//       //   type: 'nodes',
//       // });
//     });
//     const edgePromise = edges.map(item => {
//       const { label } = item.data;
//       // return query({
//       //   name: label,
//       //   type: 'edges',
//       // });
//     });
//     const _nodes = [];
//     const _edges = [];
//     Promise.all([...nodePromise, ...edgePromise]).then(values => {
//       console.log('values', values);
//       values.forEach(item => {
//         console.log('item', item);
//         //@ts-ignore
//         _nodes.push(...item.nodes);
//         //@ts-ignore
//         _edges.push(...item.edges);
//         console.log(_nodes, _edges);
//       });

//       updateStore(draft => {
//         // const newData = Utils.handleExpand(draft.data, {
//         //   nodes: _nodes,
//         //   edges: _edges,
//         // });
//         const newData = {
//           nodes: _nodes,
//           edges: _edges,
//         };
//         const schema = generatorSchemaByGraphData(newData);
//         //@ts-ignore
//         const style = getStyleConfig(schema, draft.graphId);
//         draft.data = newData;
//         draft.source = newData;
//         draft.nodeStyle = style.nodeStyle;
//         draft.edgeStyle = style.edgeStyle;
//         draft.dataMap = getDataMap(newData);
//         draft.schema = generatorSchemaByGraphData(newData);
//       });
//     });
//   };

//   return (
//     <Button type="primary" onClick={handleClick}>
//       Embed Graph
//     </Button>
//   );
// }
