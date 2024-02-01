import * as React from 'react';
import { DisconnectOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Col, Space, Typography, theme, Tooltip } from 'antd';
import { PropertyType } from '../useContext';
import SwitchSource from './switch-source';
import ImportPeriodic from './import-periodic';
import ImportNow from './import-now';
import TableList from './table';
import { getUrlParams } from '../utils';
const { useToken } = theme;
interface IImportDataProps {
  data: PropertyType;
  handleChange(val: any): void;
}
const { Title, Text } = Typography;
const styles: React.CSSProperties = {
  display: 'inline-block',
  margin: '0px',
  width: '80px',
  padding: '0px 8px',
  fontSize: '14px',
  fontWeight: 400,
};
const DataSource: React.FunctionComponent<IImportDataProps> = props => {
  const {
    data: { label, isBind, filelocation, datatype, properties },
    handleChange,
  } = props;
  const { token } = useToken();
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const { engineType, graph } = getUrlParams();
  const [state, updateState] = React.useState({
    /** 判断是否绑定 */
    isEidtProperty: isBind || false,
    /** 数据源选择 Files or ODPS */
    currentType: datatype,
    /** table value */
    dataSources: [],
    /** 数据源输入值 */
    location: '', // 应该是 location
  });
  const { isEidtProperty, currentType, dataSources, location } = state;
  const saveBindData = () => {
    updateState(preState => {
      return {
        ...preState,
        isEidtProperty: false,
      };
    });
    /** 改变本条数据 */
    handleChange && handleChange({ label, location, properties: dataSources, datatype: currentType, isBind: true });
  };
  /** 切换图标 */
  const ToggleIcon = isEidtProperty ? (
    <CaretDownOutlined
      onClick={() =>
        updateState(preState => {
          return {
            ...preState,
            isEidtProperty: !isEidtProperty,
          };
        })
      }
    />
  ) : (
    <CaretUpOutlined
      onClick={() =>
        updateState(preState => {
          return {
            ...preState,
            isEidtProperty: !isEidtProperty,
          };
        })
      }
    />
  );
  return (
    <div style={{ background: '#FCFCFC', margin: '8px 0px', borderRadius: '8px', border: '1px solid #ddd' }}>
      <div style={{ padding: '16px 8px' }}>
        <Flex justify="space-between" align="center">
          <Flex justify="start" vertical gap={8}>
            <Space size={6}>
              <Title level={5} style={styles}>
                label:
              </Title>
              <Text>{label}</Text>
            </Space>
            <Space>
              <Title level={5} style={styles}>
                数据源:
              </Title>
              <SwitchSource filelocation={filelocation} currentType={currentType} updateState={updateState} />
            </Space>
          </Flex>
          <Space>
            <Tooltip title={isBind ? '已绑定' : '未绑定'}>
              <Button type="text" icon={<DisconnectOutlined style={{ color: isBind ? '#53C31C' : '#ddd' }} />}></Button>
            </Tooltip>
            <Button type="text" icon={ToggleIcon}></Button>
          </Space>
        </Flex>
      </div>
      {isEidtProperty && (
        <Row style={{ borderTop: `1px solid ${token.colorBorder}`, padding: '8px' }} gutter={[0, 8]}>
          <Title level={5} style={{ ...styles, marginTop: '14px', padding: '0px' }}>
            属性映射：
          </Title>
          <Col span={21}>
            <TableList
              //@ts-ignore
              tabledata={JSON.parse(JSON.stringify(properties))}
              onChange={val => {
                //@ts-ignore
                updateState(preState => {
                  return {
                    ...preState,
                    dataSources: val,
                  };
                });
              }}
            />
          </Col>
          <Col span={24}>
            <Flex justify="end">
              <Space>
                {engineType === 'groot' ? (
                  <>
                    <ImportPeriodic />
                    <ImportNow label={label} />
                  </>
                ) : (
                  <Button onClick={saveBindData} size="small">
                    保存绑定
                  </Button>
                )}
              </Space>
            </Flex>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DataSource;
