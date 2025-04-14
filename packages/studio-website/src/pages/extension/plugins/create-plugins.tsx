import React from 'react';
import { Button, Divider, theme } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SplitSection } from '@graphscope/studio-components';
import Section from '../../../components/section';
import LeftSide from '../components/left-side';
import RightSide from '../components/right-side';
import SelectCards from '../../../components/select-cards';
import { useCreatePlugins } from '../hooks/useCreatePlugins';
import { Utils } from '@graphscope/studio-components';

const { getUrlParams } = Utils;
const { useToken } = theme;

// 常量定义
const ENGINES = [
  {
    id: 'Stored procedures',
    value: 'Stored procedures',
    type: 'Stored procedures',
    title: 'Stored procedures',
  },
];

// 样式提取
const styles = {
  selectCards: { position: 'absolute', top: '3px', right: '3px', fontSize: '20px' },
  divider: { margin: '3px 0px' },
  button: { width: '128px' },
  buttonContainer: { display: 'flex', justifyContent: 'end' },
};

const CreatePlugins: React.FC = () => {
  const { token } = useToken();
  const { colorBgContainer } = token;
  const { graph_id } = getUrlParams();

  const {
    form,
    state: { editCode, instanceOption, isEdit, isLoading, storeType },
    handleSubmit,
    onCodeMirrorChange,
    handleCodeMirror,
    chooseStoreType,
  } = useCreatePlugins();

  return (
    <Section
      style={{ backgroundColor: colorBgContainer }}
      breadcrumb={[{ title: 'Extensions' }, { title: 'Create Plugin' }]}
      desc="Expand its functionality or offer solutions that are finely tuned to specific needs."
    >
      {/* 插件类型选择卡片 */}
      <SelectCards style={styles.selectCards} value={storeType} items={ENGINES} onChange={chooseStoreType} />

      {/* 分割线 */}
      <Divider style={styles.divider} />

      {/* 左右分栏 */}
      <SplitSection
        splitText=""
        span={12}
        splitSpan={1}
        leftSide={
          <LeftSide
            editCode={editCode}
            isEdit={isEdit}
            onCodeMirrorChange={onCodeMirrorChange}
            onChange={handleCodeMirror}
          />
        }
        rightSide={<RightSide form={form} isEdit={isEdit} options={instanceOption} />}
      />

      {/* 提交按钮 */}
      <div style={styles.buttonContainer}>
        <Button type="primary" onClick={handleSubmit} loading={isLoading} style={styles.button}>
          {graph_id ? <FormattedMessage id="Edit Plugin" /> : <FormattedMessage id="Create Plugin" />}
        </Button>
      </div>
    </Section>
  );
};

export default CreatePlugins;
