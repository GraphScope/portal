import { Select, Space, Typography } from 'antd';
import * as React from 'react';
import { queryVersion, startVersion } from './service';
import { Utils } from '@graphscope/studio-components';

interface IVersionsProps {}

const Versions: React.FunctionComponent<IVersionsProps> = props => {
  const [state, setState] = React.useState({
    version: '',
    options: [],
  });
  const { version, options } = state;
  React.useEffect(() => {
    const graph_id = Utils.getSearchParams('graph_id');
    (async () => {
      const info = await queryVersion(graph_id);
      //@ts-ignore
      const options = info.map(item => {
        return {
          label: item.version_id,
          value: item.version_id,
        };
      });
      const { value } = options[0];
      await startVersion(graph_id, value);
      setState(preState => {
        return {
          ...preState,
          version: value,
          options: options,
        };
      });
    })();
  }, []);
  const handleChange = async (value: string) => {
    setState(preState => {
      return {
        ...preState,
        version: value,
      };
    });
    await startVersion(Utils.getSearchParams('graph_id'), value);
  };

  return (
    <Space>
      <Typography.Text type="secondary">version:</Typography.Text>
      <Select
        variant="borderless"
        style={{ flex: 1, minWidth: '50px' }}
        placeholder="Choose version"
        value={version}
        onChange={handleChange}
        options={options}
      />
    </Space>
  );
};

export default Versions;
