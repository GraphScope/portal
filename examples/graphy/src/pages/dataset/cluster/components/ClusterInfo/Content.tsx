import React, { useEffect, useState } from 'react';

import { Typography, Card, Divider, Skeleton } from 'antd';
import { TypingText, Utils } from '@graphscope/studio-components';
import { runSummarize } from '../../../service';
interface IContentProps {
  id: string | null;
  combo: any;
}

const Content: React.FunctionComponent<IContentProps> = props => {
  const { id, combo } = props;
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
    const datasetId = Utils.getSearchParams('datasetId');
    runSummarize(datasetId, {
      entityId: entityId,
      cluster_ids: [id],
    }).then(res => {
      console.log('res', res);
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
    return (
      <>
        <Card hoverable style={{ width: '300px', height: '100%', overflow: 'scroll' }}>
          <Typography.Text type="secondary">Summarizing ...</Typography.Text> <br />
          <br />
          <br />
          <br />
          <Skeleton active />
          <br />
          <br />
          <br />
          <Skeleton active />
        </Card>
      </>
    );
  }
  console.log(lists, id);

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
