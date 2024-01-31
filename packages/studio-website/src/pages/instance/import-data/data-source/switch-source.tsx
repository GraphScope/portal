import React from 'react';
import { Flex, Select, Input } from 'antd';
import UploadFiles from './upload-file';
interface ISwitchSourceProps {
  updateState: any;
  filelocation?: string;
  currentType?: string;
}
const SOURCEOPTIONS = [
  { label: 'Files', value: 'Files' },
  { label: 'ODPS', value: 'ODPS' },
];
const SwitchSource: React.FunctionComponent<ISwitchSourceProps> = props => {
  const { filelocation, updateState, currentType } = props;
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
        <Select defaultValue={currentType} options={SOURCEOPTIONS} onChange={selsctSource} />
        <>
          {currentType === 'ODPS' && (
            <Input
              defaultValue={filelocation}
              placeholder="graphscope/modern_graph/user.csv"
              onChange={e => {
                updateState((preState: any) => {
                  return {
                    ...preState,
                    location: e.target.value,
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
          )}
          {currentType === 'Files' && (
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

export default SwitchSource;
