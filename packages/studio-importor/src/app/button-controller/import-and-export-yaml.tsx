import { Button, Popover, Flex, Typography, Divider, theme, Space } from 'antd';
import * as React from 'react';
import { Utils, Icons } from '@graphscope/studio-components';
import { useContext } from '../useContext';
import { transOptionsToSchema } from '../utils/modeling';
import { transformImportOptionsToSchemaMapping } from '../utils/importing';
import yaml from 'js-yaml';
import ImportFromYAML from '../import-schema/import-from-yaml';
import type { ImportorProps } from '../typing';
interface ILeftButtonProps {}
const { useToken } = theme;

const APP_MODE_YAML_TITLE: {
  [key in ImportorProps['appMode']]: {
    importText: string;
    exportText: React.ReactNode;
  };
} = {
  DATA_MODELING: {
    importText: 'Import YAML or JSON file to generate graph model',
    exportText: 'Save graph model to local YAML or JSON file',
  },
  DATA_IMPORTING: {
    importText: 'Import YAML or JSON file to generate graph loading config',
    exportText: 'Save graph loading config to local YAML or JSON file',
  },
};
const Content = () => {
  const { token } = useToken();
  const { store } = useContext();
  const { nodes, edges, elementOptions, appMode } = store;
  const { importText, exportText } = APP_MODE_YAML_TITLE[appMode];

  /** export yaml */
  const handleExport = (type: string) => {
    if (appMode === 'DATA_MODELING') {
      const content = transOptionsToSchema(Utils.fakeSnapshot({ nodes, edges }));
      const yamlFile = type === 'yaml' ? yaml.dump(content) : JSON.stringify(content);
      Utils.download(`create-model.${type}`, yamlFile);
      return;
    }
    if (appMode === 'DATA_IMPORTING') {
      const content = transformImportOptionsToSchemaMapping(Utils.fakeSnapshot({ nodes, edges }));
      const yamlFile = type === 'yaml' ? yaml.dump(content) : JSON.stringify(content);
      Utils.download(`loading-config.${type}`, yamlFile);
      return;
    }
  };

  return (
    <Flex justify="center" vertical style={{ padding: '20px' }} gap={10}>
      <Typography.Text type="secondary">{importText}</Typography.Text>
      <ImportFromYAML
        disabled={!elementOptions.isEditable}
        style={{ height: '160px' }}
        icon={<Icons.FileYaml style={{ fontSize: '50px', color: token.colorPrimary }} />}
      />
      <Divider style={{ margin: '12px  0px' }} />
      <Typography.Text type="secondary">{exportText}</Typography.Text>
      <Flex gap={10}>
        <Button style={{ width: '50%' }} onClick={() => handleExport('yaml')}>
          YAML Export
        </Button>
        <Button style={{ width: '50%' }} onClick={() => handleExport('json')}>
          JSON Export
        </Button>
      </Flex>
    </Flex>
  );
};

const ImportAndExportYaml: React.FunctionComponent<ILeftButtonProps> = props => {
  return (
    <Popover placement="bottomLeft" content={<Content />}>
      <Button type="text" icon={<Icons.FileYaml />} />
    </Popover>
  );
};

export default ImportAndExportYaml;
