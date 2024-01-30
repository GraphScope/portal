import React, { useState } from 'react';
import { Flex, Select, Input } from 'antd';
import UploadFiles from './upload-file';
interface IModifySourceProps {
  updateState: any;
  datatype?: string;
  filelocation?: string;
  currentType?: string;
}
const { Option } = Select;
const ModifySource: React.FunctionComponent<IModifySourceProps> = props => {
  const { datatype, filelocation, updateState, currentType } = props;
  const selsctSource = (val: string) => {
    updateState((preState: any) => {
      return {
        ...preState,
        currentType: val,
      };
    });
  };
  return (
    <div>
      <Flex justify="flex-start">
        <Select defaultValue={datatype} onChange={selsctSource}>
          <Option value="Files">Files</Option>
          <Option value="ODPS">ODPS</Option>
        </Select>
        <>
          {currentType == 'ODPS' ? (
            <Input
              defaultValue={filelocation}
              placeholder="graphscope/modern_graph/user.csv"
              onChange={e => {
                updateState((preState: any) => {
                  return {
                    ...preState,
                    inputValue: e.target.value,
                  };
                });
              }}
              onFocus={() => {
                updateState((preState: any) => {
                  return {
                    ...preState,
                    isEidtProperty: true,
                  };
                });
              }}
            />
          ) : (
            <UploadFiles
              onChange={val => {
                updateState((preState: any) => {
                  return {
                    ...preState,
                    isEidtProperty: val,
                  };
                });
              }}
            />
          )}
        </>
      </Flex>
    </div>
  );
};

export default ModifySource;
