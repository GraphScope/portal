import React, { useState } from 'react';
import { Button, Flex } from 'antd';
import { query } from '../Copilot/query';
import { Message } from '../Copilot/utils/message';
import ReactMarkdown from 'react-markdown';

interface IWriteReportProps {
  category: any;
  task: string;
}

const GET_REPORT_PROMPTS = (user_query, mind_map) => {
  return `
You are a highly skilled academic AI assistant. Given a user query and a mind map that categories the papers, your role is to write a related work section.

User Query: ${user_query}
Mind Map: ${mind_map}

Guidance:
- The beginning of a related work section typically includes a section introduction, which provides a brief summary of the contents of this section, usually around 50 words.
- A related work section typically includes several subsections, each corresponding to a category and can contain at most {max_token_per_subsection} words. In each subsection, you must mention as many papers related to this category as possible.
For each mentioned paper, you need to explain its relationship with the category corresponding to the current subsection. 
- Every time a paper is first mentioned in the text, add a citation in the format \cite{{Id}} and you must not use \cite as the subject of the sentence. For example, suppose the [Id] of paper p1 is 0000.0000, then the citation should be added as \cite{{0000.0000}}.
If the paper propose a method named M, the sentence may be "M \cite{{0000.0000}} ...". If the paper's [Authors] are A, B, and C,
the sentence may be "A et al.~\cite{{0000.0000}} propose that ...". If several papers with ids [Id_1], ... [Id_k] are
related to an item or topic T, then the sentence may be "The are many related works of this topic \cite{{Id_1, ..., Id_k}} ...".
Anyway, sentence "\cite{{0000.0000}} proposes ..." is NOT allowed. Do not introduce one related work in each paragraph,
nor should you list them one by one. Instead, appropriately describe the connections between them.
If a paper is already mentioned in the previous texts, you MUST NOT uses this paper again in this subsection.
For example, Assume that Paper A has been mentioned in a previous subsection (e.g., Subsection 2.1 or Subsection 2.2)
and is related to the current subsection. If there are at least four relevant papers that have not been mentioned in
previous subsections, then you are prohibited from mentioning Paper A in this subsection, and instead,
you should introduce the current subsection by referencing those unmentioned papers.
- An example of a subsection in a related work section is as follows
(the information in this example MUST NOT be summarized in the section):
2.1 [SECTION TITLE]

The diversity in graph computing also extends to programming interfaces, each tailored to specific domains
within graph operations. For graph querying, Gremlin and Cypher are widely used. Gremlin, part of Apache
TinkerPop, offers an extensive set of operators, providing rich expressiveness for graph traversal.
However, its robustness comes with complexity, as it includes over 200 steps, many with overlapping
functionalities. For instance, steps like valueMap and elementMap both return vertex/edge properties,
but with nuanced differences. This complexity poses challenges in ensuring comprehensive support within
interactive graph engines. Cypher \cite{{[Id]}}, initiated by Neo4j, has gained wide adoption and
significantly contributed to the development of GQL, the emerging standard for querying graph databases.
The increasing demand for Cypher integration into various systems, including GraphScope, alongside the
standardization of ISO/GQL \cite{{[Id]}}, highlights the evolving nature of graph querying interfaces.
Additionally, many graph databases offer the capability to register custom stored procedures for
enhanced querying functionality.
`;
};

const GET_REPORT_PROMPTS_2 = (user_query, mind_map) => {
  return `
  You are a highly skilled academic AI assistant. Given a user query and a mind map to generate a report
  
  User Query: ${user_query}
  Mind Map: ${mind_map}
  
  `;
};
const WriteReport: React.FunctionComponent<IWriteReportProps> = props => {
  const { category, task } = props;
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
    const res = await query([
      new Message({
        role: 'user',
        content: GET_REPORT_PROMPTS_2(task, JSON.stringify(category)),
      }),
    ]);

    setState(preState => {
      return {
        ...preState,
        loading: false,
        report: res.message.content,
      };
    });
  };

  return (
    <Flex vertical gap={12}>
      <Button onClick={handleClick} loading={loading}>
        Write Report
      </Button>
      {report && <ReactMarkdown>{report}</ReactMarkdown>}
    </Flex>
  );
};

export default WriteReport;
