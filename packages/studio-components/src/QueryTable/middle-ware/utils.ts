/** 原始转化为表头内容区展示数据 */
export function handleData(mpgValues: number[]) {
  // Calculate unique values
  const uniqueValues = new Set(mpgValues).size;
  // Calculate max value
  const maxValue = Math.max(...mpgValues);
  // Calculate min value
  const minValue = Math.min(...mpgValues);
  // Calculate mean value
  const meanValue = mpgValues.reduce((acc, val) => acc + val, 0) / mpgValues.length;
  // Calculate median value
  const sortedValues = [...mpgValues].sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedValues.length / 2);
  const medianValue =
    sortedValues.length % 2 !== 0
      ? sortedValues[middleIndex]
      : (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
  // Calculate standard deviation
  const variance = mpgValues.reduce((acc, val) => acc + Math.pow(val - meanValue, 2), 0) / mpgValues.length;
  const standardDeviation = Math.sqrt(variance);
  return {
    uniqueValues,
    maxValue,
    minValue,
    meanValue: formatNumberWithThreeDecimals(meanValue),
    medianValue: formatNumberWithThreeDecimals(medianValue),
    standardDeviation: formatNumberWithThreeDecimals(standardDeviation),
  };
}

function formatNumberWithThreeDecimals(num: number) {
  return Number.isInteger(num) ? num : parseFloat(num.toFixed(3));
}

export function filterData(fid: string, dataSource) {
  const chartCount = dataSource.reduce((pre, next) => {
    const origin = next[fid];
    if (pre[origin]) {
      pre[origin]++;
    } else {
      pre[origin] = 1;
    }
    return pre;
  }, {});

  const chartData = Object.entries(chartCount).map(([origin, count]) => ({
    name: origin,
    count: count,
  }));
  return { chartCount, chartData };
}
