import React, { useState } from 'react';
import { Button, Flex } from 'antd';
import { useContext } from '@graphscope/studio-graph';
import { Utils } from '@graphscope/studio-components';

import ReactMarkdown from 'react-markdown';

const property_key_of_bib = 'bib';
const bib_key = '__bib__key';

const ReportText = (props: { report: string; enableBib?: boolean }) => {
  const { report, enableBib } = props;
  const { store } = useContext();
  const { data } = store;
  const processText = () => {
    if (enableBib) {
      const nodesMap = new Map();
      const bibs = {};

      data.nodes.forEach(node => {
        const { id, properties = {} } = node;
        const bib = properties[property_key_of_bib] || '{}';
        // 提取 bibKey
        const bibKeyRegex = /@article\{([^,]+),/;
        const bibKeyMatch = bib.match(bibKeyRegex);
        const bibKey = bibKeyMatch ? bibKeyMatch[1] : null;
        nodesMap.set(id, { ...properties, [bib_key]: bibKey });
      });
      // 替换 cite id 为 bibKey
      const regex = /\\cite\{(\d+)\}/g;
      const replacedText = report.replace(regex, (match, id) => {
        const bibKey = nodesMap.get(id)[bib_key];
        if (bibKey) {
          bibs[id] = nodesMap.get(id)[property_key_of_bib];
          return `\\cite{${bibKey}}`;
        } else {
          bibs[id] = `@article{${id}} is missing info ,Title={${nodesMap.get(id)['title']}},`;
          // 如果找到 bibKey，则替换；否则保留原内容
          return match;
        }
      });
      return {
        text: replacedText,
        bibs: Object.values(bibs).join('\n \n'),
      };
    }
    return { text: report };
  };
  const { text, bibs } = processText();
  const handleDownload = () => {
    processText();
    if (enableBib) {
      Utils.createDownload(text, 'report.md');
      Utils.createDownload(bibs || '', 'report.bib');
    } else {
      Utils.createDownload(report, 'report.md');
    }
  };

  return (
    <>
      <ReactMarkdown>{text}</ReactMarkdown>
      <Button onClick={handleDownload}>Download Report</Button>
    </>
  );
};

export default ReportText;
