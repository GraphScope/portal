import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Flex, Button, Modal, Input } from 'antd';
import { AppstoreOutlined, EditOutlined } from '@ant-design/icons';
import TableHeaderContent from './table-header-content';
import Bar from './bar';
import Area from './area';
import { handleData, filterData } from './utils';

export interface IBarProps {
  id: string;
  analyticType: 'dimension' | 'measure';
  data: { [key: string]: string | number }[];
  handleEditHeader: (id: string, val: string) => void;
}
interface IState {
  isShow: boolean;
  type: 'dimension' | 'measure';
  dataSource: { name: string | number; count: number | unknown }[];
  isChecked: boolean;
  isOpen: boolean;
  imputValue: string;
}
const styles: React.CSSProperties = {
  width: '80px',
  fontSize: '18px',
  color: '#323130',
  fontWeight: 400,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const MiddleWare: React.FC<IBarProps> = props => {
  const { id, analyticType, data, handleEditHeader } = props;
  const [state, updateState] = useState<IState>({
    isShow: false,
    type: analyticType,
    dataSource: [],
    isChecked: true,
    isOpen: false,
    imputValue: '',
  });

  const { isShow, type, dataSource, isChecked, isOpen, imputValue } = state;

  const { chartCount, chartData } = filterData(id, data);

  const dataCollection = useMemo(() => {
    const data = Object.values(chartCount).map(Number);
    if (!data) return [];
    if (type === 'dimension') {
      return [
        { name: '唯一值', count: isChecked ? handleData(data).uniqueValues : 0 },
        { name: '计数', count: isChecked ? dataSource.length : '' },
      ];
    }

    if (type === 'measure') {
      const stats = handleData(data);
      return [
        { name: '唯一值', count: stats.uniqueValues },
        { name: '计数', count: dataSource.length },
        { name: '最小值', count: stats.minValue },
        { name: '最大值', count: stats.maxValue },
        { name: '平均值', count: stats.meanValue },
        { name: '中位数', count: stats.medianValue },
        { name: '标准差', count: stats.standardDeviation },
      ];
    }

    return [];
  }, [type, dataSource.length, isChecked]);
  /** 鼠标事件 */
  const handleMouseChange = useCallback((show: boolean) => {
    updateState(preset => ({ ...preset, isShow: show }));
  }, []);
  /** change type */
  const handleSelectTypeChange = (type: string) => {
    if (type === '类别类型') {
      updateState(preset => {
        return {
          ...preset,
          type: 'dimension',
          dataSource: chartData.slice(0, 10),
        };
      });
    }
    if (type === '有序类型') {
      updateState(preset => {
        return {
          ...preset,
          type: 'dimension',
          dataSource: chartData,
        };
      });
    }
    if (type === '数值类型') {
      updateState(preset => {
        return {
          ...preset,
          type: 'measure',
          dataSource: chartData.slice(0, 10),
        };
      });
    }
    if (type === '时间类型') {
      // updateState(preset => {
      //   return {
      //     ...preset,
      // type: 'measure',
      //     dataSource: chartData,
      //   };
      // });
    }
  };
  const handleSelectScaleChange = scale => {
    console.log(scale);
  };
  const handleCheckboxChange = check => {
    updateState(preset => {
      return {
        ...preset,
        isChecked: check,
      };
    });
  };
  /** 表格头部 echart */
  let headerChart: React.ReactNode;
  if (type === 'dimension') {
    headerChart = <Bar id={id} data={dataSource} />;
  }
  if (type === 'measure') {
    headerChart = <Area id={id} data={dataSource} />;
  }
  const handleInputChange = evt => {
    updateState(preset => {
      return {
        ...preset,
        imputValue: evt.target.value,
      };
    });
  };
  const handleSubmit = () => {
    handleEditHeader(id, imputValue);
    updateState(preset => {
      return {
        ...preset,
        isOpen: false,
      };
    });
  };
  /** 初始化数据 */
  useEffect(() => {
    const { chartCount, chartData } = filterData(id, data);
    if (type === 'dimension') {
      updateState(preset => {
        return {
          ...preset,
          dataSource: chartData.slice(0, 10),
        };
      });
    }
    if (type === 'measure') {
      updateState(preset => {
        return {
          ...preset,
          dataSource: chartData.slice(0, 10),
        };
      });
    }
  }, []);
  return (
    <div
      style={{ height: '300px', padding: '8px 0px' }}
      onMouseEnter={() => handleMouseChange(true)}
      onMouseLeave={() => handleMouseChange(false)}
    >
      <Flex justify="space-between" align="center">
        <span style={styles}>{id}</span>
        {isShow && (
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              updateState(preset => {
                return {
                  ...preset,
                  isOpen: true,
                  imputValue: id,
                };
              });
            }}
          />
        )}
        <Button type="text" size="small" icon={<AppstoreOutlined />} />
      </Flex>
      {headerChart}
      {id && (
        <TableHeaderContent
          isShow={isShow}
          isChecked={isChecked}
          type={type as 'dimension' | 'measure'}
          data={dataCollection}
          handleSelectTypeChange={handleSelectTypeChange}
          handleSelectScaleChange={handleSelectScaleChange}
          handleCheckboxChange={handleCheckboxChange}
        />
      )}
      <Modal
        title="编辑字段名称"
        open={isOpen}
        onOk={handleSubmit}
        onCancel={() => {
          updateState(preset => {
            return {
              ...preset,
              isOpen: false,
            };
          });
        }}
      >
        <Flex vertical gap={8}>
          <span>字段名称</span>
          <Input value={imputValue} onChange={handleInputChange} />
        </Flex>
      </Modal>
    </div>
  );
};

export default MiddleWare;
