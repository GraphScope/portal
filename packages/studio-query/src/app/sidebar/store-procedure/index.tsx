import * as React from 'react';
import { useContext } from '../../context';
import List from '../statement-list';
import { Flex, Typography, Empty } from 'antd';
import Section from '../section';
import { FormattedMessage } from 'react-intl';
interface IStoreProcedureProps {
  deleteStatements: (ids: string[]) => void;
}

const StoreProcedure: React.FunctionComponent<IStoreProcedureProps> = props => {
  const { deleteStatements } = props;
  const { store, updateStore } = useContext();
  const { storeProcedures } = store;
  const items = storeProcedures.map(item => {
    return item;
  });
  const handleClick = value => {
    const { id, script, name } = value;

    updateStore(draft => {
      draft.globalScript = script;
      draft.autoRun = true;
    });
  };

  const handleDelete = async ids => {
    deleteStatements(ids);
    updateStore(draft => {
      draft.storeProcedures = draft.savedStatements.filter(item => {
        return ids.indexOf(item.id) === -1;
      });
    });
  };

  return (
    <Section title="Stored Procedures">
      <List
        items={items}
        onClick={handleClick}
        onDelete={handleDelete}
        placeholder={
          <>
            <FormattedMessage
              id="No stored procedures available. {br} Go to the <a>Extension</a> and create one now!"
              values={{
                a: chunks => (
                  <Typography.Link style={{ fontSize: '12px' }} href="/extension/create" target="_blank">
                    {chunks}
                  </Typography.Link>
                ),
                br: <br />,
              }}
            />
          </>
        }
      />
    </Section>
  );
};

export default StoreProcedure;
