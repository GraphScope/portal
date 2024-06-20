import React, { useEffect, useState } from 'react';
import { Modal, Result, Button, Space, Flex, List, Typography, Progress } from 'antd';
import { useContext } from '@/layouts/useContext';
import { history } from 'umi';
import { getDatasourceById, getSchema } from './services';
import { SplitSection, Utils } from '@graphscope/studio-components';
import { uploadFile, bindDatasourceInBatch } from './services';
import localforage from 'localforage';
import { CheckCircleOutlined } from '@ant-design/icons';
import { transMappingSchemaToOptions } from './utils/import';
import type { ISchemaOptions } from '@graphscope/studio-importor';
import { useContext as useModeling } from '@graphscope/studio-importor';
interface IAutoLoadCSVCaseProps {}

const AutoLoadCSVCase: React.FunctionComponent<IAutoLoadCSVCaseProps> = props => {
  const { store, updateStore } = useContext();
  const { updateStore: updateModeling } = useModeling();
  const { graphId, draftId } = store;
  const [state, setState] = useState<{
    open: boolean;
    isLoading: boolean;
    files: File[];
    lists: {
      title: string;
      status: string;
      size: string;
    }[];
    options: ISchemaOptions;
  }>({
    open: false,
    isLoading: false,
    files: [],
    lists: [],
    options: { nodes: [], edges: [] },
  });
  const { open, lists, files, options } = state;
  useEffect(() => {
    if (graphId !== draftId) {
      getLocalFiles();
    }
  }, []);

  const getLocalFiles = async () => {
    const schemaMapping = await getDatasourceById(graphId as string);
    const graphSchema = await getSchema(graphId as string);
    const options = transMappingSchemaToOptions(graphSchema as any, schemaMapping);
    if ('vertex_mappings' in schemaMapping) {
      const { vertex_mappings = [], edge_mappings = [] } = schemaMapping;
      const emptyMapping = vertex_mappings.length === 0 && edge_mappings.length === 0;
      if (emptyMapping) {
        const localFiles = await localforage.getItem<File[]>('DRAFT_GRAPH_FILES');
        if (localFiles) {
          const lists = localFiles.map(item => {
            return {
              title: item.name,
              size: Utils.getFileSize(item.size),
              status: 'not-upload',
            };
          });
          setState(preState => {
            return {
              ...preState,
              open: true,
              files: localFiles,
              lists,
              options,
            };
          });
        }
      }
    }
  };
  const handleBulk = async () => {
    setState(preState => {
      return {
        ...preState,
        isLoading: true,
      };
    });
    const requests = files.map(file => {
      return uploadFile(file);
    });
    const file_location_map: Record<string, string | undefined> = {};
    const file_locations = await Promise.all(requests);
    if (file_locations) {
      files.forEach((file, index) => {
        file_location_map[file.name] = file_locations[index]?.file_path;
      });
    }
    await handleBound(file_location_map);
  };
  const handleClose = () => {
    setState(preState => {
      return {
        ...preState,
        isLoading: false,
        open: false,
      };
    });
  };
  const handleBound = async (file_location_map: Record<string, string | undefined>) => {
    const localSchema = await localforage.getItem<ISchemaOptions>(`GRAPH_SCHEMA_OPTIONS_${graphId}`);

    if (localSchema) {
      localSchema.nodes.forEach(node => {
        const { id, data } = node;
        const { csv_location, dataFields, properties } = data;
        data.filelocation = file_location_map[csv_location];
        if (properties) {
          properties.forEach(property => {
            property.token = property.name;
            property.index = dataFields?.findIndex(d => d === property.name);
          });
        }
      });
      localSchema.edges.forEach(edge => {
        const { id, data } = edge;
        const { csv_location, dataFields, properties, graphFields } = data;
        data.filelocation = file_location_map[csv_location];
        if (properties) {
          properties.forEach(property => {
            property.token = property.name;
            property.index = dataFields?.findIndex(d => d === property.name);
          });
          const { targetField, sourceField } = graphFields;

          data.source_vertex_fields = {
            name: sourceField,
            token: sourceField,
            index: dataFields?.findIndex(d => d === sourceField),
          };
          data.target_vertex_fields = {
            name: targetField,
            token: targetField,
            index: dataFields?.findIndex(d => d === targetField),
          };
        }
      });
      updateModeling(draft => {
        draft.edges = localSchema.edges;
        draft.nodes = localSchema.nodes;
      });

      handleClose();
    }
    // const {options} = state;
    // const bindStatus = await bindDatasourceInBatch(graphId || '', {
    //   nodes: nodes,
    //   edges: edges,
    // });
    // const firstNode = nodes[0];
    // const { delimiter, datatype } = firstNode.data;
    // updateState(preset => {
    //   return {
    //     ...preset,
    //     open: true,
    //     delimiter,
    //     datatype,
    //   };
    // });
  };

  console.log('options', state.options);
  if (graphId !== draftId) {
    return (
      <div>
        <Modal title={null} open={open} footer={null} closable={false} width={1000}>
          <SplitSection
            splitText=""
            span={10}
            leftSide={
              <Result
                status="403"
                title="Bulk Import Data"
                subTitle="The system has detected that you have previously uploaded CSV files. You can quickly bulk import data into graphscope"
              />
            }
            rightSide={
              <Flex vertical justify="space-between" style={{ height: '100%' }}>
                <List
                  itemLayout="horizontal"
                  dataSource={lists}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Space size="middle">
                        <CheckCircleOutlined />
                        {/* <Progress
                          percent={100}
                          showInfo={false}
                          size="small"
                          status="active"
                          style={{ width: '120px', height: '22px' }}
                        /> */}
                        <Typography.Text>{item.title}</Typography.Text>
                      </Space>
                      <Typography.Text type="secondary">{item.size}</Typography.Text>
                    </List.Item>
                  )}
                />
                <Space>
                  <Button type="primary" onClick={handleBulk} loading={state.isLoading}>
                    Bulk Import
                  </Button>
                  <Button onClick={handleClose}>Close</Button>
                </Space>
              </Flex>
            }
          ></SplitSection>
        </Modal>
      </div>
    );
  }
  return null;
};

export default AutoLoadCSVCase;
