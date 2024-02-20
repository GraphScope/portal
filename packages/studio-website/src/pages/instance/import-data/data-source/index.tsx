import * as React from 'react';
import { CheckCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
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
const { Text } = Typography;

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
    // handleChange && handleChange({ label, location, properties: dataSources, datatype: currentType, isBind: true });
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
    <>
      <div>
        <div
          style={{
            padding: '8px',
            borderTop: `1px solid ${token.colorBorder}`,
            background: isEidtProperty ? 'none' : '#FCFCFC',
            borderRadius: '0px 0px 8px 8px',
          }}
        >
          <Flex justify="space-between" align="center">
            <Space>
              <Button type="text" icon={ToggleIcon}></Button>
              <Flex justify="start" vertical gap={8}>
                <Space>
                  <Text style={{ display: 'inline-block', width: '100px' }}>{label}</Text>
                  <SwitchSource filelocation={filelocation} currentType={currentType} updateState={updateState} />
                </Space>
              </Flex>
            </Space>
            <Tooltip title={isBind ? '已绑定' : '未绑定'}>
              <Button
                type="text"
                icon={<CheckCircleOutlined style={{ color: isBind ? '#53C31C' : '#ddd' }} />}
              ></Button>
            </Tooltip>
          </Flex>
        </div>
        {isEidtProperty && (
          <Row
            style={{
              borderTop: isEidtProperty ? 'none' : `1px solid ${token.colorBorder}`,
              padding: '0px 8px 8px 5px',
              display: 'flex',
              justifyContent: 'end',
              transition: 'all 4s ease-in-out 1s',
              boxSizing: 'border-box',
            }}
            gutter={[0, 8]}
          >
            <Col span={18}>
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
                  handleChange &&
                    handleChange({ label, location, properties: val, datatype: currentType, isBind: true });
                }}
              />
            </Col>
            <Col span={24}>
              <Flex justify="end">
                <Space>
                  {engineType === 'interactive' ? (
                    <>
                      <ImportPeriodic />
                      <ImportNow label={label} />
                    </>
                  ) : (
                    <Button onClick={saveBindData} size="small">
                      Save Bind
                    </Button>
                  )}
                </Space>
              </Flex>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default DataSource;
