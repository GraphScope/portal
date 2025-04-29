import { Utils } from '@graphscope/studio-components';
import { toSvg } from 'html-to-image';

export const useExportSvg = () => {
  const exportSvg = async ({ name = 'model.svg', parentId = '' }: { name?: string; parentId?: string } = {}) => {
    let viewBox: HTMLDivElement | null = null;
    if(parentId){
      viewBox = document.querySelector('#'+parentId+' .react-flow__viewport') as HTMLDivElement;
    }else{
      viewBox = document.querySelector('.react-flow__viewport') as HTMLDivElement;
    }
    if (viewBox) {
      const dataUrl = await toSvg(viewBox, {});
      Utils.downloadImage(dataUrl, name);
    }
  };

  return { exportSvg };
};
