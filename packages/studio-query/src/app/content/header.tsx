import React, { useRef, useState } from 'react';
import { InsertRowAboveOutlined, OrderedListOutlined, PlusOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Tooltip, Segmented, Button, Space, Select, Flex } from 'antd';
import { localStorageVars } from '../context';
import { useContext } from '../context';
import CypherEditor from '../../cypher-editor';
import { debounce } from '../utils';

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
    clear: false,
  });
  const { globalScript } = store;

  const handleChange = value => {};
  const onChangeContent = line => {
    updateState(preState => {
      return {
        ...preState,
        lineCount: line,
        clear: false,
      };
    });
  };
  const handleQuery = () => {
    if (editorRef.current) {
      const value = editorRef.current.codeEditor.getValue();
      if (value === '') {
        return;
      }
      updateStore(draft => {
        draft.globalScript = '';
        const num = Math.round(Math.random() * 10000);
        const id = `query-${num}`;
        draft.statements = [
          {
            id,
            name: id,
            script: value,
          },
          ...draft.statements,
        ];
        draft.activeId = id;
      });

      updateState(preState => {
        return {
          ...preState,
          clear: true,
        };
      });
    }
  };
  const isShowCypherSwitch = state.lineCount === 1 && countLines(globalScript) === 1;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '3px',
        justifyItems: 'start',
        alignItems: 'start',
        margin: '5px 0px',
      }}
    >
      {isShowCypherSwitch && (
        <Select
          style={{ marginRight: '-32px', zIndex: 999 }}
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
            // background: '#',
            zIndex: 9999,
            textAlign: 'center',
          }}
        ></span>
      )}
      <div
        style={{
          // height: '100%',
          flex: 1,
          width: '400px',
          display: 'block',
          overflow: 'hidden',
        }}
      >
        <CypherEditor
          onChangeContent={onChangeContent}
          value={globalScript}
          ref={editorRef}
          onChange={handleChange}
          onInit={(initEditor: any) => {}}
          maxRows={25}
          clear={state.clear}
        />
      </div>
      <Space>
        <Button type="text" icon={<PlayCircleOutlined />} onClick={handleQuery} />
        <ModeSwitch />
      </Space>
    </div>
  );
};

export default Header;

function countLines(str) {
  // 使用正则表达式匹配换行符，并计算匹配到的数量，即为行数
  return (str.match(/\r?\n/g) || []).length + 1;
}
