// 引入必要的库
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const path = require('path');
// 定义生成器函数
function generateCustomerData(numCustomers) {
  const provinces = [
    '北京',
    '天津',
    '河北',
    '山西',
    '内蒙古',
    '辽宁',
    '吉林',
    '黑龙江',
    '上海',
    '江苏',
    '浙江',
    '安徽',
    '福建',
    '江西',
    '山东',
    '河南',
    '湖北',
    '湖南',
    '广东',
    '广西',
    '海南',
    '重庆',
    '四川',
    '贵州',
    '云南',
    '西藏',
    '陕西',
    '甘肃',
    '青海',
    '宁夏',
    '新疆',
  ];

  const customers = [];
  const edges = [];
  const numWhiteSamples = Math.floor(numCustomers * 0.9);
  const numBlackSamples = numCustomers - numWhiteSamples;

  // 生成白样本客户
  for (let i = 0; i < numWhiteSamples; i++) {
    const age = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    const ip_address = faker.internet.ip();

    customers.push({
      id: i,
      type: 'white',
      age: age,
      province,
    });
  }

  // 生成黑样本客户
  for (let i = 0; i < numBlackSamples; i++) {
    const age = Math.floor(Math.random() * (40 - 35 + 1)) + 35;
    let province;
    if (Math.random() < 0.5) {
      province = '云南';
    } else {
      province = provinces.filter(p => p !== '云南')[Math.floor(Math.random() * (provinces.length - 1))];
    }
    const ip_address = faker.internet.ip();

    customers.push({
      id: numWhiteSamples + i,
      type: 'black',
      age: age,
      province,
    });
  }

  // 生成交易关系
  customers.forEach(customer => {
    let numTransactions;
    let amountMin, amountMax;
    let whiteProbability;

    if (customer.type === 'white') {
      numTransactions = Math.floor(Math.random() * 3) + 1; // 1到3笔交易
      amountMin = 1;
      amountMax = 10000;
      whiteProbability = 0.95;
    } else {
      numTransactions = Math.floor(Math.random() * 8) + 1; // 1到8笔交易
      amountMin = 5000;
      amountMax = 10000;
      whiteProbability = 0.2;
    }

    for (let j = 0; j < numTransactions; j++) {
      let targetCustomer;
      if (Math.random() < whiteProbability) {
        // 交易对手是白客户
        const whiteCustomers = customers.filter(c => c.type === 'white' && c.id !== customer.id);
        targetCustomer = whiteCustomers[Math.floor(Math.random() * whiteCustomers.length)];
      } else {
        // 交易对手是黑客户
        const blackCustomers = customers.filter(c => c.type === 'black' && c.id !== customer.id);
        targetCustomer = blackCustomers[Math.floor(Math.random() * blackCustomers.length)];
      }

      if (targetCustomer) {
        edges.push({
          from: customer.id,
          to: targetCustomer.id,
          amount: parseFloat((Math.random() * (amountMax - amountMin) + amountMin).toFixed(2)), // 随机金额，保留两位小数
          date: faker.date.past(), // 过去的随机日期
        });
      }
    }
  });

  return { nodes: customers, edges };
}

// 写入数据到本地文件
function writeDataToFile(filename, data) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', err => {
    if (err) {
      console.error('写入文件失败:', err);
    } else {
      console.log('数据成功写入到', filename);
    }
  });
}

function writeDataToCSV(data, filename) {
  const firstData = data[0];
  const header = Object.keys(firstData).join(',') + '\n';
  const rows = data
    .map(item => {
      return Object.values(item).join(',') + '\n';
    })
    .join(''); // 这里应该使用空字符串 "" 而不是逗号 ","
  fs.writeFileSync(path.resolve(__dirname, '../csv', filename), header + rows, 'utf8');
  console.log(`csv written to ${filename}`);
}

// 示例调用

// writeDataToFile("customerData-20.json", generateCustomerData(20));
// writeDataToFile("customerData-2000.json", generateCustomerData(2000));

const numCustomers = 100;
const data = generateCustomerData(numCustomers);

writeDataToCSV(data.nodes, `nodes-${numCustomers}.csv`);
writeDataToCSV(data.edges, `edges-${numCustomers}.csv`);
