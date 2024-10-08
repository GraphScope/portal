import * as React from 'react';
import ImportApp, { transSchemaToOptions } from '@graphscope/studio-importor';
import { useContext } from '../../layouts/useContext';
import { Toolbar, useThemeContainer } from '@graphscope/studio-components';
import { getSchema, createVertexTypeOrEdgeType, deleteVertexTypeOrEdgeType } from './services';
import Save from './save-modeling';
import SelectGraph from '@/layouts/select-graph';

interface ISchemaPageProps {}
const { GS_ENGINE_TYPE } = window;

const ModelingPage: React.FunctionComponent<ISchemaPageProps> = props => {
  /**查询数据导入 */
  const { store } = useContext();
  const { graphId, draftId } = store;
  const { algorithm } = useThemeContainer();
  const isDark = algorithm === 'darkAlgorithm';
  const background = isDark ? '#1d1d1d' : '#fff';
  /** 查询图 */
  const queryGraphSchema = async () => {
    if (graphId === draftId) {
      return transSchemaToOptions({ vertex_types: [], edge_types: [] } as any);
    }
    let schema: any = { vertex_types: [], edge_types: [] };
    if (graphId) {
      schema = await getSchema(graphId);
      if (!schema) {
        schema = { vertex_types: [], edge_types: [] };
      }
    }

    return transSchemaToOptions(schema as any, () => {
      return {
        saved: true,
        disabled: true,
      };
    });
  };

  return (
    <ImportApp
      isSaveFiles={true}
      key={graphId}
      /** 创建图模型 */
      appMode="DATA_MODELING"
      defaultCollapsed={{
        leftSide: true,
        rightSide: true,
      }}
      //@ts-ignore
      queryGraphSchema={queryGraphSchema}
      /** 属性下拉选项值 */
      queryPrimitiveTypes={() => {
        return ['DT_DOUBLE', 'DT_STRING', 'DT_SIGNED_INT32', 'DT_SIGNED_INT64'].map(item => {
          return { label: item, value: item };
        });
      }}
      GS_ENGINE_TYPE={GS_ENGINE_TYPE}
      onDeleteLabel={deleteVertexTypeOrEdgeType}
      onCreateLabel={createVertexTypeOrEdgeType}
    >
      <Toolbar style={{ top: '12px', left: '24px', right: 'unset', background }} direction="horizontal">
        <SelectGraph />
        <Save />
      </Toolbar>
    </ImportApp>
  );
};

export default ModelingPage;
