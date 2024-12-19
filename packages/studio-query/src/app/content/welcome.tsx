import * as React from 'react';
import { Typography, theme, Alert } from 'antd';
interface IWelcomeProps {}
const { useToken } = theme;
import { useContext } from '../context';
const Welcome: React.FunctionComponent<IWelcomeProps> = props => {
  const { token } = useToken();
  const { store } = useContext();
  const { welcome } = store;
  if (welcome) {
    const { title, description } = welcome;
    return (
      <div
        style={{
          margin: '12px',
          borderRadius: '8px',
          background: token.colorBgBase,
        }}
      >
        <Alert message={title} description={description} type="info" closable />
      </div>
    );
  }
  return null;
};

export default Welcome;
