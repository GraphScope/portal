import * as React from 'react';
import { Typography, Tooltip, Switch, Input, Flex, Space, Card } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Utils, Illustration } from '@graphscope/studio-components';
import { ROUTES, SIDE_MENU } from '@graphscope/graphy-website';
import { installSlot, unInstallSlot } from '../../../slots';
import { FormattedMessage } from 'react-intl';

interface IGraphyPluginProps {}

const GraphyPlugin: React.FunctionComponent<IGraphyPluginProps> = props => {
  const defaultChecked = Utils.storage.get<boolean>('PORTAL_PLUGIN_GRAPHY');
  const defaultEndpoint = Utils.storage.get<string>('graphy_endpoint') || 'http://127.0.0.1:9999';
  const onChange = (checked: boolean) => {
    Utils.storage.set('PORTAL_PLUGIN_GRAPHY', checked);
    if (checked) {
      installSlot('SIDE_MEU', 'graphy', SIDE_MENU);
      installSlot('ROUTES', 'graphy', ROUTES);
    } else {
      unInstallSlot('SIDE_MEU', 'graphy');
      unInstallSlot('ROUTES', 'graphy');
    }
    window.location.reload();
  };
  const handleChangeUrl = () => {
    Utils.storage.get('graphy_endpoint');
  };

  return (
    <Flex gap={32} vertical>
      <Flex vertical gap={12} flex={1}>
        <Space>
          <Typography.Title level={5}><FormattedMessage id="Graphy'ourData"/></Typography.Title>
          <Tooltip
            title={<FormattedMessage id="Graphy is an end-to-end platform designed for extracting, visualizing, and analyzing large volumes of unstructured data. Without structured organization, valuable insights in such data often remain hidden.Graphy empowers users to extract predefined structures from unstructured data, organizing it into a graph format for enhanced visualization, analysis, and exploration."/>}
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>

        <Typography.Text type="secondary">
        <FormattedMessage id="An intuitive tool that transforms unstructured data into graph dataset."/>
        </Typography.Text>
        <Space>
          Enable:
          <Switch defaultChecked={defaultChecked} onChange={onChange} />
        </Space>
        <Space>
          <Typography.Text>Endpoint: </Typography.Text>
          <Input placeholder="Graphy Endpoint" defaultValue={defaultEndpoint} />
        </Space>
      </Flex>
    </Flex>
  );
};

export default GraphyPlugin;
