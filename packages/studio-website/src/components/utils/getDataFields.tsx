export const getDataFields = async (file: File): Promise<{ dataFields: string[]; delimiter: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // 以文本形式读取文件
    reader.readAsText(file);
    // 监听读取完成事件
    reader.onload = function (event) {
      // 读取文件内容
      if (event) {
        const contents = event.target!.result as string;
        // 将 CSV 文件内容按行拆分成数组
        const rows = contents.split('\n');
        let delimiter = '',
          dataFields = [];
        // 获取 header 行，假设 header 行在第一行
        const header1 = rows[0].trim().split(',');
        const header2 = rows[0].trim().split('|');

        if (header1.length > header2.length) {
          delimiter = ',';
          dataFields = header1;
        } else {
          delimiter = '|';
          dataFields = header2;
        }
        resolve({ dataFields, delimiter });
      }
    };
    // 监听读取失败事件
    reader.onerror = function (event) {
      reject([event.target!.error]);
    };
  });
};
