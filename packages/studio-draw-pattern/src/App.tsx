import { DrawPattern } from '.';
import { defaultEdges, defaultNodes } from './data';


function App() {
  return (
    <div style={{ height: '100vh' }}>
      <DrawPattern
        previewGraph={{
          // @ts-ignore
          nodes: defaultNodes,
          edges: defaultEdges,
        }}
      />
    </div>
  );
}

export default App;
