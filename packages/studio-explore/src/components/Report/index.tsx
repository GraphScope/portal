import { Flex, Input, Typography, Button, Divider, Select } from 'antd';
import React, { useRef, useState } from 'react';
import { OpenAIOutlined } from '@ant-design/icons';
import { query } from '../Copilot/query';
import { Message } from '../Copilot/utils/message';
import { GraphSchema, useContext } from '@graphscope/studio-graph';
import Intention from './Intention';
import Setting from '../Copilot/setting';
import { getPrompt } from './utils';
interface IReportProps {}

const GET_DATA_FILTER_RULES_EN = (user_query: string, schema: any) => {
  return `
You are a highly skilled AI graph database expert. Given the user input and the schema of a graph database, your role is to identify the users' intents and which information in the database is necessary to meet the user's requirements.
In detail, it is important to analyze the intent of the user's input, clarify the purpose of the data query, and then determine the properties that may be needed. When choosing properties, remember that you will need to use the relevant data to create a report.

graph_schema :${schema}
user_input:${user_query}

Guidance:
- The reponse MUST be a JSON and there MUSTN't be \`\`\`json in the response !
- The 'description' field in the JSON is mandatory. It is used to describe your understanding of the user's analysis intent.
- The 'plan' field in the JSON is mandatory. It should describe the steps you plan to take, and it must be an array.
- The "schema" field in the JSON is mandatory. It is used to return only the necessary parts of the Schema for the analysis. Do not return the entire Schema structure, especially not all property fields. Include only the fields essential for the analysis.
- If you have any additional notes, you may include them in the 'explain' field.
`;
};

const GET_DATA_FILTER_RULES_CHN = (user_query: string, schema: any) => {
  return `
你是一位非常专业的AI图数据库专家，擅长分析用户的分析意图以及整理数据。你的任务是根据用户的输入语句，再结合图的 Schema 信息，推断出用户的分析意图。
具体来说，重要的是分析用户查询的意图，明确数据查询的目的，然后确定Schema中的可能需要的属性。在从Schema中选择属性时，请记住需要使用相关内容来创建报告，因此选择的属性中应当包含一些描述性的适合在报告中出现的属性。

图数据库模式：${schema}
用户输入：${user_query}

指导原则：

- 返回结果必须是一个JSON格式，并且响应中不能包含\`\`\`json！
- JSON中的'description'字段是必需的。用于描述你对用户分析意图的理解。
- JSON中的'plan'字段是必需的。应该描述你计划采取的步骤，并且必须是一个数组。
- JSON中的"schema"字段是必需的。用于仅返回分析所需的Schema部分。请不要返回整个Schema结构，尤其不能包含所有属性字段。只需包含分析所必需的字段。
- 如果你有任何其他备注，可以将它们包含在'explain'字段中。
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
    task: '请根据我选中的 papers ，整理出一份趋势报告，重点考虑时间因素',
    // '帮我把画布上的papers按照时间和引用数整理成一个分析报告',
    // '请根据我选中的 papers ，以及 paper 关联的 challenge，写一个 related work section。要求 papers 按照 challenge 进行整理',
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
          content: getPrompt({ 'zh-CN': GET_DATA_FILTER_RULES_CHN, 'en-US': GET_DATA_FILTER_RULES_EN })(
            value,
            JSON.stringify(schema),
          ),
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
      <Flex justify="space-between" align="center">
        <Typography.Text type="secondary" italic>
          Think like a bot
        </Typography.Text>
        <Setting />
      </Flex>
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
