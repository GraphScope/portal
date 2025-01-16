import { Flex, Typography, Button, Divider, Select, Timeline } from 'antd';
import React, { useState } from 'react';
import { OpenAIOutlined } from '@ant-design/icons';
import { query } from '../Copilot/query';
import { Message } from '../Copilot/utils/message';
import { useContext } from '@graphscope/studio-graph';
import Summary from './Summary';
import { filterDataByParticalSchema, flattenListofDict } from './utils';
import type { ItentionType } from './index';
interface IReportProps {
  task: string;
  intention: ItentionType;
}
export interface SummaryType {
  category: {
    name: string;
    description: string;
    children: {
      name: string;
      description: string;
    }[];
  }[];
  summary: string;
  explain: string;
}

export const TEMPLATE_MIND_MAP_GENERATOR_EN = (graph_data, user_query) => `
You are a highly skilled AI assistant. Given a user input and a set of data with properties, your role is to categorize the given data based on the user's intents and the provided data by selecting specific dimensions. Each category should have a name and a corresponding description. For each category, maintain a collection of the given data that belongs to that category in the 'children' field.

User Input: ${user_query}
Graph Data: ${graph_data}

Guidance:
- When selecting dimensions for categorization, you should choose those that are as distinct and important as possible.
- Avoid assigning the same data to multiple categories. Think carefully about how to classify each piece of data.
- The number of categories is not necessarily the more the better; generally, dividing into 2-5 categories is preferable.
- Ensure that in the 'children' field for each category, only the ids of the graph data are reserved.
- Add all the provided graph data as possible to the relevant category.
- Ensure each piece of graph data is assigned to a category in the output. You'll lose $1 million for each one you miss.

Attention:
- The reponse MUST be a JSON and there MUSTN't be \`\`\`json in the response !
- Put the category information in the 'category' field, and place any other information in other fields.
- The 'summary' field is also required. You need to provide the most appropriate response based on the user's input and intent, then place it in the 'summary' field.
- If you have any additional notes, you may include them in the 'explain' field.
  `;

export const TEMPLATE_MIND_MAP_GENERATOR_CHN = (graph_data, schema, user_query) => `
你是一个专业的AI助手，擅长对数据做归纳总结生成思维导图。具体来说，你的任务是给定一个用户输入和一些列的带属性的数据后，分析用户实际的意图并根据具体意图和数据选出相应维度对数据进行分类、归纳、整理。最后输出分类的结果。每个类别应具有名称('name')和相应的描述('description')。

用户输入：${user_query}
图数据集合：${graph_data}

给定输入的图数据集合，集合中的每个列表对应一条数据，列表中依次是节点的 ${schema}。
输出的分类的结果应当具有如下的结构：
{
  "categories": [
    {
      "category_id": int,
      "name": string,
      "description": string
    },
    ...
  ],
  "data": {
    [
      {
        "data_id": int,
        "category": int (a category_id introduced in "categories"),
      },
      ...
    ]
  },
  "summary": string,
  "explain": string
}
该结构中，"categories"中存储的是划分出来的类别的信息，"data"中则存储了各条图数据的分类情况。

指导建议：
- 在选择分类维度时，应根据用户意图尽可能选择那些区分度高且重要的维度。
- 分类的数量不一定是越多越好；通常，分为2-5个类别是较为合适的。
- 确保每条数据只属于一个类别，并且不要为同一条数据选择多个类别。如果无法准确归类，请将其分类为'others'。
- 将一条数据归入一个类别，意味着在输出中"data_id"为该数据id的字典中，"category"为对应类别的"category_id"

注意：
- 返回结果只有 JSON！返回结果只有 JSON！返回结果只有 JSON！且不要带 \`\`\`json ！且不要带 \`\`\`json ！且不要带 \`\`\`json ！
- 分类信息放在 'categories' 字段中，其他信息放在其他字段中
- 'summary'字段也是必须的，你需要结合用户的输入意图，给出一个最合适的回答，放在 'summary' 字段中
- 如果你还有其他备注，可以放在  'explain' 字段中
- 在输出中，保留图数据的原始语言（中文或英文），其余内容请转为中文进行输出
  `;

export const TEMPLATE_MIND_MAP_GENERATOR = (graph_data, user_query) => `
你是一位很有天赋的 AI 助理。你的任务是根据用户的目标和提供的数据，通过选择特定的维度来对给定的数据进行分类。每个类别应具有名称('name')和相应的描述('description')。
对于每个类别，需要在 'children' 字段中维护属于该分类的给定数据的集合

指导建议：

- 在选择分类维度时，应尽可能选择那些区分度高且重要的维度。
- 在进行分类时，尽量避免让单个节点属于多个类别。
- 分类的数量不一定是越多越好；通常，分为2-4个类别是较为合适的。
- 每个类别的 'children' 中的数据结构应该要和提供的数据结构保持一致！
 
  User Query: ${user_query}
  Graph Data: ${graph_data}
  
注意：
- 返回结果只有 JSON！返回结果只有 JSON！返回结果只有 JSON！且不要带 \`\`\`json ！且不要带 \`\`\`json ！且不要带 \`\`\`json ！
- 分类信息放在 'category' 字段中，其他信息放在其他字段中
- 'summary'字段也是必须的，你需要结合用户的输入意图，给出一个最合适的回答，放在 'summary' 字段中
- 如果你还有其他备注，可以放在  'explain' 字段中

  `;

const Intention: React.FunctionComponent<IReportProps> = props => {
  const { intention, task } = props;
  const { store } = useContext();
  const { schema, data } = store;

  const [state, setState] = useState<{
    summary: SummaryType | null;
    loading: boolean;
  }>({
    summary: null,
    loading: false,
  });
  const { summary, loading } = state;

  const handleConfirm = async () => {
    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });

    const { nodes, edges } = filterDataByParticalSchema(intention.schema, data);

    const { flatten_keys, flatten_values } = flattenListofDict(nodes)
    
    const _res = await query([
      new Message({
        role: 'user',
        content: TEMPLATE_MIND_MAP_GENERATOR_CHN(JSON.stringify({ flatten_values }), JSON.stringify(flatten_keys), task),
      }),
    ]);
    const res = JSON.parse(_res.message.content);
    debugger;
    res.category.forEach(element => {
      element.children = nodes.filter(n => element.children.includes(n.id));
    });
    debugger;
    setState(preState => {
      return {
        ...preState,
        loading: false,
        summary: res,
      };
    });
    console.log(_res);
  };

  return (
    <Flex vertical gap={12}>
      <Timeline
        items={[
          {
            children: (
              <Flex vertical gap={12}>
                <Typography.Text strong>User intention</Typography.Text>
                <Typography.Text italic type="secondary">
                  {intention.description}
                </Typography.Text>
              </Flex>
            ),
          },
          {
            children: (
              <Flex vertical gap={12}>
                <Typography.Text strong>Execute Plan</Typography.Text>
                <Typography.Text italic type="secondary">
                  {intention.plan.join('; ')}
                </Typography.Text>
              </Flex>
            ),
          },
          {
            children: (
              <Flex vertical gap={12}>
                <Typography.Text strong>Required data</Typography.Text>
                <Typography.Text type="secondary" italic>
                  Please first ensure that the current canvas contains these types of nodes and edges. You can manually
                  adjust the set of node properties passed to the LLM.
                </Typography.Text>

                {intention.schema.nodes.map(item => {
                  const { id, label, properties = [] } = item;
                  const match = schema.nodes.find(node => node.label === label);
                  const options = match?.properties.map(p => {
                    return {
                      label: p.name,
                      value: p.name,
                    };
                  });
                  const defaultValue = properties.map(p => {
                    return p.name;
                  });
                  return (
                    <Flex vertical gap={12} key={item.id}>
                      <Typography.Text italic type="secondary">
                        {label}
                      </Typography.Text>
                      <Select options={options} mode="multiple" defaultValue={defaultValue}></Select>
                    </Flex>
                  );
                })}
              </Flex>
            ),
          },
        ]}
      />
      <Button block icon={<OpenAIOutlined />} onClick={handleConfirm} loading={loading}>
        Generate Mindmap
      </Button>

      {summary && <Summary {...summary} task={task} />}
    </Flex>
  );
};

export default Intention;
