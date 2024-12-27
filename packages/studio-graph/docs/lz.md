```jsx
import React, {useEffect} from 'react';
import {
    Canvas,
    GraphProvider,
    Prepare,
    ZoomStatus,
    BasicInteraction,
    FixedMode,
    ClearStatus,
    HoverMenu,
    useContext,
    PropertiesPanel
} from '../src/index';
import {schema} from './const';
import {computeStyle} from './utils/lz';
import data from './data/graph.json';

const CustomGraphFetch = () => {
    const {store, updateStore} = useContext();
    useEffect(() => {
        updateStore(draft => {
            draft.data = data;
            draft.schema = schema;
            draft.source = data;

            const styles = computeStyle(data, schema, 'my-graph');

            draft.nodeStyle = styles.nodeStyle;
            draft.edgeStyle = styles.edgeStyle;
        });
    }, []);
    return null;
};
export default () => {
    return (
        <div style={{height: '700px'}}>
            <GraphProvider id={"my-graph"}>
                <CustomGraphFetch/>
                <Canvas/>
                <BasicInteraction/>
                <FixedMode/>
                <ZoomStatus/>
                <PropertiesPanel />
                <HoverMenu>
                    测试
                </HoverMenu>
                <ClearStatus />
            </GraphProvider>
        </div>
    );
};
```
