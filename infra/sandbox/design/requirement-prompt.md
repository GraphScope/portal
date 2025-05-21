`packages/sandbox` 是一个由 pnpm 管理的子模块，包名为 `@ai-sandbox/server`，同时它也是由 Node.js 编写的一个 HTTP 服务器，用户可以通过API接口进行沙箱环境的创建，运行，管理，删除等

期待的功能:

1. 创建沙箱

POST `/api/sandbox`，参数

```json
{
  "image": "@ai-sandbox/python",
  "options": {}
}
```

返回 containerid

2. 运行沙箱

POST `/api/sandbox/exec`，参数

```json
{
  "containerid": "xxxx",
  "files": {
    "main.py": "print('hello world')"
  },
  "command": ["python", "main.py"]
}
```

返回参数(eg)

```json
    "id": "python_run_7683de5a",
    "status": "success",
    "duration": 252,
    "stdout": "hello world",
    "stderr": ""
```
