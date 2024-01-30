import * as React from 'react';
import { DisconnectOutlined } from '@ant-design/icons';
import { Form, Button, Flex, Row, Col, Space, Typography } from 'antd';
import { PropertyType } from '../index';
import ModifySource from './modify-source';
import ImportPeriodic from './import-periodic';
import ImportNow from './import-now';
import TableList from './table';
interface IImportDataProps {
  data: PropertyType;
}
const { Text } = Typography;

const DataSource: React.FunctionComponent<IImportDataProps> = props => {
  const {
    data: { label, isBind, filelocation, datatype, properties },
  } = props;
  const [form] = Form.useForm();
  const search = location.search.split('=')[1];
  const [state, updateState] = React.useState({
    /** 判断是否绑定 */
    isEidtProperty: isBind || false,
    currentType: 'ODPS',
    /** table value */
    dataSources: [],
    /** 数据源输入值 */
    inputValue: '',
  });
  const { isEidtProperty, currentType, dataSources, inputValue } = state;
  console.log(dataSources, inputValue);

  const saveisBind = () => {
    let data = {
      ...form.getFieldsValue(),
      isBind: true,
    };
    console.log(data);

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
        <Col span={18} style={{ paddingTop: '12px' }}>
          <Flex justify="flex-start">
            <Text>label:</Text> <Text>{label}</Text>
          </Flex>
          <Col span={24}>
            <Row>
              <Col span={3}>
                <Text>数据源:</Text>
              </Col>
              <Col span={21}>
                <ModifySource
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
          {isBind && isBind ? (
            <DisconnectOutlined style={{ fontSize: '50px', color: '#53C31C' }} />
          ) : (
            <DisconnectOutlined style={{ fontSize: '50px' }} />
          )}
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
                {search === 'groot' ? (
                  <>
                    <ImportPeriodic />
                    <ImportNow />
                  </>
                ) : (
                  <Button type="primary" onClick={saveisBind}>
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
