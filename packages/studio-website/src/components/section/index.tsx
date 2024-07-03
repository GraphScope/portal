import * as React from 'react';
import { Breadcrumb, Divider, Typography, Tabs, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
import type { BreadcrumbProps, TabsProps } from 'antd';
import { Utils, useThemeContainer } from '@graphscope/studio-components';
interface ISectionProps {
  title?: string;
  desc?: string;
  breadcrumb?: BreadcrumbProps['items'];
  children?: React.ReactNode;
  items?: TabsProps['items'];
  style?: React.CSSProperties;
  customdes?: { [key: string]: string };
}
const { useEffect } = React;
const Section: React.FunctionComponent<ISectionProps> = props => {
  const { title, desc, breadcrumb, children, items, style, customdes } = props;
  const { sectionBackground } = useThemeContainer();
  useEffect(() => {
    if (items) {
      const nav = Utils.getSearchParams('nav') || '';
      if (nav === '') {
        Utils.setSearchParams({
          nav: items[0].key,
        });
      }
    }
  }, []);
  const onChange = (key: string) => {
    Utils.setSearchParams({
      nav: key,
    });
  };
  const hasDivider = desc && !items;
  console.log('breadcrumb', breadcrumb);
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: sectionBackground,
        borderRadius: '12px',
      }}
    >
      <div style={{ padding: '0px 24px' }}>
        <Typography.Title level={1} style={{ fontSize: 40 }}>
          <Space
            align="center"
            split={
              <Divider
                type="vertical"
                style={{ rotate: '25deg', fontSize: '25px', background: '#000', width: '3px' }}
              />
            }
          >
            {/* <FormattedMessage id={title} /> */}
            {breadcrumb?.map((item, index) => {
              //@ts-ignore
              return <FormattedMessage id={item.title} />;
            })}
          </Space>
        </Typography.Title>

        {desc && (
          <Typography.Title type="secondary" level={4} style={{ fontWeight: 300 }}>
            <FormattedMessage id={desc} values={customdes} />
          </Typography.Title>
        )}
      </div>
      {hasDivider && <Divider />}
      {items && (
        <div style={{ padding: '0px 24px' }}>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      )}
      <div
        style={{
          padding: '0px 24px 24px 24px',
          flex: 1,
          ...style,
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
