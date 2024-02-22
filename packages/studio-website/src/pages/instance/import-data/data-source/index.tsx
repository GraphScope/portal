import * as React from 'react';
import { CheckCircleOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Col, Space, Typography, theme, Tooltip } from 'antd';
import { BindingEdge, BindingNode, useDataMap, updateDataMap } from '../useContext';
import SwitchSource from './switch-source';
import ImportPeriodic from './import-periodic';
import ImportNow from './import-now';
import TableList from './table';
import { getUrlParams } from '@/components/utils';
import { useContext } from '../useContext';
const { useToken } = theme;
interface IImportDataProps {
  id: string;
}
const { Text } = Typography;

const ToggleIcon = ({ isEidtProperty, handleClick }) => {
  if (isEidtProperty) {
    return <CaretDownOutlined onClick={handleClick} />;
  }
  return <CaretUpOutlined onClick={handleClick} />;
};
const DataSource: React.FunctionComponent<IImportDataProps> = props => {
  const { id } = props;
  const dataMap = useDataMap();
  console.log('dataMap', dataMap, id);
  const data = dataMap[id] as BindingNode & { isEidtProperty: boolean };
  const { isBind, filelocation, isEidtProperty, datatype, label, properties } = data;
  const { token } = useToken();
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  const { engineType, graph } = getUrlParams();

  const saveBindData = () => {
    updateDataMap(draft => {
      draft[id].isEidtProperty = false;
    });
  };
  /** 折叠面板 */
  const handleToggle = () => {
    updateDataMap(draft => {
      draft[id].isEidtProperty = !draft[id].isEidtProperty;
    });
  };
  /** 改变数据源类型 */
  const onChangeType = (type: string) => {
    updateDataMap(draft => {
      draft[id].datatype = type;
    });
  };
  /** 改变数据源地址 */
  const onChangeValue = (e: any) => {
    console.log('e', e.target.value);
    const { value } = e.target;

    updateDataMap(draft => {
      draft[id].filelocation = value;
      draft[id].isBind = value !== '';
    });
  };
  /** 聚焦到数据源的时候 */
  const onFocus = () => {
    updateDataMap(draft => {
      draft[id].isEidtProperty = true;
    });
  };
  /** 改变表格映射字段 */
  const onChangeTable = (values: any) => {
    updateDataMap(draft => {
      draft[id].properties = values;
    });
  };

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
              <Button
                type="text"
                icon={<ToggleIcon isEidtProperty={isEidtProperty} handleClick={handleToggle} />}
              ></Button>
              <Flex justify="start" vertical gap={8}>
                <Space>
                  <Text style={{ display: 'inline-block', width: '100px' }}>{label}</Text>
                  <SwitchSource
                    filelocation={filelocation}
                    currentType={datatype}
                    onChangeType={onChangeType}
                    onChangeValue={onChangeValue}
                    onFocus={onFocus}
                  />
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
            <Col span={19}>
              <TableList
                //@ts-ignore
                tabledata={JSON.parse(
                  JSON.stringify(
                    properties.map(item => {
                      return {
                        ...item,
                        key: item.id,
                      };
                    }),
                  ),
                )}
                onChange={onChangeTable}
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
