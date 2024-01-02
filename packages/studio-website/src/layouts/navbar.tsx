import * as React from 'react';
import styles from './styles';

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = props => {
  return <div style={styles.navbar}>Header</div>;
};

export default Navbar;
