// import fetch from "node-fetch";
const fs = require("fs");
const http = require("http");
const { containerId } = require("../const.json");
console.log("containerId", containerId);

const API_URL = "http://localhost:3000";

async function createSession() {
  const postData = JSON.stringify({
    containerId,
    prompt: "try to visit http://jiaotong.00cha.net/jl.html and get the content of the page",
    outputFormat: "stream-json",
    taskId: "blog-system-dev"
  });

  const url = new URL(`${API_URL}/api/claude/session/create`);

  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  };

  let buffer = "";

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log("开始接收流式数据...");

    res.on("data", (chunk) => {
      const data = chunk.toString();
      buffer += data;

      // 调试：显示原始数据
      console.log("收到数据块:", data);

      // 按行分割并处理
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // 保留不完整的行

      lines.forEach((line) => {
        line = line.trim();
        if (line.startsWith("data: ")) {
          const jsonStr = line.substring(6);
          console.log("解析JSON:", jsonStr);

          try {
            const jsonData = JSON.parse(jsonStr);
            handleMessage(jsonData);
          } catch (e) {
            console.log("JSON解析失败:", e.message);
            console.log("原始数据:", jsonStr);
          }
        } else if (line && !line.startsWith(":") && line !== "") {
          console.log("其他行:", line);
        }
      });
    });

    res.on("end", () => {
      console.log("连接结束");
    });
  });

  req.on("error", (error) => {
    console.error("请求错误:", error);
  });

  req.write(postData);
  req.end();
}

function handleMessage(data) {
  console.log("处理消息类型:", data.type);

  switch (data.type) {
    case "session_start":
      console.log("会话开始，Session ID:", data.session_id);
      break;
    case "system":
      if (data.subtype === "init") {
        console.log("系统初始化，Session ID:", data.session_id);
        console.log("工作目录:", data.cwd);
        console.log("可用工具:", data.tools.join(", "));
      }
      break;
    case "content":
      // 实时显示生成的内容
      displayContent(data.content);
      break;
    case "stream_end":
      console.log("会话结束");
      break;
    case "result":
      console.log("任务完成，结果:", data.result);
      console.log("成本:", data.total_cost_usd, "USD");
      console.log("执行时间:", data.duration_ms, "ms");
      break;
    default:
      console.log("未知消息类型:", data.type);
      console.log("消息内容:", data);
  }
}

function displayContent(content) {
  process.stdout.write(content);
}

createSession();
