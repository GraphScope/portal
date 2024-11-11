from typing import Dict, Any, List, Tuple
from enum import Enum, auto
import logging
import copy

logger = logging.getLogger(__name__)


class LayerHierarchy(Enum):
    """
    Enumeration of the layer names of vectordb.
    """

    MetaLayer = auto()
    DataLayer = auto()


class SetOperator(Enum):
    Recursive = auto()
    Compute = auto()
    Union = auto()
    Intersect = auto()


class SearchUnit:
    def __init__(
        self, s_op: SetOperator, slist: List, result_num=-1, max_result_num=10
    ) -> None:
        self.set_operator = s_op

        if s_op == SetOperator.Compute and len(slist) > 1:
            self.condition_list = slist[0]
        else:
            self.condition_list = slist

        self.result_num = result_num
        self.max_result_num = max_result_num
        self.conditions = {}

    def add_meta_in(self, meta_name, value_list):
        self.conditions.update()

    def _formulate(self, query: str, collection):
        pass

    def execute(self, query, where_condition, where_document, result_num, collection):
        # print("###### EXECUTE #########")
        # print(query, where_condition, result_num)
        # print(where_document)
        if result_num == -1:
            return collection.query(
                query_texts=[query],
                n_results=self.max_result_num,
                where=where_condition,
                where_document=where_document,
            )
        return collection.query(
            query_texts=[query],
            n_results=result_num,
            where=where_condition,
            where_document=where_document,
        )


class SearchRecursiveUnit(SearchUnit):
    def __init__(
        self,
        slist: List,
        return_attr: str,
        value_subquery: str,
        subquery_result_num,
        doc_search_unit,
        result_num=-1,
        max_result_num=10,
    ) -> None:
        super().__init__(SetOperator.Recursive, slist, result_num, max_result_num)

        self.subquery_result_num = subquery_result_num
        self.return_attr = return_attr
        self.subquery = value_subquery
        self.doc_search_unit = doc_search_unit

    def _formulate(self, query: str, collection):
        if self.subquery is not None and "{slot}" in self.subquery:
            sub_query = self.subquery.replace("{slot}", query)
        else:
            sub_query = self.subquery

        if self.condition_list[1] is not None:
            succ, sub_where_condition = self.condition_list[1]._formulate(
                sub_query, collection
            )
            if not succ:
                return False, None
        else:
            sub_where_condition = None

        if self.doc_search_unit is not None:
            succ, sub_doc_condition = self.doc_search_unit._formulate(
                sub_query, collection
            )
            if not succ:
                return False, None
        else:
            sub_doc_condition = None

        output = self.execute(
            sub_query,
            sub_where_condition,
            sub_doc_condition,
            self.subquery_result_num,
            collection,
        )
        in_list = []
        # print("======= RECUR OUT =========")
        # print(output)

        if self.return_attr == "documents":
            documents = output["documents"][0]

            for page_content in documents:
                in_list.append(page_content)
        elif self.return_attr is None or self.return_attr == "all":
            in_list = output
        else:
            metadatas = output["metadatas"][0]
            for meta in metadatas:
                in_list.append(meta[self.return_attr])

        if len(in_list) == 0:
            return False, None

        result_dict = copy.deepcopy(self.condition_list[0])
        for key, value in self.condition_list[0].items():
            if type(value) is dict and "subquery" not in value:
                for key_of_value in value:
                    if key_of_value == "$in":
                        result_dict[key][key_of_value] = in_list
                    else:
                        result_dict[key][key_of_value] = in_list[0]
            else:
                if key == "OUTPUT":
                    result_dict[key] = in_list
                else:
                    result_dict[key] = in_list[0]

        # print(result_dict)
        return True, result_dict


class SearchUnionUnit(SearchUnit):
    def __init__(self, slist: List, result_num=-1, max_result_num=10) -> None:
        super().__init__(SetOperator.Union, slist, result_num, max_result_num)

    def _formulate(self, query: str, collection):
        or_list = []
        for sub_unit in self.condition_list:
            _, component = sub_unit._formulate(query, collection)
            or_list.append(component)
        return True, {"$or": or_list}


class SearchIntersectUnit(SearchUnit):
    def __init__(self, slist: List, result_num=-1, max_result_num=10) -> None:
        super().__init__(SetOperator.Intersect, slist, result_num, max_result_num)

    def _formulate(self, query: str, collection):
        and_list = []
        for sub_unit in self.condition_list:
            _, component = sub_unit._formulate(query, collection)
            and_list.append(component)
        return True, {"$and": and_list}


class SearchComputeUnit(SearchUnit):
    def __init__(self, slist: List, result_num=-1, max_result_num=10) -> None:
        super().__init__(SetOperator.Compute, slist, result_num, max_result_num)

    def _formulate(self, query: str, collection):
        return True, self.condition_list[0]


class SearchUnitExecutor:
    def __init__(self, sd: Dict, collection, max_result_num=10):
        self.collection = collection
        self.max_result_num = max_result_num

        if sd is None:
            sd = {"OUTPUT": {"subquery": "{slot}"}}
        else:
            sd = {"OUTPUT": sd}
        self.root_search_unit = self.parse(sd)

    # {"$and":
    #       [{"category": "chroma"},
    #           {"$or": [
    #           {"author": "john"},
    #           {"author": "jack"}
    #           {'name': {'$in': [1,2,3]}}
    #           {'age': {
    #               'conditions': {}
    #               'return': <attribute_name>
    #               'subquery': xxx {slot} xxx
    #               'result_num': -1
    #               }
    #           }
    #
    #           ]
    #       }
    #   ]
    # }

    def parse(self, cdict: Dict):
        search_unit = None
        if cdict is None:
            return None

        if "$and" in cdict:
            unit_list = cdict["$and"]
            slist = []
            for unit in unit_list:
                sub_search_unit = self.parse(unit)
                slist.append(sub_search_unit)
            search_unit = SearchIntersectUnit(slist, max_result_num=self.max_result_num)
        elif "$or" in cdict:
            unit_list = cdict["$or"]
            slist = []
            for unit in unit_list:
                sub_search_unit = self.parse(unit)
                slist.append(sub_search_unit)
            search_unit = SearchUnionUnit(slist, max_result_num=self.max_result_num)
        else:
            is_recursive = False
            parse_dict = None
            for key, value in cdict.items():
                if type(value) is dict and "subquery" not in value:
                    for key_of_value, value_of_value in value.items():
                        if type(value_of_value) is dict:
                            is_recursive = True
                            parse_dict = value_of_value
                elif type(value) is dict and "subquery" in value:
                    is_recursive = True
                    parse_dict = value

            if is_recursive:
                slist = [cdict]
                is_recursive = True
                sub_search_unit = self.parse(parse_dict.get("conditions", None))
                slist.append(sub_search_unit)
                return_attr = parse_dict.get("return", None)
                value_subquery = parse_dict.get("subquery", None)
                subquery_result_num = parse_dict.get("result_num", -1)
                sub_doc_search_unit = self.parse(parse_dict.get("doc_conditions", None))
                search_unit = SearchRecursiveUnit(
                    slist,
                    return_attr,
                    value_subquery,
                    subquery_result_num,
                    sub_doc_search_unit,
                    max_result_num=self.max_result_num,
                )
            else:
                search_unit = SearchComputeUnit(
                    [cdict],
                    max_result_num=self.max_result_num,
                )

        return search_unit

    def search(self, query: str):
        if self.root_search_unit:
            succ, result = self.root_search_unit._formulate(query, self.collection)
            if succ:
                return result["OUTPUT"]
