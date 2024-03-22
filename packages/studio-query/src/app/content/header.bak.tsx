import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InsertRowAboveOutlined, OrderedListOutlined, PlusOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Tooltip, Segmented, Button, Space, Select, Flex } from 'antd';
import { localStorageVars } from '../context';
import { useContext } from '../context';
import CypherEditor from '../../cypher-editor';
import { countLines } from '../utils';
import { v4 as uuidv4 } from 'uuid';
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
  const { globalScript, autoRun, language } = store;

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
        const id = uuidv4();
        draft.statements = [
          {
            id,
            name: id,
            script: value,
            language: language,
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
  const handleChangeLanguage = value => {
    updateStore(draft => {
      draft.language = value;
    });
  };

  const minRows = countLines(globalScript);
  const isShowCypherSwitch = state.lineCount === 1 && minRows === 1;

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
          defaultValue={language}
          options={[
            { value: 'cypher', label: 'Cypher' },
            { value: 'gremlin', label: 'Gremlin' },
          ]}
          onChange={handleChangeLanguage}
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
          language={language}
          onChangeContent={onChangeContent}
          value={globalScript}
          ref={editorRef}
          onChange={handleChange}
          onInit={(initEditor: any) => {
            if (autoRun) {
              handleQuery();
            }
          }}
          maxRows={25}
          minRows={minRows}
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