import * as React from 'react';

interface IFooterProps {}

const Footer: React.FunctionComponent<IFooterProps> = props => {
  return (
    <div style={{ position: 'absolute', bottom: '0px', padding: '12px', fontSize: '12px' }}>
      Powered by GraphScope Team
    </div>
  );
};

export default Footer;
