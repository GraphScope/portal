import * as React from 'react';
import ReactJson from 'react-json-view';
interface IImportDataProps {
  reactJson: object;
}

const ReactJsonView: React.FunctionComponent<IImportDataProps> = props => {
  const { reactJson } = props;
  return <div style={{overflowY: 'scroll',height:'60vh'}}><ReactJson src={reactJson}/></div>;
};

export default ReactJsonView;
