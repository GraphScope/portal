import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { FileExcelFilled } from '@ant-design/icons';
import { Utils, Icons } from '@graphscope/studio-components';
import { useContext } from '../useContext';
import { transOptionsToSchema } from '../utils/modeling';
import yaml from 'js-yaml';
interface ILeftButtonProps {}

const ExportYaml: React.FunctionComponent<ILeftButtonProps> = props => {
  const { store } = useContext();
  const { nodes, edges } = store;
  const handleClick = () => {
    const content = transOptionsToSchema(Utils.fakeSnapshot({ nodes, edges }));

    const yamlFile = yaml.dump(content);
    Utils.download('schema.yaml', yamlFile);
  };

  return (
    <Tooltip title="Save graph model to local YAML file" placement="right">
      <Button type="text" icon={<Icons.FileExport />} onClick={handleClick} />
    </Tooltip>
  );
};

export default ExportYaml;
