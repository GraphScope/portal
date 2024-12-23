export const setNodeStyle = defaultNodeStyle => {
  const _style = {};
  Object.keys(defaultNodeStyle).forEach(key => {
    _style[key] = {
      ...defaultNodeStyle[key],
      caption: ['label', 'counts'],
      size: 3,
      options: {
        textSize: 3,
        zoomLevel: [0.1, 20],
      },
    };
  });
  return _style;
};

export const setEdgeStyle = defaultEdgeStyle => {
  const _style = {};
  Object.keys(defaultEdgeStyle).forEach(key => {
    _style[key] = {
      ...defaultEdgeStyle[key],
      size: 1,
      color: '#000',
      caption: ['label', 'counts'],
      options: {
        textSize: 1.8,
        textColor: '#fff',
        textBackgroundColor: '#000',
        zoomLevel: [0.1, 20],
      },
    };
  });
  return _style;
};
