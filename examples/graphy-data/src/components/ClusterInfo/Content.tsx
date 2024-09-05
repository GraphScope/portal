import React, { useEffect, useState } from 'react';
import { query } from '../FetchGraph/service';
import { Typography, Card, Divider } from 'antd';
import { TypingText, Utils } from '@graphscope/studio-components';
interface IContentProps {
  id: string | null;
}

const Content: React.FunctionComponent<IContentProps> = props => {
  const { id } = props;
  const [state, setState] = useState({
    lists: [],
    loading: false,
  });
  const { lists, loading } = state;
  useEffect(() => {
    if (!id) {
      return;
    }
    const entityId = Utils.getSearchParams('entityId') || '';
    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    query({
      name: entityId,
      type: 'cluster',
    }).then(res => {
      setState(preState => {
        return {
          ...preState,
          lists: res,
          loading: false,
        };
      });
    });
  }, [id]);
  if (state.loading) {
    return <>loading ... </>;
  }

  const current = lists.find(item => {
    //@ts-ignore
    return String(item.cluster_id) === id;
  });

  if (current) {
    const { summary, cluster_id } = current;
    const { description, name } = summary;
    return (
      <Card hoverable style={{ width: '300px', height: '100%', overflow: 'scroll' }}>
        <Typography.Text type="secondary">Cluster ID</Typography.Text> <br />
        <Typography.Text>{cluster_id}</Typography.Text>
        <Divider style={{ margin: '12px 0px' }} />
        <Typography.Text type="secondary">Summarize Cluster Name</Typography.Text> <br />
        <Typography.Text>{name}</Typography.Text>
        <Divider style={{ margin: '12px 0px' }} />
        <Typography.Text type="secondary">Summarize Cluster Description</Typography.Text> <br />
        <Typography.Paragraph>
          <TypingText>{description}</TypingText>
        </Typography.Paragraph>
      </Card>
    );
  }
  return null;
};

export default Content;
