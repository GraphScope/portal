import * as React from 'react';
import jsPDF from 'jspdf';
import { Button } from 'antd';
import { useContext } from '@graphscope/studio-graph';
interface IGeneratePdfProps {
  title: string;
  description: string;
}

const GeneratePdf: React.FunctionComponent<IGeneratePdfProps> = props => {
  const { title, description } = props;
  const { id } = useContext();

  const handleClick = () => {
    const container = document.getElementById(`GRAPH_${id}`) as HTMLDivElement;
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    const imgData = canvas.toDataURL('image/png');
    // Step 2: 创建PDF并添加内容
    const doc = new jsPDF({
      orientation: 'portrait', //'landscape',
      unit: 'px',
      format: 'a4',
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const padding = 30;

    const imgHeight = 200; // 留出一些顶部和底部边距
    const imgWidth = imgHeight * (canvas.width / canvas.height); // 根据原图比例缩放
    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    // 添加文本到下方
    const textY = 30;
    doc.setFontSize(20);
    doc.setFont('courier', 'bolditalic');
    doc.text(title, padding, textY);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(`Powered by graphscope ${timestamp}`, padding, textY + 20);
    doc.addImage(imgData, 'PNG', padding, textY, imgWidth, imgHeight);
    doc.setFontSize(11);
    doc.setFont('courier', 'normal');
    doc.setTextColor(0, 0, 0);
    // 添加更多文本内容
    doc.text(description, padding, textY + imgHeight, { maxWidth: pageWidth - padding * 2 });

    // Step 3: 保存PDF文件
    doc.save('analysis-report.pdf');
  };
  return (
    <div>
      <Button type="primary" onClick={handleClick} style={{ width: '100%' }}>
        Generate PDF
      </Button>
    </div>
  );
};

export default GeneratePdf;
