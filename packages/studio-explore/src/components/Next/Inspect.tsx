import * as React from 'react';
import { Typography, Flex, Table, theme } from 'antd';
import { FormattedMessage } from 'react-intl';
const { Title } = Typography;
import { useContext } from '@graphscope/studio-graph';

import { Utils, CollapseCard } from '@graphscope/studio-components';
import { BgColorsOutlined } from '@ant-design/icons';
import PropertiesTable from './PropertiesTable';
import PropertyInfo from './PropertyInfo';
export interface IInspectProps {
  style?: React.CSSProperties;
  type: 'node' | 'edge';
  data: any[];
}

const getDataByProperties = properties => {
  const columns: any[] = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
    },
  ];
  const dataSource = Object.entries(properties).map(item => {
    const [key, value] = item;
    return {
      key,
      name: key,
      value: value,
    };
  });

  return {
    dataSource,
    columns,
  };
};

const Inspect: React.FunctionComponent<IInspectProps> = props => {
  const { type, data } = props;

  const title = type === 'node' ? 'Inspect Vertex Properties' : 'Inspect Edge Properties';

  if (data.length > 1) {
    return <PropertiesTable data={data} />;
  }
  if (data.length === 1) {
    return <PropertyInfo data={data[0]} />;
  }
  return null;
};

export default Inspect;
