import { Button, Tooltip } from 'antd';
import * as React from 'react';

import { FileImageOutlined } from '@ant-design/icons';
import { Utils, Icons } from '@graphscope/studio-components';
import { useContext } from '../useContext';
import { transOptionsToSchema } from '../utils/modeling';
import { transformImportOptionsToSchemaMapping } from '../utils/importing';
import yaml from 'js-yaml';
interface ILeftButtonProps {}

const ExportModel: React.FunctionComponent<ILeftButtonProps> = props => {
  const { store } = useContext();
  const { nodes, edges, appMode } = store;

  const handleExport = (type: string) => {
    let yamlFile;
    if (appMode === 'DATA_MODELING') {
      const content = transOptionsToSchema(Utils.fakeSnapshot({ nodes, edges }));
      if (type === 'yaml') {
        yamlFile = yaml.dump(content);
      }
      if (type === 'json') {
        yamlFile = JSON.stringify(content);
      }
      Utils.download(`create-model.${type}`, yamlFile);
      return;
    }
    if (appMode === 'DATA_IMPORTING') {
      const content = transformImportOptionsToSchemaMapping(Utils.fakeSnapshot({ nodes, edges }));

      if (type === 'yaml') {
        yamlFile = yaml.dump(content);
      }
      if (type === 'json') {
        yamlFile = JSON.stringify(content);
      }
      Utils.download(`loading-config.${type}`, yamlFile);
      return;
    }
  };

  return (
    <Tooltip title="Save graph model to JSON config" placement="right">
      <Button
        type="text"
        icon={<Icons.FileExport />}
        onClick={() => {
          handleExport('yaml');
        }}
      />
    </Tooltip>
  );
};

export default ExportModel;
