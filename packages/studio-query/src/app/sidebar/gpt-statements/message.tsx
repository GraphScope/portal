import * as React from 'react';
import { Button, Typography, Space, Flex, theme, Tooltip } from 'antd';
import { PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
import { extractTextWithPlaceholders } from './utils/extractTextWithPlaceholders';
import type { Message as CMessage } from './utils/message';
import { AssistantIcon } from './dialog/assistant-icon';
const { useToken } = theme;
const CypherMessage = ({ content, onQuery }) => {
  const handleClick = () => {
    onQuery && onQuery(content);
  };
  return (
    <div style={{ position: 'relative' }}>
      <pre style={{ border: '1px solid #ddd', padding: '6px', borderRadius: '4px' }}>
        <code style={{ whiteSpace: 'pre-wrap' }}>{content}</code>
      </pre>
      <Tooltip title="开始查询">
        <Button
          style={{ position: 'absolute', bottom: '2px', right: '2px' }}
          onClick={handleClick}
          size="small"
          icon={<PlayCircleOutlined />}
        ></Button>
      </Tooltip>
    </div>
  );
};
const TextMessage = ({ content, role }) => {
  const { token } = useToken();
  const bgColor = role === 'user' ? 'rgba(221,221,221,0.3)' : token.colorPrimaryBg;

  return (
    <div style={{ background: bgColor, borderRadius: '6px', padding: '6px' }}>
      <Typography.Text style={{ fontSize: '12px' }}> {content}</Typography.Text>
    </div>
  );
};

const Message: React.FunctionComponent<CMessage & { onQuery: (value: string) => void }> = props => {
  const { role, content, timestamp, onQuery } = props;
  const disablePreview = role === 'user' && !content.includes('`');
  const info = extractTextWithPlaceholders(content);

  if (disablePreview) {
    return (
      <Flex align="start" justify="flex-end" gap={4} style={{ margin: '6px 0px' }}>
        <TextMessage content={content} role={role} />
        <UserOutlined />
      </Flex>
    );
  }

  return (
    <div>
      <Space align="start" size={2}>
        <AssistantIcon
          style={{
            fontSize: '12px',
            height: '14px',
            width: '14px',
            border: '1px solid #ddd',
            borderRadius: '50%',
            padding: '4px',
          }}
        />
        <div>
          {info.map(item => {
            if (item.type === 'cypher') {
              return <CypherMessage content={item.content} onQuery={onQuery} />;
            }
            return <TextMessage content={item.content} role={role} />;
          })}
        </div>
      </Space>
    </div>
  );
};

export default Message;
