const MOCK = {
  enable: false,
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
  bib: async () => {
    const url = new URL('./challenge/report.bib', import.meta.url).href;
    return fetch(url).then(response => response.text());
  },
  report: async () => {
    const url = new URL('./challenge/report.md', import.meta.url).href;
    return fetch(url).then(response => response.text());
  },
  mindmap: async () => {
    const url = new URL('./challenge/mindmap.json', import.meta.url).href;
    return fetch(url).then(response => response.json());
  },
  intention: async () => {
    const url = new URL('./challenge/intention.json', import.meta.url).href;
    return fetch(url).then(response => response.json());
  },
};

export default MOCK;
