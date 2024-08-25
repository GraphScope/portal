import * as React from 'react';
import { Divider, Typography, Tabs, Space } from 'antd';
import { FormattedMessage } from 'react-intl';
import type { TabsProps } from 'antd';
import { Utils, useThemeContainer } from '../index';
interface IFormattedMessage {
  id: string;
  values?: { [key: string]: string };
}
interface ISectionProps {
  title?: string;
  desc?: string | IFormattedMessage;
  breadcrumb?: { title: string | IFormattedMessage }[];
  children?: React.ReactNode;
  items?: TabsProps['items'];
  style?: React.CSSProperties;
}
const { useEffect } = React;
const Section: React.FunctionComponent<ISectionProps> = props => {
  const { title, desc, breadcrumb, children, items, style } = props;
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
  /** 判断 items is string or object */
  const handleFormattedMessage = (items: string | IFormattedMessage): IFormattedMessage => {
    return typeof items === 'string' ? { id: items } : items;
  };
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
              const { id, values } = handleFormattedMessage(item.title);
              //@ts-ignore
              return <FormattedMessage id={id} values={values} />;
            })}
          </Space>
        </Typography.Title>

        {desc && (
          <Typography.Title type="secondary" level={4} style={{ fontWeight: 300 }}>
            <FormattedMessage id={handleFormattedMessage(desc).id} values={handleFormattedMessage(desc).values} />
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
