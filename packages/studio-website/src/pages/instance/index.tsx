import * as React from 'react';
import InstanceLits from './lists';
import { Steps} from 'antd';
import styles from './index.module.less'
interface InstanceProps {}

const Instance: React.FunctionComponent<InstanceProps> = props => {
  return (
    <div style={{backgroundColor:'#fff',padding:'24px',borderRadius:'6px'}}>
      <Steps
        current={0}
        items={[
          {
            title: 'Choose EngineType',
            // description,
          },
          {
            title: 'Create Schema',
            // description,
            // subTitle: 'Left 00:00:08',
          },
          {
            title: 'Result',
            // description,
          },
        ]}
      />
      <InstanceLits />
    </div>
  );
};

export default Instance;
