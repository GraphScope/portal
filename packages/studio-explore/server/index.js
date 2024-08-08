const express = require('express');
const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');

const cors = require('cors');
const app = express();

const port = 7777;

app.use(cors());
app.use(express.json());

app.get('/api/query', (req, res) => {
  const results = [];
  const { type, weight, name } = req.query;
  let filename = `${name}.csv`;
  if (weight) {
    filename = `${name}_${weight}.csv`;
  }

  const filePath = path.resolve(__dirname, 'data', filename);

  // 检查文件是否存在
  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) {
      console.error('File does not exist:', filePath);
      return res.status(404).send({
        success: false,
        message: 'File not found',
      });
    }

    const stream = fs
      .createReadStream(filePath)
      .pipe(csv({ separator: '|' }))
      .on('data', data => results.push(data))
      .on('end', () => {
        let data = results;
        if (type === 'nodes') {
          data = {
            nodes: results.map(item => ({
              id: item.id,
              label: name,
              properties: item,
            })),
            edges: [],
          };
        }
        if (type === 'edges') {
          data = {
            nodes: [],
            edges: results.map(item => ({
              id: `${item.source}_${item.target}`,
              source: item.source,
              target: item.target,
              label: name,
              properties: item,
            })),
          };
        }

        res.send({
          success: true,
          data,
        });
      })
      .on('error', err => {
        console.error('Stream error:', err);
        res.status(500).send({
          success: false,
          message: err.message,
        });
      });

    // 超时机制，防止流操作意外阻塞
    const timeout = setTimeout(() => {
      console.error('Stream processing timeout');
      stream.destroy();
      res.status(500).send({
        success: false,
        message: 'Stream processing timeout',
      });
    }, 10000); // 10秒超时

    // 清除超时定时器
    stream.on('end', () => clearTimeout(timeout));
    stream.on('error', () => clearTimeout(timeout));
  });
});

// 全局错误处理程序
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(port);

console.log('Service listen on', `http://127.0.0.1:${port}`);
