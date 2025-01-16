import { Flex, Typography, Button, Divider, Select, Timeline } from 'antd';
import React, { useState } from 'react';
import { OpenAIOutlined } from '@ant-design/icons';
import { query } from '../Copilot/query';
import { Message } from '../Copilot/utils/message';
import { useContext } from '@graphscope/studio-graph';
import Summary from './Summary';

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
- When categorizing, try not to have a single paper belong to more than one category.
- The number of categories is not necessarily the more the better; generally, dividing into 2-5 categories is preferable.
- Ensure that the data structure in the 'children' field for each category matches the provided data structure in graph data.

Attention:
- The reponse MUST be a JSON and there MUSTN't be \`\`\`json in the response !
- Put the category information in the 'category' field, and place any other information in other fields.
- The 'summary' field is also required. You need to provide the most appropriate response based on the user's input and intent, then place it in the 'summary' field.
- If you have any additional notes, you may include them in the 'explain' field.
  `;

export const TEMPLATE_MIND_MAP_GENERATOR_CHN = (graph_data, user_query) => `
你是一个专业的AI助手，擅长对数据做归纳总结生成思维导图。具体来说，你的任务是给定一个用户输入和一些列的带属性的数据后，分析用户实际的意图并根据具体意图和数据选出相应维度对数据进行分类、归纳、整理。每个类别应具有名称('name')和相应的描述('description')。对于每个类别，在其'children'字段中保存属于该类别的数据。

用户输入：${user_query}
图数据：${graph_data}

指导建议：
- 在选择分类维度时，应尽可能选择那些区分度高且重要的维度。
- 在进行分类时，尽量避免让单个节点属于多个类别。
- 分类的数量不一定是越多越好；通常，分为2-5个类别是较为合适的。
- 每个类别的 'children' 中的数据结构应该要和提供的数据结构保持一致！

注意：
- 返回结果只有 JSON！返回结果只有 JSON！返回结果只有 JSON！且不要带 \`\`\`json ！且不要带 \`\`\`json ！且不要带 \`\`\`json ！
- 分类信息放在 'category' 字段中，其他信息放在其他字段中
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
    const node_labels = intention.schema.nodes.map(item => {
      return item.label;
    });
    const edge_labels = intention.schema.edges.map(item => {
      return item.label;
    });

    const _nodes = data.nodes
      .filter(node => {
        return node_labels.includes(node.label || '');
      })
      .map(item => {
        const { id, label, properties = {} } = item;
        const match = intention.schema.nodes.find(node => node.label === label) || { properties: [] };
        return {
          id,
          label,
          properties: match.properties.reduce((acc, curr) => {
            return {
              ...acc,
              [curr.name]: properties[curr.name],
            };
          }, {}),
        };
      });
    const _edges = data.edges
      .filter(item => {
        return edge_labels.includes(item.label || '');
      })
      .map(item => {
        const { id, label, properties = {} } = item;
        const match = intention.schema.edges.find(c => c.label === label) || { properties: [] };
        return {
          id,
          label,

          properties: {}
          // match.properties.reduce((acc, curr) => {
          //   return {
          //     ...acc,
          //     [curr.name]: properties[curr.name],
          //   };
          // }, {}),
        };
      });
    console.log(_nodes, _edges);

    const _res = await query([
      new Message({
        role: 'user',
        content: TEMPLATE_MIND_MAP_GENERATOR_CHN(JSON.stringify({ nodes: _nodes, edges: _edges }), task),
      }),
    ]);
    const res = JSON.parse(_res.message.content);
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
