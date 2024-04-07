import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { CheckCircleOutlined, CaretUpOutlined, CaretDownOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Col, Space, Typography, theme, Tooltip } from 'antd';
import { BindingNode, useDataMap, updateDataMap } from '../useContext';
import SwitchSource from './switch-source';
// import ImportPeriodic from './import-periodic';
import ImportNow from './import-now';
import TableList from './table';
// import { getUrlParams } from '@/components/utils';
import { useContext } from '@/layouts/useContext';
import { transformDataMapToScheduledImportOptions } from '@/components/utils/import';
// import { createGrootDataloadingJob } from '../service';

const { useToken } = theme;
interface IImportDataProps {
  id: string;
}
const { Text } = Typography;

const ToggleIcon = (props: any) => {
  const { isEidtProperty, handleClick } = props;
  if (isEidtProperty) {
    return <CaretDownOutlined onClick={handleClick} />;
  }
  return <CaretUpOutlined onClick={handleClick} />;
};
const DataSource: React.FunctionComponent<IImportDataProps> = props => {
  const { id } = props;
  const dataMap = useDataMap();

  const data = dataMap[id] as BindingNode & { isEidtProperty: boolean };
  const { isBind, filelocation, isEidtProperty, datatype, label, properties, dataFields } = data;
  const { token } = useToken();
  /** 根据引擎的类型，进行部分UI的隐藏和展示 */
  // const { graph } = getUrlParams();
  const { store } = useContext();
  const engineType = window.GS_ENGINE_TYPE;
  const { mode } = store;
  /** 折叠面板 */
  const handleToggle = () => {
    updateDataMap(draft => {
      //@ts-ignore
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
  const onChangeValue = (value: string) => {
    updateDataMap(draft => {
      draft[id].filelocation = value;
      draft[id].isBind = value !== '';
      //@ts-ignore
      draft[id].isEidtProperty = true;
    });
  };
  /** 聚焦到数据源的时候 */
  const onChangeFocus = () => {
    updateDataMap(draft => {
      //@ts-ignore
      draft[id].isEidtProperty = true;
    });
  };
  /** 改变表格映射字段 */
  const onChangeTable = (values: any) => {
    updateDataMap(draft => {
      draft[id].properties = values;
    });
  };
  const onChangeDataFields = (header?: { dataFields: string[]; delimiter: string }) => {
    updateDataMap(draft => {
      draft[id].dataFields = header?.dataFields;
      draft[id].delimiter = header?.delimiter;
    });
  };
  /** 周期导入 */
  const handleSubmit = () => {
    //@ts-ignore
    const { label, source, target } = data;
    const edgesOptions = transformDataMapToScheduledImportOptions({ dataMap, data });
    const params = {
      vertices: source && target ? [''] : [label],
      edges: edgesOptions,
      schedule: '',
      repeat: 'once',
    };
    console.log(params);
    // createGrootDataloadingJob(params);
  };
  /** 融合判断 是否编辑或主题 dark  */
  const primaryColor = mode !== 'defaultAlgorithm' || isEidtProperty;
  return (
    <>
      <div>
        <div
          style={{
            padding: '8px',
            borderTop: `1px solid ${token.colorBorder}`,
            background: primaryColor ? 'none' : '#FCFCFC',
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
                    onChangeFocus={onChangeFocus}
                    onChangeDataFields={onChangeDataFields}
                  />
                </Space>
              </Flex>
            </Space>
            <Tooltip
              title={
                isBind ? <FormattedMessage id="Bound data source" /> : <FormattedMessage id="Unbound data source" />
              }
            >
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
                dataFields={dataFields}
              />
            </Col>
            <Col span={24}>
              <Flex justify="end">
                <Space>
                  {engineType === 'groot' && (
                    <>
                      {/* <ImportPeriodic handleSubmit={handleSubmit} /> */}
                      <Button size="small" onClick={handleSubmit}>
                        Scheduled import
                      </Button>
                      <ImportNow nodes={data} />
                    </>
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
