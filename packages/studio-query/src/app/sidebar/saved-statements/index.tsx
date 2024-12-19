import * as React from 'react';
import { useContext } from '../../context';
import List from '../statement-list';
import { Flex, Typography, Empty } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import Section from '../section';
import { FormattedMessage } from 'react-intl';
interface ISavedStatementsProps {
  deleteStatements: (ids: string[]) => void;
}

const SavedStatements: React.FunctionComponent<ISavedStatementsProps> = props => {
  const { store, updateStore } = useContext();
  const { savedStatements } = store;
  const { deleteStatements } = props;

  const items = savedStatements.map(item => {
    return item;
  });

  const handleClick = value => {
    const { id, script } = value;
    updateStore(draft => {
      draft.globalScript = script;
      draft.autoRun = true;
      // const queryIds = draft.statements.map(item => item.id);
      // const HAS_QUERY = queryIds.indexOf(id) !== -1;
      // draft.activeId = id;
      // if (!HAS_QUERY) {
      //   draft.statements = [value, ...draft.statements];
      // }
    });
  };

  const handleDelete = async ids => {
    deleteStatements(ids);
    updateStore(draft => {
      draft.savedStatements = draft.savedStatements.filter(item => {
        return ids.indexOf(item.id) === -1;
      });
    });
  };

  return (
    <Section title="Saved">
      <List
        items={items}
        onClick={handleClick}
        onDelete={handleDelete}
        placeholder={
          <>
            <FormattedMessage
              id="No saved query statements {br} You can click {icon} to save."
              values={{
                icon: <BookOutlined />,
                br: <br />,
              }}
            />
          </>
        }
      />
    </Section>
  );
};

export default SavedStatements;
