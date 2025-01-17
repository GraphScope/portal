import { Flex, Typography, Button, Divider, Select, Timeline } from 'antd';
import React, { useState } from 'react';
import { OpenAIOutlined } from '@ant-design/icons';
import { query } from '../Copilot/query';
import { Message } from '../Copilot/utils/message';
import { useContext } from '@graphscope/studio-graph';
import Summary from './Summary';
import { filterDataByParticalSchema, flattenListofDict, getAllAttributesByName, getStrSizeInKB, sampleHalf } from './utils';
import type { ItentionType } from './index';
import { debug } from 'console';
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

export const TEMPLATE_MIND_MAP_GENERATOR_EN = (graph_data, input_ids, user_query) => `
You are a highly skilled AI assistant in summarizing data and generating mind maps. Your task involves analyzing the user's actual intention given a user input and a list of graph data ids, and then select the appropriate dimensions to classify, summarize, and organize these graph data ids based on the specific intent and data.
These ids correspond to graph data stored in the input graph data collection. Finally, you should output the classification results. Each category should have a 'name' and a corresponding 'description'.

User Input: ${user_query}
Graph Data Collection: ${graph_data}

Given the graph data collection, each dictionary in the "filtered_nodes" list corresponds to a piece of data. The 'id' attribute in each dictionary represents its data id. For each graph data id in ${input_ids}, if a dictionary exists in the graph data collection whose 'id' matches the graph data id, then that dictionary describes the attributes of that id.

The output classification result should be structured as follows:

{
  "categories": [
    {
      "category_id": int,
      "name": string,
      "description": string
    },
    ...
  ],
  "data": [
    {
      "data_id": int,
      "category": int (a category_id introduced in "categories"),
    },
    ...
  ],
  "summary": string,
  "explain": string
}
In this structure, "categories" stores the information of the divided categories (generally consistent with the input categories), while "data" stores the classification information of each id in ${input_ids} corresponding to the graph data.

Guidance:
- When selecting classification dimensions, choose those with high distinctiveness and importance according to the user intent wherever possible.
- The number of categories is not necessarily the more the better; usually, classifying into 2-5 categories is more appropriate.
- Ensure each piece of data belongs to only one category, and do not select multiple categories for the same piece of data. If accurate classification is not possible, classify them as 'others'.

For example, suppose the input graph data contains 100 pieces of data with ids 1, 2, ..., 100, and the graph data ids to be classified are [1, 2, ..., 100], the "data" part of the output structure should be [{"data_id": 1, "category": xx}, {"data_id": 2, "category": xx}, ..., {"data_id": 100, "category": xx}]. "[{"data_id": 1, "category": xx}, {"data_id": 1, "category": xx}, ..., {"data_id": 100, "category": xx}]" is an incorrect "data" part output because the data with "data_id" 1 is classified twice. "[{"data_id": 1, "category": xx}, {"data_id": 2, "category": xx}, ..., {"data_id": 105, "category": xx}]" is also an incorrect "data" part output because there is no data with id 105 in the graph data to be classified.

Note:
- The reponse MUST be a JSON and there MUSTN't be \`\`\`json in the response !
- Put the category information in the 'category' field, and place any other information in other fields.
- The 'summary' field is also required. You need to provide the most appropriate response based on the user's input and intent, then place it in the 'summary' field.
- If you have any additional notes, you may include them in the 'explain' field.
  `;


export const TEMPLATE_MIND_MAP_GENERATOR_INCREMENTAL_EN = (graph_data, input_ids, category, user_query) => `
You are a highly skilled AI assistant in summarizing data and generating mind maps. Your task involves analyzing the user's actual intention given a user input, a list of graph data ids, and some existing categories. Based on the specific intention, you need to classify, summarize, and organize the data according to the provided categories. The graph data corresponding to the provided ids is stored within the graph data collection input. Finally, you should output the classification results. Each category should have a 'name' and a 'description'.

User Input: ${user_query}
Graph Data Collection: ${graph_data}
Categories: ${category}

Given the graph data collection, each dictionary in the "filtered_nodes" list corresponds to a piece of data. The 'id' attribute in each dictionary represents its data id. For each graph data id in ${input_ids}, if a dictionary exists in the graph data collection whose 'id' matches the graph data id, then that dictionary describes the attributes of that id.

The output classification result should be structured as follows:

{
  "categories": [
    {
      "category_id": int,
      "name": string,
      "description": string
    },
    ...
  ],
  "data": [
    {
      "data_id": int,
      "category": int (a category_id introduced in "categories"),
    },
    ...
  ],
  "summary": string,
  "explain": string
}
In this structure, "categories" stores the information of the divided categories (generally consistent with the input categories), while "data" stores the classification information of each id in ${input_ids} corresponding to the graph data.

Guidance:
- If a piece of graph data cannot be classified into any given categories, a new category can be created with its description and an id described in 'categories', and the data can be placed in this category.
- The number of categories is not necessarily the more the better; usually, classifying into 2-5 categories is more appropriate.
- Ensure each piece of data belongs to only one category, and do not select multiple categories for the same piece of data.

For example, suppose the input graph data contains 100 pieces of data with ids 1, 2, ..., 100, and the graph data ids to be classified are [1, 2, ..., 100], the "data" part of the output structure should be [{"data_id": 1, "category": xx}, {"data_id": 2, "category": xx}, ..., {"data_id": 100, "category": xx}]. "[{"data_id": 1, "category": xx}, {"data_id": 1, "category": xx}, ..., {"data_id": 100, "category": xx}]" is an incorrect "data" part output because the data with "data_id" 1 is classified twice. "[{"data_id": 1, "category": xx}, {"data_id": 2, "category": xx}, ..., {"data_id": 105, "category": xx}]" is also an incorrect "data" part output because there is no data with id 105 in the graph data to be classified.

Note:
- The reponse MUST be a JSON and there MUSTN't be \`\`\`json in the response !
- Put the category information in the 'category' field, and place any other information in other fields.
- The 'summary' field is also required. You need to provide the most appropriate response based on the user's input and intent, then place it in the 'summary' field.
- If you have any additional notes, you may include them in the 'explain' field.
  `;

export const TEMPLATE_MIND_MAP_GENERATOR_CHN = (graph_data, input_ids, user_query) => `
你是一个专业的AI助手，擅长对数据做归纳总结生成思维导图。具体来说，你的任务是给定一个用户输入和一些图数据id后，分析用户实际的意图并根据具体意图和数据选出相应维度对这些图数据id进行分类、归纳、整理。这些id对应的图数据保存在输入的图数据集合中。最后输出分类的结果。每个类别应具有名称('name')和相应的描述('description')。

用户输入：${user_query}
图数据集合：${graph_data}

给定输入的图数据集合，集合中"filtered_nodes"列表中的每个字典对应一条数据。每个字典中的'id'属性代表的是该数据的id。
要分类的图数据的id为${input_ids}。对于该列表中的每个图数据id，图数据集合中存在一个字典，其id等于该图数据id，则该字典描述的就是该id的属性。

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
该结构中，"categories"中存储的是划分出来的类别的信息，"data"中则存储了${input_ids}中各id对应的图数据的分类情况。

指导建议：
- 在选择分类维度时，应根据用户意图尽可能选择那些区分度高且重要的维度。
- 分类的数量不一定是越多越好；通常，分为2-5个类别是较为合适的。
- 确保每条数据属于且只属于一个类别，并且不要为同一条数据选择多个类别。如果无法准确归类，请将其分类为'others'。
例如，假设输入的图数据中包含id分别为1，2，..., 100的100条数据，且要分类的图数据的id为[1,2,...,100]，则输出的结构中，"data"部分应为
{[{"data_id": 1, "category": xx}, {"data_id": 2, "category": xx}, ..., {"data_id": 100, "category": xx}]}。
{[{"data_id": 1, "category": xx}, {"data_id": 1, "category": xx}, ..., {"data_id": 100, "category": xx}]}是错误的"data"部分输出，因为"data_id"为1的数据被分类了两次。
{[{"data_id": 1, "category": xx}, {"data_id": 2, "category": xx}, ..., {"data_id": 105, "category": xx}]}也是错误的"data"部分输出，因为要分类的图数据中没有id为105的数据。


注意：
- 返回结果只有 JSON！返回结果只有 JSON！返回结果只有 JSON！且不要带 \`\`\`json ！且不要带 \`\`\`json ！且不要带 \`\`\`json ！
- 分类信息放在 'categories' 字段中，其他信息放在其他字段中
- 'summary'字段也是必须的，你需要结合用户的输入意图，给出一个最合适的回答，放在 'summary' 字段中
- 如果你还有其他备注，可以放在  'explain' 字段中
- 在输出中，保留图数据的原始语言（中文或英文），其余内容请转为中文进行输出
  `;

export const TEMPLATE_MIND_MAP_GENERATOR_INCREMENTAL_CHN = (graph_data, input_ids, category, user_query) => `
你是一个专业的AI助手，擅长对数据做归纳总结生成思维导图。具体来说，你的任务是给定一个用户输入、一些图数据id后、以及一些现有的类别后，分析用户实际的意图并根据具体意图并将数据按照给定的类别进行分类、归纳、整理。这些id对应的图数据保存在输入的图数据集合中。最后输出分类的结果。每个类别应具有名称('name')和相应的描述('description')。


用户输入：${user_query}
图数据集合：${graph_data}
分类：${category}

给定输入的图数据集合，集合中"filtered_nodes"列表中的每个字典对应一条数据。每个字典中的'id'属性代表的是该数据的id。
要分类的图数据的id为${input_ids}。对于该列表中的每个图数据id，图数据集合中存在一个字典，其id等于该图数据id，则该字典描述的就是该id的属性。

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
该结构中，"categories"中存储的是划分出来的类别的信息（一般来说与输入的分类一致），"data"中则存储了${input_ids}中各id对应的图数据的分类情况。

指导建议：
- 如果一条图数据无法分入任何给定的分类中，可以构造一个新的分类，在categories中描述该信的分类并给其一个id，并将这条数据归入这个类别
- 分类的数量不一定是越多越好；通常，分为2-5个类别是较为合适的。
- 确保每条数据属于且只属于一个类别，并且不要为同一条数据选择多个类别。
例如，假设输入的图数据中包含id分别为1，2，..., 100的100条数据，且要分类的图数据的id为[1,2,...,100]，则输出的结构中，"data"部分应为
{[{"data_id": 1, "category": xx}, {"data_id": 2, "category": xx}, ..., {"data_id": 100, "category": xx}]}。
{[{"data_id": 1, "category": xx}, {"data_id": 1, "category": xx}, ..., {"data_id": 100, "category": xx}]}是错误的"data"部分输出，因为"data_id"为1的数据被分类了两次。
{[{"data_id": 1, "category": xx}, {"data_id": 2, "category": xx}, ..., {"data_id": 105, "category": xx}]}也是错误的"data"部分输出，因为要分类的图数据中没有id为105的数据。

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

    // const { flatten_keys, flatten_values } = flattenListofDict(nodes)

    let all_ids = getAllAttributesByName(nodes, "id");
    let iterate_time = 0;
    let category_dict = {};
    let outputs = {};
    let res = {"data": [{"data_id": ""}], "categories": []};
    let prompt_size_bound = 12.8;
    
    while (all_ids.length > 0) {
      let filtered_ids = all_ids.slice();
      let current_prompt = "";

      if (iterate_time === 0) {
        while (true) {
          const filtered_nodes = nodes.filter(node => filtered_ids.includes(node.id));
          current_prompt = TEMPLATE_MIND_MAP_GENERATOR_CHN(JSON.stringify({ filtered_nodes, edges }), JSON.stringify(filtered_ids), task);
          if (getStrSizeInKB(current_prompt) < prompt_size_bound || filtered_ids.length === 1) {
            break;
          }

          filtered_ids = sampleHalf(filtered_ids);
        }

        const _res = await query([
          new Message({
            role: 'user',
            content: current_prompt,
          }),
        ]);
        res = JSON.parse(_res.message.content);
      } else {
        while (true) {
          const filtered_nodes = nodes.filter(node => filtered_ids.includes(node.id));
          current_prompt = TEMPLATE_MIND_MAP_GENERATOR_INCREMENTAL_CHN(JSON.stringify({ filtered_nodes, edges }), JSON.stringify(filtered_ids), JSON.stringify(category_dict), task);
          if (getStrSizeInKB(current_prompt) < prompt_size_bound || filtered_ids.length === 1) {
            break;
          }

          filtered_ids = sampleHalf(filtered_ids);
        }

        const _res = await query([
          new Message({
            role: 'user',
            content: current_prompt,
          }),
        ]);
        res = JSON.parse(_res.message.content);
      }
      
      const data_ids = res.data.map(item => item.data_id.toString());
      category_dict = res.categories;
      all_ids = all_ids.filter(element => !data_ids.includes(element));
      iterate_time = iterate_time + 1

      for (const item of res.data) {
        outputs[item.data_id] = item.category;
      }
    }

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
