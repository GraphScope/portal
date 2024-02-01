import * as React from 'react';
import { DisconnectOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Col, Space, Typography, theme } from 'antd';
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
  textAlign: 'end',
  marginRight: '8px',
  fontSize: '14px',
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
  const handleIconChange = isEidtProperty ? (
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
    <>
      <Row style={{ border: `1px solid ${token.colorBorder}`, padding: '12px 16px' }}>
        <Flex justify="start" align="center">
          {handleIconChange}
        </Flex>
        <Col span={20}>
          <Flex justify="flex-start" align="center">
            <Title level={5} style={styles}>
              label:
            </Title>
            <Text>{label}</Text>
          </Flex>
          <Flex justify="flex-start" align="center">
            <Title level={5} style={styles}>
              数据源:
            </Title>
            <SwitchSource filelocation={filelocation} currentType={currentType} updateState={updateState} />
          </Flex>
        </Col>
        <Flex justify="end" align="center">
          <Col span={3}>
            <DisconnectOutlined style={{ fontSize: '32px', color: isBind ? '#53C31C' : '#ddd', marginLeft: '13px' }} />
          </Col>
        </Flex>
      </Row>
      {isEidtProperty && (
        <Row style={{ border: `1px solid ${token.colorBorder}`, borderTop: 'none', padding: '12px 0px 12px 38px' }}>
          <Col span={24}>
            <Row>
              <Col span={4}>
                <Title level={5} style={{ ...styles, marginTop: '14px' }}>
                  属性映射：
                </Title>
              </Col>
              <Col span={20} pull={1} style={{}}>
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
            </Row>
          </Col>
          <Col span={24}>
            <Flex justify="end" style={{ margin: '16px 27px 5px' }}>
              <Space>
                {engineType === 'groot' ? (
                  <>
                    <ImportPeriodic />
                    <ImportNow label={label} />
                  </>
                ) : (
                  <Button type="primary" onClick={saveBindData}>
                    保存绑定
                  </Button>
                )}
              </Space>
            </Flex>
          </Col>
        </Row>
      )}
    </>
  );
};

export default DataSource;
