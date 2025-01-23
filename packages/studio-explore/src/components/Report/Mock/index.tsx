//@ts-nocheck
import mindmap from './challenge/mindmap.json?raw';
import report from './challenge/report.md?raw';
import bib from './challenge/report.bib?raw';
import intention from './challenge/intention.json?raw';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const MOCK = {
  enable: false,
  sleep,
  report,
  bib,
  mindmap: JSON.parse(mindmap),
  intention: JSON.parse(intention),
};

export default MOCK;
