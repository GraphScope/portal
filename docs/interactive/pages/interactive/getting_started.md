# Getting Started

Welcome to GraphScope Interactive! This guide will walk you through setting up and running your first queries with our system using `gsctl` [CLI](client_apis/gsctl) tool.

## Install Interactive

See [Installation Guide](./installation.md) for instructions on how to install and deploy Interactive.


## Connect to Interactive Service

You could connect to Interactive Service via `gsctl`.

```bash
gsctl connect --coordinator-endpoint http://127.0.0.1:8080
# change the port number if you have customized the coordinator port.
```


## Check Service Status

After connecting to the Interactive Service, you can now view what we have initially for you.

```bash
gsctl ls -l
```

A builtin graph is provided with name `gs_interactive_default_graph`. Now you can switch to the graph context:

```bash
gsctl use GRAPH gs_interactive_default_graph
gsctl service status # show current service status
```

As seen from the output, the Interactive service is already running on the built-in graph.


## Submit Cypher Queries

GraphScope Interactive seamlessly integrates with the Neo4j ecosystem. You can establish a connection to the Interactive service using Neo4j's Bolt connector and execute Cypher queries. Our implementation of Cypher queries aligns with the standards set by the [openCypher](http://www.opencypher.org/) project. For a detailed overview of the supported Cypher queries, please visit [supported_cypher](https://graphscope.io/docs/latest/interactive_engine/neo4j/supported_cypher). (TODO: this could be updated to refer to query manual)

Follow the instructions in [Connect-to-cypher-service](../../interactive_engine/neo4j/cypher_sdk) to connect to the Cypher service using either the Python client or cypher-shell.

To submit a simple query using `cypher-shell`:

#### Download `cypher-shell`

```bash
wget https://dist.neo4j.org/cypher-shell/cypher-shell-4.4.19.zip
unzip cypher-shell-4.4.19.zip && cd cypher-shell
```

#### Connect to the Service

```bash
./cypher-shell
# or -a neo4j://localhost:<port> to connect to the customized port
```

#### Run a Simple Query

```bash
@neo4j> MATCH (n) RETURN n LIMIT 10;
```

## Close the connection

If you want to disconnect to coordinator, just type

```bash
gsctl close
```

## Destroy the Interactive Instance

If you want to shutdown and uninstall the Interactive instance,

```bash
gsctl instance destroy --type interactive
```

> **Critical!!!: This will remove all the graph and data from the Interactive instance.**
