import React from 'react';
import { Avatar, List, Flex, Typography, Button, Tree, Timeline, Tag, Space } from 'antd';
import { SummaryType } from './Intention';
import { DownOutlined } from '@ant-design/icons';
import { useApis } from '@graphscope/studio-graph';
import { useDynamicStyle } from '@graphscope/studio-components';
import WriteReport from './Write';

const Summary: React.FunctionComponent<SummaryType & { task: string }> = props => {
  const { category, summary, explain, task } = props;
  console.log('Summary', props);
  const { focusNodes } = useApis();
  useDynamicStyle(
    `
    .explore-report-summary-timeline .ant-timeline-item{
      padding-bottom:6px !important;
    }
    
    `,
    'explore-report-summary-timeline',
  );
  return (
    <Flex vertical gap={12}>
      <Timeline
        items={category.map(item => {
          const { name, description, children } = item;
          return {
            color: 'green',
            children: (
              <Flex vertical gap={12}>
                <Typography.Text>{name}</Typography.Text>
                <Typography.Text italic type="secondary">
                  {description}
                </Typography.Text>
                <Timeline
                  className="explore-report-summary-timeline"
                  style={{ padding: '0px' }}
                  items={children.map(c => {
                    //@ts-ignore
                    const { id, properties = {}, label } = c || {};
                    const { name, title } = properties;
                    return {
                      color: 'green',
                      children: (
                        <Typography.Text
                          style={{ cursor: 'pointer' }}
                          key={id}
                          onClick={() => {
                            focusNodes([id]);
                          }}
                        >
                          {name || title || label || id}
                        </Typography.Text>
                      ),
                    };
                  })}
                />
              </Flex>
            ),
          };
        })}
      />

      <WriteReport category={category} task={task} />
    </Flex>
  );
};

export default Summary;
