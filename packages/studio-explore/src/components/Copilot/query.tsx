import { Message } from './utils/message';
export const models = [
  {
    name: 'qwen-plus',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
  },
  {
    name: 'deepseek-chat',
    endpoint: 'https://api.deepseek.com/chat/completions',
  },
  {
    name: 'gpt-3.5-turbo',
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
];

export function query(
  messages: Message[],
  apiKey: string,
  signal?: AbortSignal,
): Promise<{
  status: 'success' | 'cancel' | 'failed';
  message: any;
}> {
  const model = localStorage.getItem('AI_MODEL_FOR_GS') || models[0].name;
  const { endpoint, name } = models.find(m => m.name === model) || models[0];
  return fetch(endpoint, {
    signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: name,
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
