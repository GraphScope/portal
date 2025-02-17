import * as React from 'react';
import { Flex, theme, Select, Typography, Tag } from 'antd';
import { ForceGraphInstance, useContext, useApis } from '../../index';
import PropertiesTable from './PropertiesTable';
import PropertyInfo from './PropertyInfo';
import { getSelectData } from './utils';
import { handleNodeStyle, handleEdgeStyle } from '../../graph/utils/handleStyle';

export interface IPropertiesPanelProps {
  style?: React.CSSProperties;
}

const PropertiesPanel: React.FunctionComponent<IPropertiesPanelProps> = props => {
  const { style = {} } = props;
  const { store } = useContext();
  const { focusNodes } = useApis();
  const { selectNodes, selectEdges, nodeStyle, edgeStyle } = store;
  const { token } = theme.useToken();
  const containerRef = React.useRef<HTMLElement>(null);

  const data = [...selectNodes, ...selectEdges];
  const selectIds = data.map(item => item.id);
  const [currentId, setCurrentId] = React.useState<string>(selectIds[0] || '');

  const rootStyle: React.CSSProperties = {
    display: 'flex',
    position: 'absolute',
    top: '12px',
    bottom: '12px',
    right: '12px',
    width: '240px',
    boxShadow: token.boxShadow,
    zIndex: 1999,
    background: token.colorBgContainer,
    borderRadius: token.borderRadius,
    overflowY: 'scroll',
    padding: token.padding,
    ...style,
  };

  if (data.length === 0) {
    return null;
  }

  const currentData = data.find(item => item.id === currentId) || data[0];

  if (!currentData) {
    return null;
  }
  const options = data.map(item => {
    const { id: key, properties = {} } = item;
    //@ts-ignore
    const match = handleNodeStyle(item, nodeStyle) || handleEdgeStyle(item, edgeStyle);
    const { caption } = match;
    const title =
      caption
        .map(c => {
          return properties[c];
        })
        .join(',') || key;
    return {
      value: key,
      label: (
        <>
          <Tag>{caption.join(',') || 'id'}</Tag> {title}
        </>
      ),
    };
  });
  const onChange = value => {
    setCurrentId(value);
    focusNodes([value]);
  };

  return (
    <Flex style={rootStyle} vertical gap={12}>
      {data.length > 1 && (
        <>
          <Typography.Text type="secondary" italic>
            Total {data.length} items selected
          </Typography.Text>

          <Select
            // variant="borderless"
            allowClear
            getPopupContainer={node => {
              if (containerRef.current) {
                return containerRef.current;
              }
              return node;
            }}
            defaultValue={currentId}
            placeholder="please select and inspect data"
            options={options}
            value={currentId}
            onChange={onChange}
          />
        </>
      )}
      <PropertyInfo data={currentData} />
    </Flex>
  );
};

export default PropertiesPanel;
