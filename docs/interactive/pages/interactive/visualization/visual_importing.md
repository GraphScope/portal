---
title: Visual Modeling
---

After creating the draft instance, we need to click on "Modeling" to enter the visual graph modeling page.
Here, we have two ways to build the model:

## Create Graph Model

### Options 1: Manual Creation

#### Create Vertex and Vertex Properties

We need to click the fourth button, "Create new vertex," in the sidebar to create a node on the canvas. The initial name of the node will be "Vertex_1.

After clicking on the node, we can manually modify its label in the right-hand panel, or simply double-click the node to edit it directly on the canvas.
<img src="/visualization/modeling/add_vertex_edit.png" />

Next, following the prompts, we need to complete the property information for this node. Click the "Plus" button under Properties to add attributes, and fill them out one by one.
<img src="/visualization/modeling/add_property.png" />

If we want to delete a node’s property, check the properties you wish to remove in the Checkbox area and click the delete button.
<img src="/visualization/modeling/delete_property.png" />

#### Create Edges

Now let's create edges. To create an edge, hover over the edge of the starting node, then click and drag.
<img src="/visualization/modeling/drag_start.png" />

If the endpoint is an empty area of the canvas, a new node will automatically be created.
<img src="/visualization/modeling/drag_end.png" />

If the endpoint is another existing node, an edge will be established between the two nodes.
<img src="/visualization/modeling/drag_other_edge_end.png" />

### Option 2: Parsing CSV Files for Creation

Manually creating a graph model is particularly helpful when designing complex business models. However, when we already have some graph data, automatically deriving the graph model based on the existing data becomes a more convenient approach.

Note: There are two constraints for the CSV files here:

- Each CSV file, by default, represents one type of label. The file name should ideally be the label name, such as person.csv.
- The CSV file must include a header row.

When the above two requirements are met, we can utilize the "Automatic Parsing and Modeling" feature provided by GraphScope Portal, which is located in the second option of the right-hand sidebar.
<img src="/visualization/modeling/auto_parse_1.png" />

After uploading the data, we only need to verify each CSV file to ensure that the automatically inferred node and edge types are accurate.

<img src="/visualization/modeling/auto_parse_2.png" />

Once confirmed, we can click "Generate Graph Model" , and the system will automatically derive the graph model.

<img src="/visualization/modeling/auto_parse_3.png" />

## Save Model

Once the model is created and passes the system's validation, we can save the model. Here,there are two key points that <strong> require special attention:</strong>

> - Each `vertex label` must have a `primary key` in its properties, and each `edge label` can only have one property field.
> - <span style='color:red'>The `GraphScope Interactive` engine does not support modifications to the graph model. If you need to modify the graph model, you must create a new graph instance.</span>

<img src="/visualization/modeling/save_model.png" />

Now, let's goto importing page
