RELATED_WORK_INTRODUCTION_PROMPT = """Write a section introduction of the section Related Work (i.e., Section 2)
with no more than 50 words and one paragraphs at most. The related works are categoried according to
{group_by_prop}, and the {group_by_prop}s are detailed as follows:
{prop_slot}

Now, start to write the section introduction.
"""

RELATED_WORK_TEXT_PROMPT = """In the following texts, we list a {group_by_prop} with its {group_by_prop} name
and descriptions, for the {group_by_prop}, we list the research papers related to it. 
The information of the papers are as follows:
<RELATED PAPER>
{prop_slot}
{paper_slot}
</RELATED PAPER>\n
{generate_instruction}
"""

TEXT_EXAMPLE_PROMPT = """An example of a subsection in a related work section is as follows
(the information in this example MUST NOT be summarized in the section):
2.1 [SECTION TITLE]

The diversity in graph computing also extends to programming interfaces, each tailored to specific domains
within graph operations. For graph querying, Gremlin and Cypher are widely used. Gremlin, part of Apache
TinkerPop, offers an extensive set of operators, providing rich expressiveness for graph traversal.
However, its robustness comes with complexity, as it includes over 200 steps, many with overlapping
functionalities. For instance, steps like valueMap and elementMap both return vertex/edge properties,
but with nuanced differences. This complexity poses challenges in ensuring comprehensive support within
interactive graph engines. Cypher \cite{[Paper Id]}, initiated by Neo4j, has gained wide adoption and
significantly contributed to the development of GQL, the emerging standard for querying graph databases.
The increasing demand for Cypher integration into various systems, including GraphScope, alongside the
standardization of ISO/GQL \cite{[Paper Id]}, highlights the evolving nature of graph querying interfaces.
Additionally, many graph databases offer the capability to register custom stored procedures for
enhanced querying functionality.
"""

SUBSECTION_INSTRUCTION_PROMPT = """
\n\nNow, write the subsection (i.e., Section 2.{subsection_id}) about this {group_by_prop} and this subsection
should contain at most three paragraphs. Besides, this subsection can contain at most {max_token_per_subsection} words.
You must mention as many papers related to this {group_by_prop} provided between <RELATED PAPER> and <\RELATED PAPER> as possible.
For each mentioned paper, you MUST explain how this paper address this {group_by_prop}. Every time a paper is first mentioned in the text,
add a citation in the format \cite{{Paper Id}} and you must not use \cite as the subject of the sentence.
For example, suppose the [Paper Id] of paper p1 is 0000.0000, then the citation should be added as \cite{{0000.0000}}.
If the paper propose a method named M, the sentence may be "M \cite{{0000.0000}} ...". If the paper's [Authors] are A, B, and C,
the sentence may be "A et al.~\cite{{0000.0000}} propose that ...". If several papers with ids [Paper Id_1], ... [Paper Id_k] are
related to an item or topic T, then the sentence may be "The are many related works of this topic \cite{{Paper Id_1, ..., Paper Id_k}} ...".
Anyway, sentence "\cite{{0000.0000}} proposes ..." is NOT allowed. Do not introduce one related work in each paragraph,
nor should you list them one by one. Instead, appropriately describe the connections between them.
If a paper is already mentioned in the previous texts, you MUST NOT uses this paper again in this subsection.
For example, Assume that Paper A has been mentioned in a previous subsection (e.g., Subsection 2.1 or Subsection 2.2)
and is related to the current subsection. If there are at least four relevant papers that have not been mentioned in
previous subsections, then you are prohibited from mentioning Paper A in this subsection, and instead,
you should introduce the current subsection by referencing those unmentioned papers.
"""


PREVIOUS_SUBSECITON_PROMPT = """The following is the previously generated related work on other {group_by_prop}s.
Please create a new subsection to continue writing about the current {group_by_prop}:
<PREVIOUS></PREVIOUS>
"""

BASELINE_RELATED_WORK_TEXT_PROMPT = """You are a researcher in the area of computer science and you are
good at writing related work section of papers. In the following text, we list some research papers.
For each paper, [Paper Title] provides the title of the paper, [Authors] show the authors of the paper,
[Abstract] is the abstract extracted from the paper. The information of the papers are as follows:
<RELATED PAPER>
{paper_slot}
</RELATED PAPER>

Now, write the related work section and this section should contain several subsections and each subsection
contains about five paragraphs. Each subsection MUST NOT contain more than {max_token_per_subsection} words.
Besides, this section should include a section introduction at the beginning of this section.
You must mention as many papers related works provided between <RELATED PAPER> and <\RELATED PAPER> as possible.
Do not introduce one related work in each paragraph, nor should you list them one by one. Instead,
appropriately describe the connections between them. Do not always start paragraphs with the title of the paper.
Different related works should be allocated to different subsections based on the {group_by_prop}s they address
and the related works should be categorized according to the {group_by_prop}s they address, the titles of subsections
should be the {group_by_prop}s. You should cite papers with their paper titles.
"""


SUMMARIZE_PROMPT = """The {group_by_prop} addressed in the following papers is not any one of [{category_list}].
Please summarize a common {group_by_prop} faced by the following papers, the common {group_by_prop} should have a name,
which must not be like 'Common Task Across the Papers':
{paper_slot}
"""
