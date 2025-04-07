import React from "react";
import { Typography, Card, Divider } from "antd";

const { Title, Paragraph, Text, Link } = Typography;

const AboutPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>关于 DuckDB CSV 查询工具</Title>
      <Paragraph>
        这是一个基于 DuckDB-WASM 的 CSV
        数据查询工具，支持数据集管理和持久化存储。 您可以上传 CSV 文件，然后使用
        SQL 查询您的数据。
      </Paragraph>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>功能特点</Title>
        <ul>
          <li>上传和管理多个 CSV 数据集</li>
          <li>使用 SQL 查询您的数据</li>
          <li>数据在浏览器中持久化存储</li>
          <li>导出查询结果为 CSV、JSON 或 TSV 格式</li>
          <li>完全在浏览器中运行，无需服务器</li>
        </ul>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>技术实现</Title>
        <Paragraph>此应用使用以下技术构建：</Paragraph>
        <ul>
          <li>
            <Text strong>DuckDB-WASM</Text> - 在浏览器中运行的 SQL 数据库
          </li>
          <li>
            <Text strong>React</Text> - 用户界面框架
          </li>
          <li>
            <Text strong>Ant Design</Text> - UI 组件库
          </li>
          <li>
            <Text strong>IndexedDB</Text> - 用于持久化存储数据
          </li>
          <li>
            <Text strong>Web Workers</Text> - 用于在后台处理数据
          </li>
        </ul>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>使用说明</Title>
        <Title level={4}>数据集管理</Title>
        <ol>
          <li>前往"数据集"页面</li>
          <li>点击"上传新数据集"按钮</li>
          <li>为您的数据集提供一个唯一的名称</li>
          <li>选择要上传的 CSV 文件</li>
          <li>点击"上传"按钮</li>
        </ol>

        <Divider />

        <Title level={4}>查询数据</Title>
        <ol>
          <li>前往"查询"页面</li>
          <li>从下拉菜单中选择一个数据集</li>
          <li>在查询编辑器中输入您的 SQL 查询</li>
          <li>点击"执行查询"按钮</li>
          <li>在"结果"标签页中查看查询结果</li>
          <li>根据需要导出结果</li>
        </ol>

        <Divider />

        <Title level={4}>SQL 示例</Title>
        <Paragraph>以下是一些您可能会用到的 SQL 查询示例：</Paragraph>
        <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4 }}>
          {`-- 基本查询
SELECT * FROM "my_dataset" LIMIT 100;

-- 筛选数据
SELECT * FROM "my_dataset" WHERE column_name > 100;

-- 聚合查询
SELECT category, COUNT(*) as count, AVG(value) as average
FROM "my_dataset"
GROUP BY category
ORDER BY count DESC;

-- 连接查询（多个数据集）
SELECT a.*, b.additional_column
FROM "dataset_a" a
JOIN "dataset_b" b ON a.id = b.id;`}
        </pre>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>数据安全</Title>
        <Paragraph>
          所有数据都存储在您的浏览器中，不会上传到任何服务器。数据使用浏览器的
          IndexedDB
          存储机制进行持久化存储。清除浏览器数据会导致存储的数据集丢失。
        </Paragraph>
      </Card>
    </div>
  );
};

export default AboutPage;
