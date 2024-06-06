import { Outlet } from 'umi';
import { ConfigProvider, theme } from 'antd';
import './index.less';
import Sidebar from './sidebar';
import Container from './container';

import Footer from './footer';
import { IntlProvider } from 'react-intl';
import locales from '../locales';
import { useContext } from './useContext';
import { TOOLS_MENU } from './const';
import SegmentedSection from './segmented-section';
import { history } from 'umi';

const Content = (props: any) => {
  const { children, navStyle } = props;
  const { store } = useContext();
  const { currentnNav } = store;
  const match = TOOLS_MENU.find(item => {
    return item.value === currentnNav;
  });
  if (match) {
    return (
      <SegmentedSection options={TOOLS_MENU} value={currentnNav} history={history} withNav={navStyle === 'inline'}>
        {children}
      </SegmentedSection>
    );
  }
  return <>{children}</>;
};
export default function Layout() {
  const { store } = useContext();
  const { locale, primaryColor, mode, inputNumber, navStyle } = store;
  //@ts-ignore
  const messages = locales[locale];
  const isLight = mode === 'defaultAlgorithm';

  return (
    <IntlProvider messages={messages} locale={locale}>
      <ConfigProvider
        theme={{
          // 1. 单独使用暗色算法
          algorithm: mode === 'defaultAlgorithm' ? theme.defaultAlgorithm : theme.darkAlgorithm,
          components: {
            Menu: {
              itemBg: 'rgba(255, 255, 255, 0)',
              subMenuItemBg: 'rgba(255, 255, 255, 0)',
              iconMarginInlineEnd: 14,
              itemMarginInline: 4,
              iconSize: 14,
              collapsedWidth: 60,
            },
            Typography: {
              titleMarginBottom: '0.2em',
              titleMarginTop: '0.8em',
            },
            Table: {
              // headerBg: mode === 'defaultAlgorithm' ? '#fff' : '#161616',
              // headerColor: mode === 'defaultAlgorithm' ? 'rgba(0, 0, 0, 0.45)' : '#DBDBDB',
              // headerSplitColor: mode === 'defaultAlgorithm' ? '#fff' : '#161616',
              cellPaddingBlock: 4, //	单元格纵向内间距
              cellPaddingInline: 8, //单元格横向内间距（默认大尺寸）
            },
            Pagination: {
              itemSize: 20,
            },
            // Tooltip: {
            //   colorTextLightSolid: '#000',
            //   colorBgSpotlight: '#fff',
            // },
          },
          token: {
            borderRadius: inputNumber,
            colorPrimary: primaryColor,
            colorBorder: mode === 'defaultAlgorithm' ? '#F0F0F0' : '#303030',
            // colorBgBase: mode === 'defaultAlgorithm' ? '#fff' : '#000',
            colorBgBase: isLight ? '#fff' : 'rgba(12,12,12,1)',
          },
        }}
      >
        <Container
          sidebar={<Sidebar />}
          content={
            <Content navStyle={navStyle}>
              <Outlet />
            </Content>
          }
          footer={<Footer />}
        />
      </ConfigProvider>
    </IntlProvider>
  );
}
