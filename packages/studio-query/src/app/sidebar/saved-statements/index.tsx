import * as React from 'react';
import { useContext } from '../../context';
import List from './list';
import { Flex, Typography } from 'antd';
import './index.less';
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
    // <div>
    <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
      <Typography.Title level={4} style={{ margin: '0px', flexBasis: '30px', padding: '12px' }}>
        Saved
      </Typography.Title>
      <List items={items} onClick={handleClick} onDelete={handleDelete} />
    </Flex>

    // </div>
  );
};

export default SavedStatements;
