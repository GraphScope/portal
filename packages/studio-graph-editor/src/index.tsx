import * as React from 'react';
import { MultipleInstance, Utils } from '@graphscope/studio-components';
import Canvas from './canvas';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { IntlProvider } from 'react-intl';
import locales from './locales';
interface IGraphProps {
  locale?: 'zh-CN' | 'en-US';
  children?: React.ReactNode;
}

const Graph: React.FunctionComponent<IGraphProps> = props => {
  const { locale = 'en-US' } = props;
  const messages = locales[locale];
  return (
    <IntlProvider messages={messages} locale={locale}>
      {/* <MultipleInstance> */}
      <ReactFlowProvider>
        <Canvas>{props.children}</Canvas>
      </ReactFlowProvider>
      {/* </MultipleInstance> */}
    </IntlProvider>
  );
};

export default Graph;
