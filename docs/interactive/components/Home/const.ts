export const gradientTextStyle = {
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #25b3fd 0, #3cecd7 41.15%, #2782f3 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export const data = [
  {
    url: 'https://memgraph.com/_next/image?url=%2Fimages%2Fhomepage%2FKate-image.png&w=256&q=75',
    title: 'Katarina Supe',
    description: 'Developer Experience Engineer',
  },
  {
    url: 'https://memgraph.com/_next/image?url=%2Fimages%2Fhomepage%2FAnte-image.png&w=256&q=75',
    title: 'Ante Javor',
    description: 'Developer Experience Engineer',
  },
  {
    url: 'https://memgraph.com/_next/image?url=%2Fimages%2Fhomepage%2FBuda-image.png&w=256&q=75',
    title: 'Marko Budiselic',
    description: 'CTO, Founder',
  },
];
/** 安装数据 */
export const codemirrorCode = `import graphscope as gs
from graphscope.dataset.modern_graph import load_modern_graph

gs.set_option(show_log=True)

# load the modern graph as example.
graph = load_modern_graph()

# Hereafter, you can use the graph object to create an interactive query session
g = gs.interactive(graph)
# then execute any supported gremlin query (by default)
q1 = g.execute('g.V().count()')
print(q1.all().result())   # should print [6]

q2 = g.execute('g.V().hasLabel(\'person\')')
print(q2.all().result())  # should print [[v[2], v[3], v[0], v[1]]]

# or execute any supported Cypher query, by passing lang="cypher"
q3 = g.execute("MATCH (n) RETURN count(n)", lang="cypher")
print(q3.records[0][0])  # should print 6`;
