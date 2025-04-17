import * as React from 'react';

// 导入所有插画组件
import Job from './Job';
import Explore from './Explore';
import DesignSchema from './DesignSchema';
import Process from './Process';
import Success from './Success';
import Next from './Next';
import Loading from './Loading';
import Upload from './Upload';
import FunArrow from './FunArrow';
import Welcome from './Welcome';
import Programming from './Programming';
import Experiment from './Experiment';
import Settings from './Settings';
import Charts from './Charts';

/**
 * 插画组件的通用属性接口
 */
export interface IIllustrationProps {
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
}

// 导出所有插画组件
const Illustration = {
  Job,
  Explore,
  DesignSchema,
  Process,
  Success,
  Next,
  Loading,
  Upload,
  FunArrow,
  Welcome,
  Programming,
  Experiment,
  Settings,
  Charts,
};

export default Illustration;
