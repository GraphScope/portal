import React from 'react';
import { Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import { useThemeContainer } from '@graphscope/studio-components';
interface ICreateGraph {
  onCreate: () => void;
}
const CreateGraph: React.FC<ICreateGraph> = props => {
  const { onCreate } = props;
  const { instanceBackground } = useThemeContainer();
  return (
    <Card
      title={<FormattedMessage id="New graph" />}
      styles={{ header: { fontSize: '30px', color: '#ccc' }, body: { width: '100%' } }}
      style={{ background: instanceBackground }}
    >
      <div
        style={{
          display: 'flex',
          height: '164px',
          justifyContent: 'center',
          alignContent: 'center',
          cursor: 'pointer',
        }}
        onClick={onCreate}
      >
        <PlusOutlined style={{ fontSize: '80px', color: '#ccc' }} />
      </div>
    </Card>
  );
};

export default CreateGraph;
