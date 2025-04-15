import React, { FC, useState } from 'react';
import { List, Space, Typography, Tag, Divider, Popover, Popconfirm, Button, theme } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import { IJobType } from '../types';
import useStore from '../hooks/useStore';
import { useHistory } from '../../../hooks';

const { Title, Text } = Typography;

interface JobListItemProps {
  job: IJobType;
  onDelete: (id: string) => void;
}

const JobListItem: FC<JobListItemProps> = ({ job, onDelete }) => {
  const { JOB_TYPE_ICONS, statusColor, capitalizeFirstLetter, formatDateTime } = useStore();
  const history = useHistory();
  const { token } = theme.useToken();
  const { colorBgLayout } = token;
  const [id, updateId] = useState('');
  return (
    <List.Item
      style={{
        padding: '12px 12px',
        backgroundColor: job.id === id ? colorBgLayout : '',
        cursor: 'pointer',
      }}
      onMouseEnter={() => updateId(job.id)}
      onMouseLeave={() => updateId('')}
      onClick={() => history.push(`/job/detail?jobId=${job.id}`)}
    >
      <List.Item.Meta
        title={
          <Space align="center">
            <Title level={5}>{job.id}</Title>
            <Tag icon={JOB_TYPE_ICONS[job.status]} color={statusColor[job.status]}>
              {capitalizeFirstLetter(job.status.toLowerCase())}
            </Tag>
          </Space>
        }
        description={
          <Space align="center" split={<Divider type="vertical" />}>
            <Text type="secondary">GraphName: {job.graph_name}</Text>
            <Text type="secondary">JobType: {job.type}</Text>
            <Text type="secondary">{job.end_time}</Text>
          </Space>
        }
      />
      <Space>
        <Text type="secondary">{formatDateTime(dayjs(job.start_time))}</Text>
        <Popover
          placement="bottom"
          content={
            <Popconfirm
              placement="bottomRight"
              title={<FormattedMessage id="Are you sure to delete this task?" />}
              onConfirm={e => {
                e?.stopPropagation();
                onDelete(job.id);
              }}
              onCancel={e => e?.stopPropagation()}
              okText={<FormattedMessage id="Yes" />}
              cancelText={<FormattedMessage id="No" />}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<FontAwesomeIcon icon={faTrashCan} />}
                disabled={!['RUNNING', 'WAITING'].includes(job.status)}
                onClick={e => e.stopPropagation()}
              >
                <FormattedMessage id="Delete" />
              </Button>
            </Popconfirm>
          }
        >
          <EllipsisOutlined />
        </Popover>
      </Space>
    </List.Item>
  );
};

export default JobListItem;
