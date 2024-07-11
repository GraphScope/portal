import { Button, Tooltip } from 'antd';
import * as React from 'react';

import { FileImageOutlined } from '@ant-design/icons';
import { Utils } from '@graphscope/studio-components';

import { toSvg } from 'html-to-image';
interface ILeftButtonProps {}

const ExportImage: React.FunctionComponent<ILeftButtonProps> = props => {
  const onClick = async () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const viewBox = document.querySelector('.react-flow__viewport') as HTMLDivElement;
    if (viewBox) {
      const dataUrl = await toSvg(viewBox, {});
      Utils.downloadImage(dataUrl, 'model.svg');
    }
  };

  return (
    <Tooltip title="Save graph model to svg image" placement="right">
      <Button type="text" icon={<FileImageOutlined />} onClick={onClick} />
    </Tooltip>
  );
};

export default ExportImage;
