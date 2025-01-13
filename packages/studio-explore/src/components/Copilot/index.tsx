import React, { useEffect, useRef, useState } from 'react';
import { Message } from './utils/message';

import {
  getWelcomeMessage,
  defaultWelcome,
  TEMPLATE_QUERY_GENERATOR,
  get_query_system_prompts,
  get_report_system_prompts,
} from './utils/prompt';
import { Input, Button, Flex, Typography, Space, Skeleton, theme } from 'antd';
import { useController } from './useController';
import { useContext } from '@graphscope/studio-graph';
import { extractTextWithPlaceholders } from './utils/extractTextWithPlaceholders';
import { PlayCircleOutlined, ClearOutlined, SearchOutlined, BulbOutlined, SettingOutlined } from '@ant-design/icons';
import MessageItem from './message';
import Setting from './setting';
import { useIntl } from 'react-intl';

import { query } from './query';
interface IGPTStatementsProps {}

const { useToken } = theme;
const GPTStatements: React.FunctionComponent<IGPTStatementsProps> = props => {
  const [state, updateState] = useState<{ messages: Message[]; isLoading: boolean }>({
    messages: [],
    isLoading: false,
  });
  const { messages, isLoading } = state;
  const InputRef = useRef(null);
  const { token } = useToken();
  const { store } = useContext();
  const { schema, selectNodes } = store;

  const controller = useController();
  const { updateStore } = useContext();
  const intl = useIntl();
  const recommended_messages = [
    'write a related work section about the given data, you should focus on challenges only',
    // intl.formatMessage({
    //   id: 'recommend 5 interesting query statements',
    // }),
    // intl.formatMessage({
    //   id: 'query any subgraph',
    // }),
    // intl.formatMessage({
    //   id: 'insight the statistical distribution of vertex labels in the graph',
    // }),
  ];
  const welcome = intl.formatMessage({
    id: 'query.copilot.welcome',
  });

  const handleSubmit = async (script?: string) => {
    if (InputRef.current) {
      //@ts-ignore
      const { value } = InputRef.current.input;
      const message = new Message({
        role: 'user',
        content: script || value,
      });

      updateState(pre => {
        return {
          ...pre,
          messages: [...pre.messages, message],
          isLoading: true,
        };
      });

      const response = await query([...messages, message], controller.signal);
      if (!response) {
        updateState(preState => {
          return {
            ...preState,
            isLoading: false,
          };
        });
        return false;
      }
      // addMessage(
      //   new Message({
      //     role: response.message.role,
      //     content: response.message.content,
      //     status: 'success',
      //   }),
      // );
      updateState(pre => {
        return {
          ...pre,
          messages: [
            ...pre.messages,
            new Message({
              role: response.message.role,
              content: response.message.content,
              status: 'success',
            }),
          ],
          isLoading: false,
        };
      });
    }
  };
  //@ts-ignore
  window.runAI = handleSubmit;
  const onQuery = (content: string) => {
    console.log('content');
    updateStore(draft => {});
  };
  const handleClear = () => {
    updateState(pre => {
      return {
        ...pre,
        messages: [...getWelcomeMessage(welcome)],
      };
    });
  };

  const queryMindmap = () => {};
  const queryTask = task => {
    if (task === 'query') {
      updateState(preState => {
        return {
          ...preState,
          messages: [
            new Message({
              role: 'system',
              status: 'success',
              timestamp: Date.now(),
              reserved: true,

              content: get_query_system_prompts(JSON.stringify(schema, null, 2)),
            }),
            new Message({
              status: 'success',
              role: 'assistant',
              content: welcome,
              timestamp: Date.now(),
              reserved: true,
            }),
          ],
        };
      });
    }
    if (task === 'analysis') {
      updateState(preState => {
        return {
          ...preState,
          messages: [
            new Message({
              role: 'system',
              status: 'success',
              timestamp: Date.now(),
              reserved: true,
              content: get_report_system_prompts(JSON.stringify(schema, null, 2)),
            }),
            new Message({
              status: 'success',
              role: 'assistant',
              content: '您好！我是 GraphScope 分析助理，您你可以先选中要分析的数据，方便我为你分析',

              timestamp: Date.now(),
              reserved: true,
            }),
          ],
        };
      });
    }
    updateState(preState => {
      return {
        ...preState,
        messages: [
          new Message({
            status: 'success',
            role: 'assistant',
            content: '您好！我是 GraphScope Copilot,有什么可以帮到你的',
            timestamp: Date.now(),
            reserved: true,
          }),
        ],
      };
    });
  };

  return (
    <Flex vertical justify="space-between">
      <Flex vertical gap={12} flex={1}>
        <Flex justify="space-between" align="center">
          <Typography.Text type="secondary" italic>
            Think like a bot
          </Typography.Text>
          <Setting />
        </Flex>
        <Flex vertical gap={12} style={{ overflowY: 'scroll', height: 'calc(100vh - 170px)' }}>
          <Typography.Text type="secondary" italic>
            select role
          </Typography.Text>
          <Space>
            <Button
              onClick={() => {
                queryTask('query');
              }}
            >
              Query
            </Button>
            <Button
              onClick={() => {
                queryTask('analysis');
              }}
            >
              Mindmap
            </Button>
            <Button
              onClick={() => {
                queryTask('chat');
              }}
            >
              Analysis
            </Button>
          </Space>

          {messages
            .filter(m => m.role !== 'system')
            .map(item => {
              return <MessageItem key={item.timestamp} {...item} onQuery={onQuery} />;
            })}
          {isLoading && <Skeleton style={{ padding: '0px 6px' }} />}
        </Flex>
      </Flex>
      <Flex vertical>
        <Flex vertical gap={12}>
          {recommended_messages.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  cursor: 'pointer',
                  background: token.colorBgLayout,
                  padding: '4px',
                  borderRadius: '6px',
                  margin: '6px 0px',
                }}
              >
                <BulbOutlined style={{ fontSize: '12px', marginRight: '4px' }} />
                <Typography.Text
                  key={index}
                  onClick={() => {
                    handleSubmit(item);
                  }}
                  style={{
                    fontSize: '12px',
                  }}
                >
                  {item}
                </Typography.Text>
              </div>
            );
          })}
        </Flex>
        <Flex gap={8}>
          <Input ref={InputRef}></Input>
          <Button onClick={() => handleSubmit()} icon={<SearchOutlined />}></Button>
          <Button onClick={handleClear} icon={<ClearOutlined />}></Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GPTStatements;
