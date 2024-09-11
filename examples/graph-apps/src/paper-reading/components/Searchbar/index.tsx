import * as React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
interface ISearchbarProps {}

const Searchbar: React.FunctionComponent<ISearchbarProps> = props => {
  const onchange = () => {};
  return (
    <div style={{ display: 'flex', flex: 1, width: '100%' }}>
      <Input
        variant="borderless"
        placeholder="Search for a paper..."
        style={{ width: '100%' }}
        onChange={onchange}
        suffix={
          <SearchOutlined
            style={
              {
                // color: 'rgba(0,0,0,.45)'
              }
            }
          />
        }
      />
    </div>
  );
};

export default Searchbar;
