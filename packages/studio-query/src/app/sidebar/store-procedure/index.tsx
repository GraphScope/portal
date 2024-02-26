import * as React from 'react';
import { useContext } from '../../context';
import List from '../saved-statements/list';
import { Flex, Typography } from 'antd';

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
    const { id } = value;
    updateStore(draft => {
      const queryIds = draft.statements.map(item => item.id);
      const HAS_QUERY = queryIds.indexOf(id) !== -1;
      draft.activeId = id;
      if (!HAS_QUERY) {
        draft.statements = [value, ...draft.statements];
      }
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
    <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
      <Typography.Title level={4} style={{ margin: '0px', flexBasis: '30px', padding: '12px' }}>
        Store Procedure
      </Typography.Title>
      <List items={items} onClick={handleClick} onDelete={handleDelete} />
    </Flex>
  );
};

export default StoreProcedure;
