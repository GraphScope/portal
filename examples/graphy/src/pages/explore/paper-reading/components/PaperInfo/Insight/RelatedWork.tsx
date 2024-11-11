import * as React from 'react';
import { Select, Flex, Typography, Button, Timeline, Space, Skeleton, notification } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { PlayCircleOutlined } from '@ant-design/icons';

import { Utils } from '@graphscope/studio-components';
import { deleteLeafNodes } from './utils';

import { SERVICES } from '../../registerServices';

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

const RelatedWork = props => {
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

  const modifyPrompt = async () => {
    // new prompt
    const new_prompt = ['1', ['2']];
    updateStore(draft => {
      draft.isLoading = true;
    });

    await modify(new_prompt);
  };

  const modify = async _prompt => {
    const datasetId = Utils.getSearchParams('graph_id');

    const res = await SERVICES.setPrompt({
      prompt: _prompt,
      dataset_id: datasetId,
      identity: datasetId,
    });

    console.log('change prompt: ');
    console.log(res);
  };

  const formulatePrompt = async () => {
    const selectIds = selectNodes.map(item => item.id);
    updateStore(draft => {
      draft.isLoading = true;
    });
    //Find papers that cite the selected paper
    const _citePapers = await SERVICES.queryCypher({
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
    const challenges = await SERVICES.queryCypher({
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

    await preparePrompt(_data);
  };

  const preparePrompt = async _data => {
    setState(preState => {
      return {
        ...preState,
        prompts: res.data,
        isLoading: true,
      };
    });

    const datasetId = Utils.getSearchParams('graph_id');

    const res = await SERVICES.queryLLM({
      data: _data,
      dataset_id: datasetId,
      use_prompt_cache: false,
      groupby: 'Challenge',
      identity: datasetId,
      max_token_per_subsection: 300,
    });

    console.log('formulated prompt: ');
    console.log(res);

    setState(preState => {
      return {
        ...preState,
        prompts: res.data.data,
        isLoading: true,
      };
    });
  };

  const queryGraph = async () => {
    const datasetId = Utils.getSearchParams('graph_id');
    const selectIds = selectNodes.map(item => item.id);
    updateStore(draft => {
      draft.isLoading = true;
    });
    //Find papers that cite the selected paper
    const _citePapers = await SERVICES.queryCypher({
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
    const challenges = await SERVICES.queryCypher({
      script: `
      MATCH (a:Paper)-[b]->(c:Challenge)
      WHERE  elementId(a) IN [${selectAllIds}]
      RETURN a,b,c
      `,
    });

    const { data: clustered_chanllenges } = await SERVICES.runClustering({
      data: challenges,
      dataset_id: datasetId,
      groupby: 'Challenge',
    });

    const graph_data = Utils.handleExpand(citePapers, clustered_chanllenges);

    // delete leaf nodes
    const _data = graph_data; // deleteLeafNodes(_res);

    updateStore(draft => {
      draft.isLoading = false;
      draft.data = _data;
      draft.source = _data;
    });

    // todo summary
    const {data:_summarize_data} = await SERVICES.runSummarizing({
      data: _data,
      groupby: 'Challenge',
      clustering_info: ['name', 'description'],
    });

    await handleLLMResult(_summarize_data);
  };

  const handleLLMResult = async _data => {
    setState(preState => {
      return {
        ...preState,
        isLoading: true,
      };
    });

    const datasetId = Utils.getSearchParams('graph_id');

    const res = await SERVICES.queryLLMResult({
      data: _data,
      groupby: 'Challenge',
      dataset_id: datasetId,
      use_prompt_cache: false,
      use_result_cache: false,
      identity: datasetId,
      max_token_per_subsection: 50,
    });
    console.log('Genrated Related Work:');
    console.log(res);
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
        <Button type="primary" onClick={formulatePrompt}>
          Fetch Prompt
        </Button>
        <Button type="primary" onClick={modifyPrompt}>
          Modify Prompt
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
