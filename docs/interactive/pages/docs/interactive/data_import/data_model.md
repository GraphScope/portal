# Data Model

When working with GraphScope Interactive, the data model must be defined while importing graph data.
The data model consists of two primary components: graph data and property data.

## Graph Data
The graph data encompasses two fundamental elements:

- **Vertex (Vertices)**: A vertex represents an entity in the graph. In the context of the property graph model, vertices are often referred to as nodes. Each vertex has a unique identifier and can have zero or more properties associated with it. For example, in a social network graph, a vertex could represent a person, with properties like name, age, and location.

- **Edge (Edges)**: Edges define the relationships between vertices. Each **directed** edge has a source vertex, a destination vertex, and a type that describes the nature of the relationship. Additionally, edges can also have properties. For instance, in a social network graph, an edge might represent a friendship between two people and could have properties like "since_date" indicating when the friendship started.

Note: This graph model aligns with the property graph model, which offers a detailed explanation [here](https://subscription.packtpub.com/book/data/9781784393441/1/ch01lvl1sec09/the-property-graph-model). However, it's essential to note our terminology: we use "vertex" instead of "node" and "edge" instead of "relationship", and we only support **directed** edge instead of both directed and undirected edge.

Within the `graph.yaml` file, vertices are delineated under the `vertex_types` section. Each vertex type is structured with mandatory fields: `type_name`, `properties`, and `primary_keys`. For instance:

```yaml
- type_name: person
  description: all persons
  properties:
    - property_name: id
      property_type:
        primitive_type: DT_SIGNED_INT64
    - property_name: name
      property_type:
        string:
          long_text:
  primary_keys: # these must also be listed in the properties
    - id
```

Note:
- In the current version, only one single primary key can be specified, but we plan to support multiple primary keys in the future.
- The data type of primary key column must be one of `DT_SIGNED_INT32`, `DT_UNSIGNED_INT32`, `DT_SIGNED_INT64`,`DT_UNSIGNED_INT64`, or string types `var_char`,`long_text`(`fixed_char` is currently not supported).

Edges are defined within the `edge_types` section, characterized by the mandatory fields: `type_name`, `vertex_type_pair_relations`, and `properties`. The type_name and properties fields function similarly to those in vertices. However, the vertex_type_pair_relations field is exclusive to edges, specifying the permissible source and destination vertex types, as well as the relationship detailing how many source and destination vertices can be linked by this edge. Here's an illustrative example:
```yaml
type_name: knows
description: The relationship between persons.
vertex_type_pair_relations:
  - source_vertex: person
    destination_vertex: person
    # the "knows" edge can link multiple source and destination vertices
    relation: MANY_TO_MANY
```

Note:
- A single edge type can have multiple `vertex_type_pair_relations`. For instance, a "knows" edge might connect one person to another, symbolizing their friendship. Alternatively, it could associate a person with a skill, indicating their proficiency in that skill.
- The permissible relations include: `ONE_TO_ONE`, `ONE_TO_MANY`, `MANY_TO_ONE`, and `MANY_TO_MANY`. These relations can be utilized by the optimizer to generate more efficient execution plans.
- Currently we only support at most one property for each edge triplet.
- We currently only support `var_char` and `long_text` as the edge property among all string types.
- All implementation related configuration are put under `x_csr_params`.
  - `max_vertex_num` limit the number of vertices of this type:
    - The limit number is used to `mmap` memory, so it only takes virtual memory before vertices are actually inserted.
    - If `max_vertex_num` is not set, a default large number (e.g.: 2^48) will be used.
  - `edge_storage_strategy` specifies the storing strategy of the incoming or outgoing edges of this type, there are 3 kinds of strategies
    - `ONLY_IN`: Only incoming edges are stored.
    - `ONLY_OUT`: Only outgoing edges are stored.
    - `BOTH_OUT_IN`(default): Both direction of edges are stored.


## Property Data

Property data pertains to the properties associated with vertices and edges. In GraphScope Interactive, we support a diverse range of data types for these properties:

### Primitive Types
- DT_SIGNED_INT32
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :-------------: | :-------------: |
  | 4 bytes           |   Signed four-byte integer  | v1.0 |
- DT_UNSIGNED_INT32
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :-------------: | :-------------: |
  | 4 bytes           |   Unsigned four-byte integer  | v1.0 |
- DT_SIGNED_INT64
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :-------------: | :-------------: |
  | 8 bytes           |   Signed four-byte integer  | v1.0 |
- DT_UNSIGNED_INT64
  | **Size**          | **Description** |**Since Version** |
  | :---------------- | :-------------: | :-------------: |
  | 8 bytes           |   Unsigned four-byte integer  | v1.0 |
- DT_BOOL
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :-------------: | :-------------: |
  | 1 byte           |   Boolean value: true/false |  v1.0 |
- DT_FLOAT
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :-------------: | :-------------: |
  | 4 bytes           |   Single precision floating-point number | v1.0 |
- DT_DOUBLE
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :-------------: | :-------------: |
  | 8 bytes           |  Double precision floating-point number | v1.0 |

In the `graph.yaml`, a primitive type, such as `DT_DOUBLE`, can be written as:
```yaml
property_type:
  primitive_type: DT_DOUBLE
```


### String Types

We categorize string type into three subtypes:
- char:
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :------------- | :-------------: |
  | `fixed_length` bytes       |  A string type with a fixed length. The field defines an attribute `fixed_length`, which specifies the desired length of the string. The string will be restricted to the specified length, and **cut off** when overflowed | v1.0 |

  String type of char can be written in `yaml` as:

  ```yaml
    char:  # string with fixed length
      fixed_length: <uint32>
  ```

- var_char:
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :------------- | :-------------: |
  | at most max_length bytes    |      A string type with variable length, bounded by a `max_length`. The field defines an attribute `max_length`, which sets the maximum length of the string. The string will be limited to the specified maximum length, and **cut off** when overflowed | v1.0 |

  String type of varchar can be written in `yaml` as:

  ```yaml
    var_char:  # string with variable length, bounded by max_length
      max_length: <uint32>
  ```

- long_text:

  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :------------- | :------------- |
  | unbounded    |    A string type with no length limitation, allowing for unbounded text content.  | Implemented as `var_char` with `max_length` defined as **10000** in v1.0. Will be officially supported in v1.1 |

  String type of long_text can be written in `yaml` as:

  ```yaml
  string:
    long_text: # string with unlimited length
  ```




### Temporal types
We have supported the following temporal types:

- date32:
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :------------- | :-------------: |
  | 4 bytes     | Represents the date as an integer, with the value being the number of days since January 1, 1970.  | v1.0 |

  Temporal type of date32 can be written in `yaml` as:

  ```yaml
  temporal:
    date32: # int32 days since 1970-01-01
  ```

- timestamp:

  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :------------- | :-------------: |
  | 8 bytes     | Denotes a timestamp as an integer, representing the number of milliseconds since January 1, 1970 at 00:00:00.000. | v1.0 |


  Temporal type of timestamp can be written in `yaml` as:

  ```yaml
  temporal:
    timestamp: # int64 milliseconds since 1970-01-01 00:00:00.000000
  ```

Other temporal types that will be supported in future versions:

- date:
  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :------------- | :-------------: |
  | 10 bytes in ISO format     | Denotes a date value. Optionally, the field date_format can be specified to define the format of the date. The date_format attribute could take a value like DF_YYYY_MM_DD, indicating the ISO format: "2019-01-01". | v1.1 |

  Temporal type of date can be written in `yaml` as:

  ```yaml
  temporal:
    date:
      # optional value: "DF_YYYY_MM_DD", means ISO fomat: 2019-01-01
      date_format: <string>
  ```

- time:

  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :------------- | :------------- |
  | 12 bytes in ISO format     | Represents a time value. Optionally, the field time_format can be used to specify the format of the time. The time_format attribute could take a value like TF_HH_MM_SS_SSS, indicating the ISO format: "00:00:00.000". The time_zone_format attribute can also be included to define the format of the time zone, with optional values of TZF_UTC or TZF_OFFSET. | v1.1 |


  Temporal type of time can be written in `yaml` as:

  ```yaml
  temporal:
    time:
      # optional value: TF_HH_MM_SS_SSS, means ISO format: 00:00:00.000
      time_format: <string>
      # optional value: TZF_UTC, TZF_OFFSET
      time_zone_format: <string>
  ```

  - datetime:

  | **Size**          | **Description** | **Since Version** |
  | :---------------- | :------------- | :------------- |
  | 23 bytes in ISO format     | Signifies a combination of date and time. The field date_time_format is optional and can be used to specify the format of the date and time. For example, a date_time_format value of DTF_YYYY_MM_DD_HH_MM_SS_SSS would indicate the ISO format: "2019-01-01 00:00:00.000". The time_zone_format attribute can additionally be specified to define the format of the time zone, with optional values of TZF_UTC or TZF_OFFSET. | v1.1 |


  Temporal type of datetime can be written in `yaml` as:

  ```yaml
  temporal:
    date_time:
      # optional value: TF_HH_MM_SS_SSS, means ISO format: 00:00:00.000
      date_time_format: <string>
      # optional value: TZF_UTC, TZF_OFFSET
      time_zone_format: <string>
  ```


### Composite Data Types

Interactive currently does not support any composite data types, including array, map or struct types.

Array types will be supported in v1.0.
We require that every element within the array adheres to one of the previously mentioned primitive types,
and all elements within a single array share the same type.

In `graph.yaml`, user can describe designating a property as an array of the `DT_UNSIGNED_INT64` type as:

```yaml
property_type:
  array:
    component_type:
      primitive_type: DT_UNSIGNED_INT64
      max_length: 10  # overflowed elements will be truncated
```
