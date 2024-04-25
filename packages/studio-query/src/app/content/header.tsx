import React, { useRef, useState } from 'react';
import { InsertRowAboveOutlined, OrderedListOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Tooltip, Segmented, Button, Space, Flex, Typography } from 'antd';
import { localStorageVars } from '../context';
import { useContext } from '../context';
import CypherEditor from '../../cypher-editor';
import { countLines } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { isDarkTheme } from '../utils';
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
const LanguageSwitch = () => {
  const { updateStore, store } = useContext();
  const { language } = store;
  const onChange = value => {
    updateStore(draft => {
      draft.language = value;
    });
  };
  return (
    <Segmented
      value={language}
      options={[
        {
          label: 'Gremlin',
          value: 'gremlin',
          disabled: language === 'cypher',
        },
        { label: 'Cypher', value: 'cypher', disabled: language === 'gremlin' },
      ]}
      onChange={onChange}
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

  const { globalScript, autoRun, language, graphName } = store;

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
  const isDark = isDarkTheme();

  return (
    <div
      style={{
        width: '100%',
        padding: '8px 0px',
      }}
    >
      <Flex justify="space-between" align="center">
        <LanguageSwitch />

        <Typography.Text>
          <span
            style={{
              background: 'green',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: '3px',
            }}
          />
          {graphName}
        </Typography.Text>
        <Space>
          <ModeSwitch />
        </Space>
      </Flex>
      <Flex justify="space-between" style={{ marginTop: '8px' }}>
        <div
          style={{
            flex: 1,
            display: 'block',
            overflow: 'hidden',
            border: isDark ? '1px solid #434343' : '1px solid rgb(187, 190, 195)',
            borderRadius: '6px',
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
        <div style={{ flexBasis: '48px', flexShrink: 0 }}>
          <Button
            style={{ marginLeft: '10px' }}
            type="text"
            icon={<PlayCircleOutlined style={{ fontSize: '24px' }} />}
            onClick={handleQuery}
            size="large"
          />
        </div>
      </Flex>
    </div>
  );
};

export default Header;
