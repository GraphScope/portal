import React, { useRef, useState, Suspense } from 'react';
import { InsertRowAboveOutlined, OrderedListOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Segmented, Button, Space, Flex } from 'antd';
import { IStudioQueryProps, localStorageVars } from '../context';
import { useContext } from '../context';
import { Utils } from '@graphscope/studio-components';
import { countLines } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import ToggleButton from './toggle-button';
import CypherEditor from '../../components/cypher-editor';
import { DrawPatternModal } from '../../components/draw-pattern-modal';

const { debounce } = Utils;
interface IHeaderProps {
  connectComponent?: IStudioQueryProps['connectComponent'];
  displaySidebarPosition?: IStudioQueryProps['displaySidebarPosition'];
}

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
  const { language, onlyCypher } = store;
  const onChange = value => {
    updateStore(draft => {
      draft.language = value;
    });
  };

  const allOptions = [
    {
      label: 'Gremlin',
      value: 'gremlin',
      disabled: language === 'cypher',
    },
    { label: 'Cypher', value: 'cypher', disabled: language === 'gremlin' },
  ];

  const options = onlyCypher 
    ? allOptions.filter(option => option.value === 'cypher')
    : allOptions;

  return (
    <Segmented
      value={language}
      options={options}
      onChange={onChange}
    />
  );
};

const Header: React.FunctionComponent<IHeaderProps> = props => {
  const { connectComponent, displaySidebarPosition } = props;
  const { updateStore, store } = useContext();
  const editorRef = useRef<any>(null);
  const [state, updateState] = useState({
    // lineCount: 1,
    clear: false,
  });

  const { globalScript, autoRun, language, graphId } = store;

  // const handleChange = value => {};
  const onChangeContent = () => {
    updateState(preState => {
      return {
        ...preState,
        // lineCount: line,
        clear: false,
      };
    });
  };
  const handleQuery = debounce(() => {
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
  }, 500);

  const minRows = countLines(globalScript);

  return (
    <div
      style={{
        width: '100%',
        padding: '8px 0px',
      }}
    >
      <Flex justify="space-between" align="center">
        <Space>
          {displaySidebarPosition === 'left' && <ToggleButton displaySidebarPosition={displaySidebarPosition} />}
          <LanguageSwitch />
        </Space>

        {connectComponent}
        <Space>
          <DrawPatternModal></DrawPatternModal>
          <ModeSwitch />
          {displaySidebarPosition === 'right' && <ToggleButton displaySidebarPosition={displaySidebarPosition} />}
        </Space>
      </Flex>
      <Flex justify="space-between" style={{ marginTop: '8px' }}>
        <CypherEditor
          language={language}
          onChangeContent={onChangeContent}
          value={globalScript}
          ref={editorRef}
          maxRows={25}
          minRows={minRows}
          clear={state.clear}
          onInit={() => {
            if (autoRun) {
              handleQuery();
            }
          }}
        />
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
