import { Utils } from '@graphscope/studio-components';
import { toSvg } from 'html-to-image';

export const useExportSvg = (name = 'model.svg') => {
  const exportSvg = async () => {
    const viewBox = document.querySelector('.react-flow__viewport') as HTMLDivElement;
    if (viewBox) {
      const dataUrl = await toSvg(viewBox, {});
      Utils.downloadImage(dataUrl, name);
    }
  };

  return { exportSvg };
};

