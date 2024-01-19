const sideWidth = 260;
const styles: Record<string, React.CSSProperties> = {
  logo: {
    height: '80px',
    lineHeight: '80px',
    borderBottom: '1px solid #ddd',
    padding: '0px 24px',
  },
  content: {
    position: 'absolute',
    padding: '12px',
    top: '24px',
    left: sideWidth + 'px',
    right: '0px',
    bottom: '0px',
  },
  sidebar: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    bottom: '0px',
    width: '240px',
    borderRight: '1px solid #ddd',
  },
  menu: {
    borderInlineEnd: 'none',
    background: '#fafafa',
  },
};

export default styles;
