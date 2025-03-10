import { CypherDriver } from "@graphscope/studio-driver";
const DriverMap = new Map();

export const getDriver = () => {
  const endpoint = "neo4j://127.0.0.1:7687";
  const username = "admin";
  const password = "admin";
  const id = `${endpoint}:${username}:${password}`;
  if (!DriverMap.has(id)) {
    DriverMap.set(id, new CypherDriver(endpoint, username, password));
  }
  return DriverMap.get(id);
};

export function colorize(text: any, colorCode: number) {
  return `\x1b[${colorCode}m${text}\x1b[0m`;
}

export const models = [
  {
    name: "qwen-plus",
    endpoint:
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  },
  {
    name: "deepseek-chat",
    endpoint: "https://api.deepseek.com/chat/completions",
  },
  {
    name: "gpt-4o-mini",
    endpoint: "https://api.openai.com/v1/chat/completions",
  },
];

interface Base {
  status?: "pending" | "success" | "cancel";
  role?: "system" | "assistant" | "user";
  content?: string;
  timestamp?: number;
  reserved?: boolean;
}

export class Message implements Base {
  status: "pending" | "success" | "cancel";

  role: "system" | "assistant" | "user";

  content: string;

  timestamp: number;

  reserved: boolean;

  constructor(props: Partial<Base>) {
    this.status = props.status || "pending";
    this.role = props.role || "user";
    this.content = props.content || "";
    this.timestamp = props.timestamp || Date.now();
    this.reserved = props.reserved || false;
  }
}

export function query(
  messages: Message[],
  callback?: (message: { content: string }) => void,
  signal?: AbortSignal
): Promise<{
  status: "success" | "cancel" | "failed";
  message: any;
}> {
  const model = models[0].name;
  const { endpoint, name } = models.find((m) => m.name === model) || models[0];
  const apiKey = process.env.API_KEY;
  return fetch(endpoint, {
    signal,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: name,
      stream: false, // 启用流式返回
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  })
    .then((response) => {
      const message = {
        content: "",
        complete: false,
      };
      // 返回流和 Promise
      const stream = response.body;
      if (!stream) {
        return {
          status: "failed",
          message: { content: "Response body is missing" },
        };
      }
      const reader = response.body.getReader();
      // 处理流式数据
      //@ts-ignore
      function processStream(params: any) {
        const { done, value } = params;
        message.complete = false;
        if (done) {
          message.complete = true;
          return {
            status: "success",
            message: message,
          };
        }
        const chunk = new TextDecoder().decode(value);
        chunk.split("\n").forEach((line) => {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              message.complete = true;
              return {
                status: "success",
                message: message,
              };
            }
            const parsedData = JSON.parse(data);
            if (parsedData.choices[0].delta.content !== undefined) {
              message.content =
                message.content + parsedData.choices[0].delta.content;
            }
          }
        });
        callback && callback(message);
        // 继续读取流
        return reader.read().then(processStream);
      }
      return reader.read().then(processStream);
    })
    .catch((error) => {
      if (error.name === "AbortError")
        return {
          status: "cancel",
          message: null,
        };
      return {
        status: "failed",
        message: error.message,
      };
    });
}
