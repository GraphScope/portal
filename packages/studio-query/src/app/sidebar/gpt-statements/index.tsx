import React, { useEffect, useRef, useState } from 'react';
import { Message } from './utils/message';
import { proxy, useSnapshot } from 'valtio';
import { getWelcomeMessage, prompt as defaultPrompt, defaultWelcome } from './utils/prompt';
import { Input, Button, Flex, Typography, Space, Skeleton } from 'antd';
import { useController } from './useController';
import { useContext } from '../../context';
import { extractTextWithPlaceholders } from './utils/extractTextWithPlaceholders';
import { PlayCircleOutlined, ClearOutlined, SearchOutlined, BulbOutlined, SettingOutlined } from '@ant-design/icons';
import MessageItem from './message';
import Setting from './setting';
interface IGPTStatementsProps {
  prompt?: string;
  welcome?: string;
  schemaData: any;
}
const recommended_messages = ['帮我推荐5个有趣的查询语句吧', '帮我查看图中节点类型的统计分布', '帮我任意查询一个子图'];
const GPTStatements: React.FunctionComponent<IGPTStatementsProps> = props => {
  const { schemaData, welcome = defaultWelcome, prompt = defaultPrompt } = props;
  const [state, updateState] = useState<{ messages: Message[]; isLoading: boolean; OPENAI_KEY_FOR_GS: string | null }>({
    messages: [],
    isLoading: false,
    OPENAI_KEY_FOR_GS: localStorage.getItem('OPENAI_KEY_FOR_GS'),
  });
  const { messages, isLoading, OPENAI_KEY_FOR_GS } = state;
  const InputRef = useRef(null);
  const SettingRef = useRef(null);
  const controller = useController();
  const { updateStore } = useContext();

  useEffect(() => {
    if (schemaData) {
      updateState(pre => {
        return {
          ...pre,
          messages: [...getWelcomeMessage(welcome, prompt, schemaData)],
        };
      });
    }
  }, []);

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
      console.log('OPENAI_KEY_FOR_GS', OPENAI_KEY_FOR_GS);
      const response = await query([...messages, message], OPENAI_KEY_FOR_GS!, controller.signal);
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
  const onQuery = (content: string) => {
    updateStore(draft => {
      draft.autoRun = true;
      draft.globalScript = content;
    });
  };
  const handleClear = () => {
    updateState(pre => {
      return {
        ...pre,
        messages: [...getWelcomeMessage(welcome, prompt, schemaData)],
      };
    });
  };

  const handleSave = value => {
    updateState(pre => {
      return {
        ...pre,
        OPENAI_KEY_FOR_GS: value,
      };
    });
  };

  return (
    <Flex vertical style={{ height: '100%', overflow: 'hidden', padding: '0px 12px' }} justify="space-between">
      <div style={{ overflowY: 'scroll' }}>
        <Typography.Title level={4} style={{ margin: '0px', flexBasis: '30px', padding: '6px 0px' }}>
          Copilot
        </Typography.Title>
        <Setting onChange={handleSave} style={{ position: 'absolute', right: '4px', top: '4px' }} />

        <div>
          {messages
            .filter(m => m.role !== 'system')
            .map(item => {
              return <MessageItem key={item.timestamp} {...item} onQuery={onQuery} />;
            })}
          {isLoading && <Skeleton style={{ padding: '0px 6px' }} />}
        </div>
      </div>
      <div>
        {recommended_messages.map((item, index) => {
          return (
            <div
              style={{
                cursor: 'pointer',
                background: 'rgba(221,221,221,0.3)',
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

        <Space>
          <Input ref={InputRef}></Input>
          <Button onClick={() => handleSubmit()} icon={<SearchOutlined />}></Button>
          <Button onClick={handleClear} icon={<ClearOutlined />}></Button>
        </Space>
      </div>
    </Flex>
  );
};

export default GPTStatements;

export function query(
  messages: Message[],
  apiKey: string,
  signal?: AbortSignal,
): Promise<{
  status: 'success' | 'cancel' | 'failed';
  message: any;
}> {
  return fetch('https://api.openai.com/v1/chat/completions', {
    signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  })
    .then(res => res.json())
    .then(res => {
      return {
        status: 'success' as const,
        message: res.choices[0].message,
      };
    })
    .catch(error => {
      if (error.name === 'AbortError')
        return {
          status: 'cancel',
          message: null,
        };
      return {
        status: 'failed',
        message: error.message,
      };
    });
}
