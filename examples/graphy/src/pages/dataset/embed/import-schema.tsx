import { Button, Popover, Flex, Typography, Divider, theme, Space } from 'antd';
import * as React from 'react';
import { Utils, Icons } from '@graphscope/studio-components';
import { useContext } from '@graphscope/studio-importor';
import ParseSchema from './parse-schema';

interface ILeftButtonProps {}
const { useToken } = theme;

const Content = () => {
  const { token } = useToken();
  const { store } = useContext();
  const { nodes, edges } = store;

  const handleExport = (type: string) => {
    let yamlFile;
    const content = Utils.transSchema(Utils.fakeSnapshot({ nodes, edges }));
    if (type === 'json') {
      yamlFile = JSON.stringify(content);
    }
    Utils.download(`create-model.${type}`, yamlFile);
    return;
  };

  return (
    <Flex justify="center" vertical style={{ padding: '20px' }} gap={10}>
      <Typography.Text type="secondary">Import JSON file to generate graph workflow</Typography.Text>
      <ParseSchema
        disabled={nodes.length !== 0}
        style={{ height: '160px' }}
        icon={<Icons.FileYaml style={{ fontSize: '50px', color: token.colorPrimary }} />}
      />
      <Divider style={{ margin: '12px  0px' }} />
      <Typography.Text type="secondary">Save graph workflow config to local JSON file</Typography.Text>

      <Button style={{ width: '100%' }} onClick={() => handleExport('json')}>
        Export File
      </Button>
    </Flex>
  );
};

const ImportSchema: React.FunctionComponent<ILeftButtonProps> = props => {
  return (
    <Popover placement="bottomLeft" content={<Content />}>
      <Button type="text" icon={<Icons.FileYaml />} />
    </Popover>
  );
};

export default ImportSchema;
