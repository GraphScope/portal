import * as React from 'react';
import ReactJson from 'react-json-view';
interface IImportDataProps {
  reactJson: object;
}

const ReactJsonView: React.FunctionComponent<IImportDataProps> = props => {
  const { reactJson } = props;
  return <ReactJson src={reactJson} />;
};

export default ReactJsonView;
