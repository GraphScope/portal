import { Flex, Input, Typography, Button, Divider, Select } from 'antd';
import React, { useRef, useState } from 'react';
import { OpenAIOutlined } from '@ant-design/icons';
import { query } from '../Copilot/query';
import { Message } from '../Copilot/utils/message';
import { GraphSchema, useContext } from '@graphscope/studio-graph';
import Intention from './Intention';
interface IReportProps {}

const GET_DATA_FILTER_RULES = (user_query: string, schema: any) => {
  return `
你是一个很有天赋的 AI 助理，你的任务是根据用户的输入语句，再结合图的 Schema 信息，推断出用户的分析意图。
考虑到用户后续输入的数据量可能比较大，因此需要你先返回部分 Schema 结构，方便用户对要数据做裁剪。

graph_schema :${schema}
user_query:${user_query}

注意：
- 返回结果只有 JSON！返回结果只有 JSON！返回结果只有 JSON！且不要带 \`\`\`json ！且不要带 \`\`\`json ！且不要带 \`\`\`json ！
- JSON 的 'description' 字段是必须的，用来描述你理解到的用户分析意图
- JSON 的 'plan' 字段是必须的，用于描述你计划如何实现的步骤，它必须是一个数组。
- JSON 的 "schema" 字段是必须的，用来返回分析所需的部分 Schema 结构。不要返回全部 Schema 结构，尤其是属性字段，只考虑分析必备的字段，不要返回全部的属性字段。
- 如果你还有其他备注，可以放在  'explain' 字段中
  `;
};

export interface ItentionType {
  schema: GraphSchema;
  plan: string[];
  description: string;
  explain: string;
}
const Report: React.FunctionComponent<IReportProps> = props => {
  const { store } = useContext();
  const { schema, data } = store;
  const InputRef = useRef<any>(null);
  const [state, setState] = useState<{
    loading: boolean;
    task: string;
    intention: ItentionType | null;
  }>({
    loading: false,
    task:
      // '帮我把画布上的papers按照时间和引用数整理成一个分析报告',
      '请根据我选中的 papers ，以及 paper 关联的 challenge，写一个 related work section。要求 papers 按照 challenge 进行整理',
    // '帮我把这些 Papers 整理写成一个 related work 的 section，关注点在 challenge 上',
    intention: null,
  });

  const { intention, task } = state;

  const handleClick = async () => {
    const { value } = InputRef.current.resizableTextArea.textArea;

    try {
      setState({ ...state, task: value, loading: true });
      const _res = await query([
        new Message({
          role: 'user',
          content: GET_DATA_FILTER_RULES(value, JSON.stringify(schema)),
        }),
      ]);
      debugger;
      const res = JSON.parse(_res.message.content);
      setState(preState => {
        return {
          ...preState,
          loading: false,
          intention: res,
        };
      });
      console.log('res', res);
    } catch (error) {}
  };

  return (
    <Flex vertical gap={12}>
      <Typography.Text italic type="secondary">
        Input your intention
      </Typography.Text>
      <Input.TextArea rows={3} defaultValue={task} ref={InputRef}></Input.TextArea>
      <Button icon={<OpenAIOutlined />} onClick={handleClick} loading={state.loading}>
        Infer Intention
      </Button>
      {intention && <Intention task={task} intention={intention} />}
    </Flex>
  );
};

export default Report;
