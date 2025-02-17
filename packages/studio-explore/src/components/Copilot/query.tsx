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
    name: 'gpt-4o-mini',
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
];

// export function query(
//   messages: Message[],
//   signal?: AbortSignal,
// ): Promise<{
//   status: 'success' | 'cancel' | 'failed';
//   message: any;
// }> {
//   const model = localStorage.getItem('AI_MODEL_FOR_GS') || models[0].name;
//   const { endpoint, name } = models.find(m => m.name === model) || models[0];
//   const apiKey = localStorage.getItem('OPENAI_KEY_FOR_GS');
//   return fetch(endpoint, {
//     signal,
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify({
//       model: name,
//       messages: messages.map(({ role, content }) => ({ role, content })),
//     }),
//   })
//     .then(res => res.json())
//     .then(res => {
//       return {
//         status: 'success' as const,
//         message: res.choices[0].message,
//       };
//     })
//     .catch(error => {
//       if (error.name === 'AbortError')
//         return {
//           status: 'cancel',
//           message: null,
//         };
//       return {
//         status: 'failed',
//         message: error.message,
//       };
//     });
// }

export function query(
  messages: Message[],
  callback?: (message: { content: string }) => void,
  signal?: AbortSignal,
): Promise<{
  status: 'success' | 'cancel' | 'failed';
  message: any;
}> {
  const model = localStorage.getItem('AI_MODEL_FOR_GS') || models[0].name;
  const { endpoint, name } = models.find(m => m.name === model) || models[0];
  const apiKey = localStorage.getItem('OPENAI_KEY_FOR_GS');
  return fetch(endpoint, {
    signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: name,
      stream: true, // 启用流式返回
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  })
    .then(response => {
      const message = {
        content: '',
        complete: false,
      };
      // 返回流和 Promise
      const stream = response.body;
      if (!stream) {
        return {
          status: 'failed',
          message: { content: 'Response body is missing' },
        };
      }
      const reader = response.body.getReader();
      // 处理流式数据
      function processStream(params) {
        const { done, value } = params;
        message.complete = false;
        if (done) {
          message.complete = true;
          return {
            status: 'success',
            message: message,
          };
        }
        const chunk = new TextDecoder().decode(value);
        chunk.split('\n').forEach(line => {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              message.complete = true;
              return {
                status: 'success',
                message: message,
              };
            }
            const parsedData = JSON.parse(data);
            if (parsedData.choices[0].delta.content !== undefined) {
              message.content = message.content + parsedData.choices[0].delta.content;
            }
          }
        });
        callback && callback(message);
        // 继续读取流
        return reader.read().then(processStream);
      }
      return reader.read().then(processStream);
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
