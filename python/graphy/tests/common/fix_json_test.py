import json

from graph.nodes.dag_node import try_fix_json


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


def test_fix_json2():
    json_to_fix = """```begin {
      "graph": {
        "nodes": [
          {
            "name": "Paper\Delta",
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
  } end```
  """

    json_corrected = """{
      "graph": {
        "nodes": [
          {
            "name": "Paper\\\\Delta",
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
