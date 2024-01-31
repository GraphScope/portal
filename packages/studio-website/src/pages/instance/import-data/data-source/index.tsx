import * as React from 'react';
import { DisconnectOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Col, Space, Typography } from 'antd';
import { PropertyType } from '../index';
import SwitchSource from './switch-source';
import ImportPeriodic from './import-periodic';
import ImportNow from './import-now';
import TableList from './table';
import { getUrlParams } from '../utils';

interface IImportDataProps {
  data: PropertyType;
}
const { Text } = Typography;

const DataSource: React.FunctionComponent<IImportDataProps> = props => {
  const {
    data: { label, isBind, filelocation, datatype, properties },
  } = props;
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const { engineType } = getUrlParams();
  const [state, updateState] = React.useState({
    /** 判断是否绑定 */
    isEidtProperty: isBind || false,
    currentType: 'ODPS',
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
  };
  return (
    <>
      <Row style={{ border: '1px solid #000', padding: '0px 24px 12px' }}>
        <Col span={1} style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingRight: '16px' }}>
          {isEidtProperty ? (
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
          )}
        </Col>
        <Col span={17} style={{ paddingTop: '12px' }}>
          <Flex justify="flex-start">
            <Text>label:</Text> <Text>{label}</Text>
          </Flex>
          <Col span={24}>
            <Row>
              <Col span={3}>
                <Text>数据源:</Text>
              </Col>
              <Col span={21}>
                <SwitchSource
                  // 命名：SwitchSource
                  datatype={datatype}
                  filelocation={filelocation}
                  currentType={currentType}
                  updateState={updateState}
                />
              </Col>
            </Row>
          </Col>
        </Col>
        <Col span={6} style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', paddingRight: '16px' }}>
          <DisconnectOutlined style={{ fontSize: '50px', color: isBind ? '#53C31C' : '#ddd' }} />
        </Col>
      </Row>
      {isEidtProperty && (
        <Row style={{ border: '1px solid #000', borderTop: 'none', padding: '12px 24px' }}>
          <Col span={24}>
            <Row>
              <Col span={3}>
                <Text>属性映射：</Text>
              </Col>
              <Col span={21}>
                <TableList
                  //@ts-ignore
                  tabledata={properties}
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
            <Flex justify="end" style={{ margin: '16px' }}>
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
