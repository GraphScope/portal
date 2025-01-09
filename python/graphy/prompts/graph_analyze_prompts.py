CYPHER_QUERY_EXAMPLE = """
Query Example:
Positive Example:
MATCH (p:Paper)-[r:Paper_Has_Challenge]->(c:Challenge)
OPTIONAL MATCH (p)-[:Paper_Has_Solution]->(s:Solution)
RETURN p.title AS paper_title, c.name AS challenge_name, s.name AS solution_name, c.description AS challenge_description, s.description AS solution_description
ORDER BY challenge_name ASC

Negatve Example:
MATCH (p:Paper)-[r:Paper_Has_Challenge]->(c:Challenge)
OPTIONAL MATCH (p)-[:Paper_Has_Solution]->(s:Solution)
RETURN p.title AS paper_title, c.name AS challenge_name, s.name AS solution_name, c.description AS challenge_description, s.description AS solution_description
ORDER BY c.name ASC

"""

TEMPLATE_QUERY_GENERATOR = """
You are a highly skilled AI graph database expert. Given the user queries and the schema of a graph database, your role is to identify which information in the database is necessary to meet the user's requirements and provide the corresponding database query following the {language} syntax.
The next step involves conducting specific analyses with the queried data, such as sorting, classifying, and describing the data. Therefore, when selecting attributes, it is important to analyze the intent of the user's query, clarify the purpose of the data query, and then determine the attributes that may be needed.
Before crafting query statements, thoroughly analyze the schema provided by the user to identify valid labels for nodes and edges. Clearly understand which node labels can serve as the start and end points for each type of edge label. This ensures that you construct executable query statements.
Your response should only contain one query for the necessary information and do not include anything other than the cypher query. Do not start with ```.

User Query: {user_query}
Schema: {schema}
{example}

"""

TEMPLATE_MIND_MAP_GENERATOR = """
You are a highly skilled academic AI assistant. Given a user query and a set of papers with their properties, your role is to categorize the given papers based on the user's goals and the provided data by selecting specific dimensions. Each category should have a name and a corresponding description. For each category, maintain a list of paper IDs and paper titles that belong to that category.

User Query: {user_query}
Papers: {paper_slot}

Guidance:
- When selecting dimensions for categorization, you should choose those that are as distinct and important as possible.
- When categorizing, try not to have a single paper belong to more than one category.
- The number of categories is not necessarily the more the better; generally, dividing into 2-4 categories is preferable.
"""


TEMPLATE_RELATED_WORK_GENERATOR = """
You are a highly skilled academic AI assistant. Given a user query and a mind map that categories the papers, your role is to write a related work section.

User Query: {user_query}
Mind Map: {mind_map}

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
"""


TEMPLATE_RELATED_WORK_INTRO_GENERATOR = """Write a section introduction of the section Related Work (i.e., Section 2)
with no more than 50 words and one paragraphs at most. The related works are categoried and the categories are detailed as follows:
{prop_slot}

Now, start to write the section introduction.
"""


# You are a highly skilled academic AI assistant. Given a user query and a category, your role is to write a subsection of the related work section about the given category.
# You are a highly skilled academic AI assistant. Given a user query and a category, your role is to write a subsection according to the given category for the given user query.


TEMPLATE_RELATED_WORK_TEXT_PROMPT = """
You are a highly skilled academic AI assistant. Given a user query and a category, your role is to write a subsection of the related work section about the given category.

User Query: {user_query}
Category: <CATEGORY INFO> {prop_slot} </CATEGORY INFO>

In the <CATEGORY INFO></CATEGORY INFO> part, we list a category with its category name
and descriptions. For the category, we list the research papers related to it in its attribute item_list. 
\n
{generate_instruction}
"""


TEMPLATE_TEXT_EXAMPLE_PROMPT = """An example of a subsection in a related work section is as follows
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
"""

TEMPLATE_SUBSECTION_INSTRUCTION_PROMPT = """
\n\nNow, write the subsection (i.e., Section 2.{subsection_id}) about this category and this subsection
can contain one or two or three paragraphs. Besides, this subsection can contain at most {max_token_per_subsection} words.
You must try your best to mention all the papers related to this category provided between <CATEGORY INFO> and </CATEGORY INFO>, but NEVER write the title of the paper in the text.
For each mentioned paper, you need to explain its relationship with the category corresponding to the current subsection. Every time a paper is first mentioned in the text,
add a citation in the format \cite{{Id}} and you must not use \cite as the subject of the sentence.
For example, suppose the [Id] of paper p1 is 0000.0000, then the citation should be added as \cite{{0000.0000}}.
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
"""

TEMPLATE_PREVIOUS_SUBSECITON_PROMPT = """The following is the previously generated related work on other categories.
Please create a new subsection to continue writing about the current category:
<PREVIOUS></PREVIOUS>
"""


#################### EVOLVE #######################


TEMPLATE_EVOLVE_TEXT_PROMPT = """
You are a highly skilled academic AI assistant. Given a user query and a category, your role is to write a subsection to describe the given category. Specifically, each category corresponds to several papers published in a short period of time.

User Query: {user_query}
Category: <CATEGORY INFO> {prop_slot} </CATEGORY INFO>

In the <CATEGORY INFO></CATEGORY INFO> part, we list a category with its category name
and descriptions. For the category, we list the research papers related to it in its attribute item_list. 
\n
{generate_instruction}
"""

TEMPLATE_EVOLVE_SUBSECTION_INSTRUCTION_PROMPT = """
\n\nNow, write the subsection (i.e., Section 2.{subsection_id}) about this category and this subsection
can contain one or two or three paragraphs. Besides, this subsection can contain at most {max_token_per_subsection} words.
You must try your best to mention all the papers related to this category provided between <CATEGORY INFO> and </CATEGORY INFO>, but NEVER write the title of the paper in the text.
For each mentioned paper, you need to explain its method. Every time a paper is first mentioned in the text,
add a citation in the format \cite{{Id}} and you must not use \cite as the subject of the sentence.
For example, suppose the [Id] of paper p1 is 0000.0000, then the citation should be added as \cite{{0000.0000}}.
If the paper propose a method named M, the sentence may be "M \cite{{0000.0000}} ...". If the paper's [Authors] are A, B, and C,
the sentence may be "A et al.~\cite{{0000.0000}} propose that ...". If several papers with ids [Id_1], ... [Id_k] are
related to an item or topic T, then the sentence may be "The are many related works of this topic \cite{{Id_1, ..., Id_k}} ...".
Anyway, sentence "\cite{{0000.0000}} proposes ..." is NOT allowed. Do not introduce one paper in each paragraph,
nor should you list them one by one. Instead, appropriately describe the connections between them.
If a paper is already mentioned in the previous texts, you MUST NOT uses this paper again in this subsection.
For example, Assume that Paper A has been mentioned in a previous subsection (e.g., Subsection 2.1 or Subsection 2.2)
and is related to the current subsection. If there are at least four relevant papers that have not been mentioned in
previous subsections, then you are prohibited from mentioning Paper A in this subsection, and instead,
you should introduce the current subsection by referencing those unmentioned papers.
"""

TEMPLATE_EVOLVE_PREVIOUS_SUBSECITON_PROMPT = """The following is the previously generated related work proposed earlier.
Please create a new subsection to continue writing about the current category:
<PREVIOUS></PREVIOUS>

In this subsection, when introducing a paper, you can highlight the significant improvements or differences compared to the methods mentioned in previous subsections, especially the preceding one. Additionally, you may provide a brief summary at the beginning of this subsection.
Assess whether papers in the current category show improvements in specific aspects compared to those in earlier categories. If improvements are present, clearly explain them in a suitable part of this subsection.
"""
