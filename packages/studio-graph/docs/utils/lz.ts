import { getStyleConfig } from "../../es";
import { uniqBy } from 'lodash';

export function computeStyle(data, schema, id) {
    const { nodeStyle, edgeStyle } = getStyleConfig(schema, id);
    const uniqEdges = uniqBy(data.edges, item => item.properties.uniqStr);

    data.nodes.forEach(node => {
        let size = computeNodeSize(uniqEdges, node.id);
        nodeStyle[node.id] = {
            size,
            caption: ['name'],
            options: {
                textPosition: 'center',
                zoomLevel: [2, 200],
            }
        }
    })

    data.edges.forEach(edge => {
        edgeStyle[edge.id] = {
            size: edge.properties.size,
            caption: ['name'],
            options: {
                arrowLength: 0,
                textSize: computeEdgeSize(edge.properties.size),
                zoomLevel: [2, 200],
            }
        }
    })

    return {
        nodeStyle, edgeStyle
    }
}

export function computeNodeSize(uniqEdges, id) {
    const size = uniqEdges.filter(item => item.properties.uniqStr?.includes(id)).length;
    if (size < 5) {
        return 3;
    } else if (size < 11) {
        return 6;
    } else if (size < 21) {
        return 18;
    } else {
        return 30;
    }
}

export function computeEdgeSize(length: number) {
    if (length < 2) {
        return 1.5;
    } else if (length <= 5) {
        return 2;
    } else {
        return 2.3;
    }
}
