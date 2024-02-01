import React, { useRef, useState } from 'react';
import { InsertRowAboveOutlined, OrderedListOutlined, PlusOutlined } from '@ant-design/icons';
import { Tooltip, Segmented, Button, Space, Select, Flex } from 'antd';
import { localStorageVars } from '../context';
import { useContext } from '../context';
import CypherEditor from '../../cypher-editor';

interface IHeaderProps {}

const options = [
  {
    icon: <InsertRowAboveOutlined />,
    value: 'tabs',
  },
  { icon: <OrderedListOutlined />, value: 'flow' },
];

const ModeSwitch = () => {
  const { updateStore, store } = useContext();
  const { mode } = store;
  const onChangeMode = value => {
    updateStore(draft => {
      draft.mode = value;
      localStorage.setItem(localStorageVars.mode, value);
    });
  };
  return (
    <Segmented
      value={mode}
      options={[
        {
          icon: <InsertRowAboveOutlined />,
          value: 'tabs',
        },
        { icon: <OrderedListOutlined />, value: 'flow' },
      ]}
      onChange={onChangeMode}
    />
  );
};

const Header: React.FunctionComponent<IHeaderProps> = props => {
  const { updateStore, store } = useContext();
  const editorRef = useRef<any>(null);
  const [state, updateState] = useState({
    lineCount: 1,
  });

  const handleAddQuery = () => {
    updateStore(draft => {
      const num = Math.round(Math.random() * 10000);
      const id = `query-${num}`;
      draft.statements = [
        {
          id,
          name: id,
          script: 'Match (n) return n limit 10',
        },
        ...draft.statements,
      ];

      draft.activeId = id;
    });
  };
  const script = 'fsafa fsdadfas fdsafdsafadsfasfas';
  const handleChange = () => {};
  const onChangeContent = (line, editor) => {
    updateState(preState => {
      return {
        ...preState,
        lineCount: line,
      };
    });
  };
  const isShowCypherSwitch = state.lineCount === 1;
  return (
    <div
      style={{
        display: 'flex',
        overflow: 'hidden',
        width: '100%',
        justifyItems: 'start',
        alignItems: 'start',
        padding: '9px 0px',
        gap: '6px',
        position: 'relative',
        // minHeight: '50px',
      }}
    >
      {isShowCypherSwitch && (
        <Select
          defaultValue="Cypher"
          options={[
            { value: 'Cypher', label: 'Cypher' },
            { value: 'Gremlin', label: 'Gremlin', disabled: true },
            { value: 'ISO-GQL', label: 'ISO-GQL', disabled: true },
          ]}
        />
      )}
      {isShowCypherSwitch && (
        <span
          style={{
            position: 'absolute',
            top: '11px',
            left: '99px',
            height: '28px',
            width: '28px',
            lineHeight: '28px',
            background: '#fff',
            zIndex: 9999,
            textAlign: 'center',
          }}
        >
          $
        </span>
      )}
      <div
        style={{
          border: '1px solid #ddd',
          // height: '100%',
          borderRadius: '6px',
          flex: 1,
          width: '400px',
          display: 'block',
          overflow: 'hidden',
        }}
      >
        <CypherEditor
          onChangeContent={onChangeContent}
          value={script}
          ref={editorRef}
          onChange={handleChange}
          onInit={(initEditor: any) => {}}
          maxRows={25}
        />
      </div>

      {/* <Button type="dashed" style={{ width: '100%' }} icon={<PlusOutlined />} onClick={handleAddQuery}>
        Add Query Statement
      </Button> */}
      {/* <CypherEdit ref={editorRef} value={script} onChange={handleChange} onInit={(initEditor: any) => {}} /> */}

      <ModeSwitch />
    </div>
  );
};

export default Header;
