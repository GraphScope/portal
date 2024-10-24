import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { INTERNAL_Snapshot } from 'valtio';
import { useContext } from '@graphscope/use-zustand';
import type { ImportorProps, ISchemaEdge, ISchemaNode } from '../../../typing';
import { SaveOutlined } from '@ant-design/icons';
import { validateProperties } from '../validate-info';
interface ISaveButtonProps {
  nodesMap?: Record<string, ISchemaNode>;
  type: 'nodes' | 'edges';
  schema: INTERNAL_Snapshot<ISchemaNode | ISchemaEdge>;
  onCreateLabel: ImportorProps['onCreateLabel'];
}

const SaveButton: React.FunctionComponent<ISaveButtonProps> = props => {
  const { onCreateLabel = () => false, schema, type, nodesMap } = props;
  const { data, id } = schema;
  const { saved, properties = [], filelocation } = data;

  const { updateStore, store } = useContext();
  const { nodes, appMode } = store;

  const handleDelete = async event => {
    event.stopPropagation();

    if (type === 'nodes') {
      const res = await onCreateLabel(type, schema);
      if (res) {
        updateStore(draft => {
          draft.nodes = draft.nodes.map(item => {
            if (item.id === id) {
              return {
                ...item,
                data: { ...item.data, disabled: true, saved: true },
              };
            }
            return item;
          });
        });
      }
    }

    if (type === 'edges') {
      //@ts-ignore
      const res = await onCreateLabel(type, schema, nodes);
      if (res) {
        updateStore(draft => {
          draft.edges = draft.edges.map(item => {
            if (item.id === id) {
              return {
                ...item,
                data: { ...item.data, disabled: true, saved: true },
              };
            }
            return item;
          });
        });
      }
    }
  };
  /**只有groot引擎支持单个节点的保存 */
  if (window.GS_ENGINE_TYPE === 'groot' && !saved) {
    //@ts-ignore
    const tooltip = validateProperties({ appMode, type, properties, filelocation });
    let text = tooltip ? tooltip : 'Save label';
    let disabled = tooltip ? true : false;

    if (type === 'edges' && nodesMap) {
      const { source, target } = schema as ISchemaEdge;
      const sourceVertex = nodesMap[source];
      const targetVertex = nodesMap[target];
      const canSaveEdge = sourceVertex && targetVertex && sourceVertex.data.saved && targetVertex.data.saved;
      if (!canSaveEdge) {
        disabled = true;
        text = 'Please save the related vertex first';
      }
    }

    return (
      <Tooltip title={text}>
        <Button size="small" type="text" onClick={handleDelete} icon={<SaveOutlined />} disabled={disabled}></Button>
      </Tooltip>
    );
  }
  return null;
};

export default SaveButton;
