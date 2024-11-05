import React from 'react';
import { Flex } from 'antd';
import type { InteranctiveDataType } from './typing';
import { JsonShow } from './json-show';
interface IExpandTableProps {
  expandData: InteranctiveDataType;
  width: number;
}

const InteranctiveExpand: React.FC<IExpandTableProps> = ({ expandData, width }) => {
  console.log(11, expandData);

  return (
    <Flex>
      {Object.values(expandData).map(
        item =>
          item.key && (
            <div style={{ marginLeft: '12px', width: `${width}%` }} key={item.key}>
              &#123;
              {JsonShow(item.data)}
              &#125;
            </div>
          ),
      )}
    </Flex>
  );
};

export default InteranctiveExpand;
