from .base_node import BaseNode, NodeType


class InspectorNode(BaseNode):
    """
    Node representing an inspector in the graph.
    """

    def __init__(
        self,
        name: str,
    ):
        super().__init__(name, NodeType.INSPECTOR)
