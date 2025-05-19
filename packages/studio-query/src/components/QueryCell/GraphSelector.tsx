import React, { useState, useEffect } from 'react';
import { Select, Space, Divider, theme, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { Utils } from '@graphscope/studio-components';
import { useIntl, FormattedMessage } from 'react-intl';

// 引入颜色状态映射
const STATUS_MAP = {
  ACTIVE: { color: '#52c41a', label: 'graphselector.status.active' },
  INACTIVE: { color: '#ff4d4f', label: 'graphselector.status.inactive' },
  LOADING: { color: '#faad14', label: 'graphselector.status.loading' },
  UNKNOWN: { color: '#d9d9d9', label: 'graphselector.status.unknown' },
};

interface IGraph {
  id: string;
  name: string;
  status: string;
  [key: string]: any;
}

interface GraphSelectorProps {
  graphId: string;
  onGraphChange: (graphId: string) => void;
  graphs: IGraph[];
}

const { useToken } = theme;

const GraphSelector: React.FC<GraphSelectorProps> = ({ graphId, onGraphChange, graphs }) => {
  const [options, setOptions] = useState<any[]>([]);
  const { token } = useToken();
  const [selectedGraph, setSelectedGraph] = useState<IGraph | null>(null);
  const intl = useIntl();

  useEffect(() => {
    // 处理图数据选项
    if (graphs && graphs.length > 0) {
      const graphOptions = graphs
        .filter(item => Object.keys(item).length > 0)
        .map(item => ({
          label: (
            <Space>
              <FontAwesomeIcon
                icon={faDatabase}
                style={{ color: STATUS_MAP[item.status]?.color || STATUS_MAP.UNKNOWN.color }}
              />
              {item.name}
            </Space>
          ),
          value: item.id,
          data: item,
        }));

      setOptions(graphOptions);
      
      // 查找并设置当前选中的图
      const current = graphs.find(g => g.id === graphId);
      if (current) {
        setSelectedGraph(current);
      }
    }
  }, [graphs, graphId]);

  // 切换数据源
  const handleChange = (value: string) => {
    onGraphChange(value);
    
    // 更新当前选中的图信息
    const selected = graphs.find(g => g.id === value);
    if (selected) {
      setSelectedGraph(selected);
    }
  };

  // 获取当前图状态
  const status = selectedGraph?.status || 'UNKNOWN';
  const statusColor = STATUS_MAP[status]?.color || STATUS_MAP.UNKNOWN.color;
  const statusLabelId = STATUS_MAP[status]?.label || STATUS_MAP.UNKNOWN.label;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title={intl.formatMessage(
        { id: 'graphselector.status' }, 
        { status: intl.formatMessage({ id: statusLabelId }) }
      )}>
        <div 
          style={{ 
            marginRight: '6px', 
            display: 'flex', 
            alignItems: 'center' 
          }}
        >
          <span 
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: statusColor,
              display: 'inline-block',
              marginRight: '4px'
            }} 
          />
        </div>
      </Tooltip>
      
      <Select
        size="small"
        placeholder={intl.formatMessage({ id: 'graphselector.select.datasource' })}
        value={graphId}
        onChange={handleChange}
        options={options}
        style={{ 
          minWidth: '140px',
          fontSize: '13px',
        }}
        bordered={false}
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ minWidth: '160px' }}
        popupMatchSelectWidth={false}
        showSearch
        filterOption={(input, option) => 
          (option?.data?.name?.toLowerCase() || '').includes(input.toLowerCase())
        }
      />
    </div>
  );
};

export default GraphSelector; 