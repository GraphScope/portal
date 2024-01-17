import type { UploadProps } from 'antd';
  /** 导入数据 */
  export const prop: UploadProps = {
    beforeUpload(file: Blob) {
      let reader = new FileReader();
      reader.readAsText(file, 'utf-8');
      reader.onload = async () => {
        // let res = await importSchema({ name: props.importName, data: reader.result });
        // if (!res.success) return message.error(res?.message, 3);
        // message.success('import successfully !', 3);
      };
    },
    capture: undefined,
  };
  /** 导出数据*/ 
  export const download = (queryData: string, states: BlobPart) => {
    const eleLink = document.createElement('a');
    eleLink.download = queryData;
    eleLink.style.display = 'none';
    const blob = new Blob([states]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  };
  
  