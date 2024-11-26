import json
from graph.nodes.paper_reading_nodes import try_fix_json


def test_fix_json():
    json_to_fix = """```json {
      "graph": {
        "nodes": [
          {
            "name": "Paper",
            "node_type": "BASE"
          }
        ],
        "edges": [
          {
            "source": "Paper",
            "target": "Paper"
          }
        ]
      }
  }```
  """

    json_corrected = """{
      "graph": {
        "nodes": [
          {
            "name": "Paper",
            "node_type": "BASE"
          }
        ],
        "edges": [
          {
            "source": "Paper",
            "target": "Paper"
          }
        ]
      }
  }
   """

    assert json.loads(json_corrected) == try_fix_json(json_to_fix)
