import * as React from 'react';
import styles from './styles';
interface IContentProps {
  children: React.ReactNode;
}

const Content: React.FunctionComponent<IContentProps> = props => {
  const { children } = props;
  return <div style={styles.content}>{children}</div>;
};

export default Content;
