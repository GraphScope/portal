const fs = require("fs");
const https = require("https");

const BASE_URL = "http://localhost:3000";

async function create() {
  const API_URL = `${BASE_URL}/api/sandbox`;
  const params = {
    image: "ai-spider/claude-code:latest",
    options: {
      timeout: 3000000, //300s,50min
      memoryLimit: "1024m"
    }
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  };

  try {
    // 设置环境变量来忽略SSL证书验证
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const response = await fetch(API_URL, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API响应:", data);

    // 只有在data存在时才写入文件
    if (data) {
      fs.writeFileSync("const.json", JSON.stringify(data, null, 2));
      console.log("数据已保存到 const.json");
    } else {
      console.log("没有接收到有效数据");
    }
  } catch (error) {
    console.error("请求失败:", error);
    // 写入错误信息到文件
    fs.writeFileSync(
      "error.json",
      JSON.stringify(
        {
          error: error.message,
          timestamp: new Date().toISOString()
        },
        null,
        2
      )
    );
  }
}

create();
