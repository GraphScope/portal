import React from 'react';
import { Breadcrumb } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { FormattedMessage } from 'react-intl';
type IDetail = {
  detailData: string;
};
const Detail: React.FunctionComponent<IDetail> = props => {
  const { detailData } = props;
  return (
    <div style={{ padding: '12px 24px' }}>
      <Breadcrumb
        items={[
          {
            title: <a href="/job">作业管理</a>,
          },
          {
            title: <FormattedMessage id="Detail" />,
          },
        ]}
      />
      <CodeMirror
        style={{ margin: '12px 0px', height: 'calc(100% - 30px)', overflow: 'scroll' }}
        value={detailData}
        readOnly={true}
      />
    </div>
  );
};

export default Detail;
