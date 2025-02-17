import React, { useState } from 'react';
import { Button, Flex } from 'antd';
import { query } from '../Copilot/query';
import { Message } from '../Copilot/utils/message';
import type { SummaryType } from './Intention';
import { getPrompt } from './utils';
import ReportText from './Text';
import { Utils } from '@graphscope/studio-components';
import MOCK from './Mock';
import Think, { useThink } from './Think';
const SECTION_CONSTANT_EXAMPLE_EN = () => {
  return `
An example of a subsection 2.1 in a report is as follows
(the information in this example MUST NOT be summarized in the report):
2.1 [SUBSECTION TITLE]

The diversity in graph computing also extends to programming interfaces, each tailored to specific domains
within graph operations. For graph querying, Gremlin and Cypher are widely used. Gremlin, part of Apache
TinkerPop, offers an extensive set of operators, providing rich expressiveness for graph traversal.
However, its robustness comes with complexity, as it includes over 200 steps, many with overlapping
functionalities. For instance, steps like valueMap and elementMap both return vertex/edge properties,
but with nuanced differences. This complexity poses challenges in ensuring comprehensive support within
interactive graph engines. Cypher \\cite{[Id]}, initiated by Neo4j, has gained wide adoption and
significantly contributed to the development of GQL, the emerging standard for querying graph databases.
The increasing demand for Cypher integration into various systems, including GraphScope, alongside the
standardization of ISO/GQL \\cite{[Id]}, highlights the evolving nature of graph querying interfaces.
Additionally, many graph databases offer the capability to register custom stored procedures for
enhanced querying functionality. Some literatures summarize this kind of graph databases \\cite{[Id1], [Id2], [Id3]}.
  `;
};

const SECTION_PREVIOUS_EXAMPLE_EN = example => {
  return `
The following is the previously generated subsections on other categories.
Please create a new subsection to continue writing about the current category:
${example}
  `;
};

const GET_REPORT_PROMPTS_BY_SECTION_TEXT_EN = (user_query, category, section_id, example, intro_text) => {
  return `
You are a highly skilled AI assistant. Given a user input and a category of data, your task is to write a corresponding subsection (subsection 2.${section_id}) in a report based on the given data that belongs to the same category and the requirements in the user input. The introduction part of this report is as follows:
${intro_text}

User Input: ${user_query}
Category: ${category}

In the input category, the data belonging to this category are stored in the 'children' field. For each data, there are two fields, i.e., 'name' and 'description.

Guidance:
- In this subsection, you must mention and cite AS MANY data belonging to this category (i.e., those in the 'children' field) AS POSSIBLE. It's best to mention and cite all the data in the 'children' field.
For each mentioned data, you need to explain its relationship with the category corresponding to the current subsection. When introducing each mentioned data, use at most two sentences (within about 50 words).
- If the report is a related work, do not directly write the title/name of the papers in the report.
- Sometimes, you can describe the commonalities of related data in 1-2 sentences and cite these works, which also counts as mentioning them.
- For each mentioned data, it would be better for you to also explain its relationship with other data if possible.
- Every time a data is first mentioned in the text, add a citation in the format \\cite{Id} and you must not use \\cite as the subject of the sentence. For example, suppose the [Id] of data p1 is 0000.0000, then the citation should be added as \\cite{0000.0000}.
If the data presents a certain viewpoint or method M, the sentence may be "M \\cite{0000.0000} ...". If there is author or source information A for the data, the sentence may be "A~\\cite{0000.0000} proposes that ...". If several data with ids [Id_1], ... [Id_k] are related to an item or topic T, then the sentence may be "Topic T is well studied \\cite{Id_1, ..., Id_k} ...".
Anyway, sentence "\\cite{0000.0000} proposes ..." is NOT allowed. 
- Avoid using a whole paragraph to describe one piece of data, nor should you list the data one by one. Instead, appropriately describe the connections between data.
- In this subsection, when introducing data, it's best to present similar and strongly related data close to each other and describe their commonalities and differences.
- DO NOT forget the requirements in the user input.


${example}
`;
};

const GET_REPORT_PROMPTS_BY_SECTION_INTRO_EN = (user_query, max_tokens, categories) => {
  return `
You are a highly skilled AI assistant. Given a user input and the categories, we are going to write a report about the data belonging to categories to satisfy the requirements in the user input. You task is to generate and output the title and introduction of the report based on the categories and the requirements in the user input. The introduction should contain about ${max_tokens} words.

User Input: ${user_query}
Categoreis: ${categories}
`;
};

const GET_REPORT_PROMPTS_EN = (user_query, mind_map) => {
  return `
You are a highly skilled AI assistant. Given a user input and a mind map that categories the data, your role is to write a report based on the mind map.

User Input: ${user_query}
Mind Map: ${mind_map}

Guidance:
- The beginning of a report typically includes an introduction, which provides a brief summary of the contents of this report, usually around 50 words.
- A report typically includes several subsections. In each subsection, you must mention as many data related to this category as possible.
For each mentioned data, you need to explain its relationship with the category corresponding to the current subsection.
- If the report is a related work, do not directly write the title/name of the papers in the report.
- Every time a data is first mentioned in the text, add a citation in the format \\cite{Id} and you must not use \\cite as the subject of the sentence. For example, suppose the [Id] of data p1 is 0000.0000, then the citation should be added as \\cite{0000.0000}.
If the data presents a certain viewpoint or method M, the sentence may be "M \\cite{0000.0000} ...". If there is author or source information A for the data, the sentence may be "A~\\cite{0000.0000} proposes that ...". If several data with ids [Id_1], ... [Id_k] are related to an item or topic T, then the sentence may be "Topic T is well studied \\cite{Id_1, ..., Id_k} ...".
Anyway, sentence "\\cite{0000.0000} proposes ..." is NOT allowed. Avoid using a whole paragraph to describe one piece of data, nor should you list them one by one. Instead, appropriately describe the connections between them. 
- An example of a subsection in a report is as follows
(the information in this example MUST NOT be summarized in the report):
2.1 [SUBSECTION TITLE]

The diversity in graph computing also extends to programming interfaces, each tailored to specific domains
within graph operations. For graph querying, Gremlin and Cypher are widely used. Gremlin, part of Apache
TinkerPop, offers an extensive set of operators, providing rich expressiveness for graph traversal.
However, its robustness comes with complexity, as it includes over 200 steps, many with overlapping
functionalities. For instance, steps like valueMap and elementMap both return vertex/edge properties,
but with nuanced differences. This complexity poses challenges in ensuring comprehensive support within
interactive graph engines. Cypher \\cite{[Id]}, initiated by Neo4j, has gained wide adoption and
significantly contributed to the development of GQL, the emerging standard for querying graph databases.
The increasing demand for Cypher integration into various systems, including GraphScope, alongside the
standardization of ISO/GQL \\cite{[Id]}, highlights the evolving nature of graph querying interfaces.
Additionally, many graph databases offer the capability to register custom stored procedures for
enhanced querying functionality.
`;
};

const GET_REPORT_PROMPTS_CHN = (user_query, mind_map) => {
  return `
你是一名熟练且专业的写报告的AI助手，擅长根据用户提供的输入和思维导图撰写相应的报告。思维导图中通常根据用户的查询意图对数据进行了分类。

用户输入：${user_query}
思维导图：${mind_map}

写作指导：

- 报告应当使用中文输出，结尾部分不用附上thebibliography
- 报告开头通常包括引言，用于提供报告内容的简要概述，引言通常包含50个字。报告正文中通常包括若干小节，每个小节对应思维导图中的一个类别。在每个小节中，你必须提到尽可能多的属于该类别的数据。对于每个提到的数据，你需要解释其与当前小节对应类别的关系，而不是简单地罗列这些数据。
- 如果该报告是一个相关工作报告，那么不要在报告中直接写参考的文章的名字和标题。
- 每次在文本中首次提到一条数据时，需要添加引用，引用格式为 \\cite{Id}，并且引用不能用作句子主语。例如，假设数据p1的[Id]为0000.0000，则添加的引用应该为\\cite{0000.0000}。
如果数据提出了某种观点或方法M，句子可以为“M \\cite{0000.0000} ...”。如果数据有作者或来源信息A，句子可以为“A~\\cite{0000.0000} 提出...”。如果多条数据的ids [Id_1], ... [Id_k] 与某个项目或主题T相关，则句子可以为“主题T已被深入研究 \\cite{Id_1, ..., Id_k} ...”。无论如何，不允许有句子"\\cite{0000.0000} 提出 ..."的出现。上面只是一些写句子的例子，在实际写作时，在保证句子不以"\\cite{0000.0000}"开头的前提下可以自由发挥。
避免使用整段文字描述一条数据，也不应简单地逐一列出数据，而应适当地描述它们之间的关联。
报告小节的一个示例如下（此示例中的信息不得在报告中总结）：
2.1 [小节标题]
图计算的多样性也扩展到编程接口，每个接口都适用于图操作中的特定领域。对于图查询，Gremlin和Cypher被广泛使用。Gremlin是Apache TinkerPop的一部分，提供广泛的运算符集，为图遍历提供丰富的表达能力。然而，它的鲁棒性也带来了复杂性，因为其包含200多个步骤，其中许多步骤功能重叠。例如，valueMap和elementMap步骤都返回顶点/边的属性，但存在细微差别。这种复杂性在确保交互式图引擎的全面支持方面带来了挑战。Cypher \\cite{[Id]} 由Neo4j起步，已被广泛采用，并在GQL发展的过程中做出了显著贡献，GQL是一种新兴的图数据库查询标准。对Cypher集成到包括GraphScope在内的各种系统的需求增加，以及ISO/GQL \\cite{[Id]} 的标准化，突显了图查询接口的不断演进。此外，许多图数据库还提供注册自定义存储过程以增强查询功能的能力。
`;
};

const GET_REPORT_PROMPTS_2 = (user_query, mind_map) => {
  return `
  You are a highly skilled academic AI assistant. Given a user query and a mind map to generate a report
  
  User Query: ${user_query}
  Mind Map: ${mind_map}
  
  `;
};

const WriteReport: React.FunctionComponent<
  SummaryType & {
    task: string;
  }
> = props => {
  const { thinkRef, updateThink } = useThink();
  const { categories, task } = props;
  const [state, setState] = useState({
    loading: false,
    report: '',
  });
  const { loading, report } = state;

  const handleClick = async () => {
    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    /** MOCK START */
    if (MOCK.enable) {
      await MOCK.sleep(200);
      const report = await MOCK.report();
      setState(preState => {
        return {
          ...preState,
          loading: false,
          report,
        };
      });
      return;
    }
    /** MOCK END */

    const categoriesWithoutChildren = categories.map(category => ({
      name: category.name,
      description: category.description,
    }));

    const intro_res = await query(
      [
        new Message({
          role: 'user',
          content: GET_REPORT_PROMPTS_BY_SECTION_INTRO_EN(task, 50, JSON.stringify(categoriesWithoutChildren)),
        }),
      ],
      updateThink,
    );
    const intro_text = intro_res.message.content;

    let section_no = 0;
    let already_sec = '';
    for (const category of categories) {
      section_no += 1;
      const res = await query(
        [
          new Message({
            role: 'user',
            content: getPrompt({ 'zh-CN': GET_REPORT_PROMPTS_CHN, 'en-US': GET_REPORT_PROMPTS_BY_SECTION_TEXT_EN })(
              task,
              JSON.stringify(category),
              JSON.stringify(section_no),
              SECTION_CONSTANT_EXAMPLE_EN,
              intro_text,
            ),
          }),
        ],
        updateThink,
      );
      already_sec = already_sec + '\n' + res.message.content;
    }

    already_sec = intro_text + '\n' + already_sec;

    setState(preState => {
      return {
        ...preState,
        loading: false,
        report: already_sec,
      };
    });
  };

  const handleDownloadMindmap = () => {
    Utils.createDownload(JSON.stringify(categories, null, 2), 'mindmap.json');
  };

  return (
    <Flex vertical gap={12}>
      <Flex gap={12}>
        <Button onClick={handleDownloadMindmap}>Download Mindmap</Button>
        <Button onClick={handleClick} loading={loading} type="primary" block>
          Write Report
        </Button>
      </Flex>
      <Think ref={thinkRef} />

      {report && <ReportText report={report} enableBib />}
    </Flex>
  );
};

export default WriteReport;
