import * as React from 'react';
import { Tooltip, Button, Collapse, CollapseProps, Input, Flex, Typography, Skeleton } from 'antd';

import { useContext } from '@graphscope/studio-graph';
import { TypingText } from '@graphscope/studio-components';
import GeneratePdf from './GeneratePdf';
interface IReportProps {}
const defaultPrompt =
  'Please provide a clear and concise analysis of how the solutions evolve and build upon each other to address the challenge across these three papers. The details of the three papers, the challenge, and the corresponding solutions are provided below, enclosed within XML tags <DATA></DATA>';

const fetchReport = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          description:
            "The evolution of solutions across the three papers ('Parallel Subgraph Listing in a Large-Scale Graph', 'Scalable distributed subgraph enumeration', and 'HUGE: An Efficient and Scalable Subgraph Enumeration System') demonstrates a progressive refinement and enhancement of strategies to address the common challenge of optimizing load balance in distributed systems.\n\nStarting with 'Paper1', the solution introduces a dynamic load balancing method based on work-stealing. This foundational approach equips each node with a task queue and facilitates the redistribution of tasks from heavily loaded nodes to those with lighter loads, thereby enhancing overall system efficiency through better task allocation.\n\n'Paper2' builds upon this concept by introducing more sophisticated mechanisms tailored to distributed graph processing. The SCP storage mechanism improves data organization, enabling smarter choices between star and clique structures for join operations, which reduces computation rounds and intermediates. Additionally, the clique compression technique and dynamic programming algorithm further refine load distribution by handling data skewness and optimizing join plans, respectively. These enhancements reflect a deeper optimization of workload distribution compared to the initial work-stealing strategy.\n\nFinally, 'Paper3' ('HUGE') takes the optimization a step further with the proposal of an adaptive scheduling technique and an advanced work stealing mechanism. The adaptive scheduling with fixed-capacity output queues ensures efficient data processing without overwhelming memory resources. Meanwhile, the work stealing mechanism with an intra-machine deque adds another layer of sophistication to load balancing by dynamically managing partial results within workers and intelligently broadcasting the status of completed tasks to prevent unnecessary stealing from finished machines. This advancement signifies a move towards more nuanced and adaptive strategies for load management in complex distributed environments.\n\nIn summary, the progression from 'Paper1' to 'Paper3' illustrates a trajectory of innovation in addressing load balance challenges, evolving from a basic work-stealing scheme to incorporating advanced data storage optimizations, and finally, implementing refined scheduling and workload management techniques tailored for high-performance distributed systems.",
        },
      });
    }, 2000);
  });
};
const Prompt = () => {
  const [state, setState] = React.useState({
    loading: false,
    description: '',
  });
  const handleClick = async () => {
    setState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    //@ts-ignore
    const { data } = await fetchReport();
    setState(preState => {
      return {
        ...preState,
        loading: false,
        description: data.description,
      };
    });
  };
  const { loading, description } = state;
  return (
    <Flex gap={8} vertical>
      <Input.TextArea defaultValue={defaultPrompt} rows={10}></Input.TextArea>
      <Button type="primary" style={{ width: '100%' }} onClick={handleClick}>
        LLM Run
      </Button>
      {loading ? <Skeleton /> : <TypingText>{description}</TypingText>}
      <GeneratePdf title="Graph Analysis Report" description={description} />
    </Flex>
  );
};
const Report: React.FunctionComponent<IReportProps> = props => {
  const handleClick = () => {};
  const { store } = useContext();
  const { data } = store;
  const items: CollapseProps['items'] = [
    {
      key: '<DATA>',
      label: '<DATA>',
      children: <Input.TextArea defaultValue={JSON.stringify(data, null, 2)} rows={10}></Input.TextArea>,
    },

    {
      key: 'Prompt',
      label: 'Prompt',
      children: <Prompt />,
    },
  ];

  return (
    <div style={{ overflowY: 'scroll', height: '100%' }}>
      <Collapse items={items} defaultActiveKey={['1']} />
    </div>
  );
};

export default Report;
