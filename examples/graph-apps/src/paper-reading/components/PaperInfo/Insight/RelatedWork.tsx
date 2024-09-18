import * as React from 'react';
import { Select, Flex, Typography, Button, Timeline, Space, Skeleton, notification } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { PlayCircleOutlined } from '@ant-design/icons';
import { queryCypher, queryLLM, queryLLMResult } from '../../../service';
import { Utils } from '@graphscope/studio-components';
import { deleteLeafNodes } from './utils';
interface IFindPathProps {}

const FindPath = () => {
  return (
    <Flex vertical gap={12}>
      <Typography.Text>Find papers that cite the selected paper</Typography.Text>
      <Button icon={<PlayCircleOutlined />}></Button>
    </Flex>
  );
};
const delay = async time => {
  return new Promise(resolve => setTimeout(resolve, time));
};

const RelatedWork: React.FunctionComponent<IFindPathProps> = props => {
  const { store, updateStore } = useContext();
  const { nodeStatus, data, schema } = store;
  const citePapers = React.useRef<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const prompts = React.useRef<any>({});
  const [state, setState] = React.useState({
    result: {},
    isLoading: false,
    summarize: '',
  });
  const allGraph = React.useRef<any>({});

  const selectNodes = data.nodes.filter(item => {
    const match = nodeStatus[item.id];
    if (match && match.selected) {
      return match;
    }
  });

  const queryGraph = async () => {
    const selectIds = selectNodes.map(item => item.id);
    updateStore(draft => {
      draft.isLoading = true;
    });
    //Find papers that cite the selected paper
    const _citePapers = await queryCypher({
      script: `
      MATCH (a:Paper)-[b]->(c:Paper)
      WHERE  elementId(a) IN [${selectIds}] 
      RETURN a,b,c
      `,
    });
    // if (_citePapers.nodes) {
    //   notification.info({
    //     message: 'No related papers found',
    //   });
    //   return;
    // }
    const citePapers = Utils.handleExpand(data, _citePapers);
    const selectAllIds = citePapers.nodes.map((item: any) => item.id);

    //Query the dimensions associated with Papers: Challenges
    const challenges = await queryCypher({
      script: `
      MATCH (a:Paper)-[b]->(c:Challenge)
      WHERE  elementId(a) IN [${selectAllIds}] 
      RETURN a,b,c
      `,
    });
    const _res = Utils.handleExpand(citePapers, challenges);
    // delete leaf nodes
    const _data = deleteLeafNodes(_res);
    updateStore(draft => {
      draft.isLoading = false;
      draft.data = _data;
      draft.source = _data;
    });

    await handleLLMResult(_data);
  };

  const handleLLM = async () => {
    setState(preState => {
      return {
        ...preState,
        prompts: res.data,
        isLoading: true,
      };
    });
    console.log('data', data);
    const res = await queryLLM({
      data: data,
      groupby: 'Challenge',
      max_token_per_subsection: 300,
    });
    setState(preState => {
      return {
        ...preState,
        prompts: res.data.data,
        isLoading: true,
      };
    });
  };
  const handleLLMResult = async _data => {
    setState(preState => {
      return {
        ...preState,
        isLoading: true,
      };
    });

    const res = await queryLLMResult({
      data: _data,
      groupby: 'Challenge',
      max_token_per_subsection: 300,
    });
    setState(preState => {
      return {
        ...preState,
        summarize: res.data.data,
        isLoading: false,
      };
    });
  };

  console.log('prompts.current', data);
  const papers = data.nodes.filter(item => item.label === 'Paper');
  const challenges = data.nodes.filter(item => item.label === 'Challenge');
  const showPath = papers.length > 1;
  return (
    <div>
      <Flex vertical gap={24}>
        <Button type="primary" onClick={queryGraph}>
          Write Now
        </Button>
        {showPath && (
          <Timeline
            items={[
              {
                children: (
                  <Flex vertical gap={12}>
                    <Typography.Text>
                      Find {papers.length - 1} papers that cite the selected paper and Query {challenges.length} common
                      Challenges
                    </Typography.Text>
                  </Flex>
                ),
              },
              {
                children: (
                  <Flex vertical gap={12}>
                    {state.isLoading && (
                      <>
                        <Typography.Text type="secondary">Submit to the LLM for summarization.</Typography.Text>
                        <Skeleton active />
                      </>
                    )}
                    <Typography.Paragraph>
                      <div dangerouslySetInnerHTML={{ __html: state.summarize }}></div>
                    </Typography.Paragraph>
                  </Flex>
                ),
              },
            ]}
          />
        )}
      </Flex>
    </div>
  );
};

export default RelatedWork;
