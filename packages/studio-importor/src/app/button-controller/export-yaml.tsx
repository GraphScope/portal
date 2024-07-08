import { Button } from 'antd';
import * as React from 'react';
import { FileExcelFilled } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';
import { useContext } from '../useContext';
import { transOptionsToSchema } from '../utils/modeling';
import yaml from 'js-yaml';
interface ILeftButtonProps {}

const ExportYaml: React.FunctionComponent<ILeftButtonProps> = props => {
  const { store } = useContext();
  const { nodes, edges } = store;
  const handleClick = () => {
    const content = transOptionsToSchema(Utils.fakeSnapshot({ nodes, edges }));
    console.log('aa', content);
    const yamlFile = yaml.dump(content);
    Utils.download('schema.yaml', yamlFile);
  };

  return <Button type="text" icon={<FileExcelFilled />} onClick={handleClick} />;
};

export default ExportYaml;
