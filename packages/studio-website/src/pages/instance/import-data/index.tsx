import * as React from 'react';
import { Space, Segmented, Collapse } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import AddDisposition from './add-disposition';
import { SegmentedValue } from 'antd/es/segmented';
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/a/font_4377140_slis0xqmzfo.js',
});
interface IImportDataProps {}
const { Panel } = Collapse;
const ImportData: React.FunctionComponent<IImportDataProps> = props => {
  const nodeEdgeChange:(value: SegmentedValue) => void= (val) => {};
  const genExtra: () => React.ReactNode = () => {
    return <div><IconFont type="icon-baocun" /><IconFont type="icon-bangding" /><IconFont type="icon-ziyuan" /><IconFont type="icon-jiechubangding" /></div>;
  };
  return (
    <div style={{ paddingRight: '24px' }}>
      <div>
        <Space>
          <span>数据源类型</span>
          <Segmented options={['ODPS', '本地文件','OSS']} defaultValue="ODPS" style={{ marginBottom: '16px' }} onChange={nodeEdgeChange}/> 
        </Space>
      </div>
      <div>
        <Space>
          <span>绑定数据源</span>
          <Segmented options={['Node Label', 'Edge labels']} defaultValue="Node Label" style={{ marginBottom: '16px' }} onChange={nodeEdgeChange}/> 
        </Space>
        <Collapse>
          <Panel key={''} header={undefined} extra={genExtra()}>
            <AddDisposition />
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default ImportData;
