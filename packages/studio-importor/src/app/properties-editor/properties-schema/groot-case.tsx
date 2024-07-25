import * as React from 'react';
import { Row, Space, Button, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { validateProperties } from './validate-info';
interface IGrootCaseProps {
  appMode: string;
  type: 'nodes' | 'edges';
  properties: any;
  isNewNodeOrEdge: boolean;
  handleSubmit: () => void;
  handleDelete: () => void;
}

const GrootCase: React.FunctionComponent<IGrootCaseProps> = props => {
  //@ts-ignore
  const isGroot = window.GS_ENGINE_TYPE === 'groot';
  const { appMode, type, properties, isNewNodeOrEdge, handleSubmit, handleDelete } = props;
  const tooltip = validateProperties({ appMode, type, properties, filelocation: '' });
  return (
    <Row justify="end">
      {isGroot && (
        <Space>
          {isNewNodeOrEdge && (
            <Tooltip title={tooltip && <FormattedMessage id={`${tooltip}`} />}>
              <Button size="small" type="primary" onClick={handleSubmit} disabled={!!tooltip}>
                Submit
              </Button>
            </Tooltip>
          )}
          {appMode === 'DATA_MODELING' && (
            <Button size="small" type="primary" danger ghost onClick={handleDelete}>
              Delete
            </Button>
          )}
        </Space>
      )}
    </Row>
  );
};

export default GrootCase;
