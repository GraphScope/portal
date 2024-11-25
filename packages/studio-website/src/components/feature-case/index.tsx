import * as React from 'react';
import { getSupportFeature, type SupportFeature } from '../../layouts/services';
interface IGrootCaseProps {
  children: React.ReactNode;
  match: SupportFeature;
}

const FeatureCase: React.FunctionComponent<IGrootCaseProps> = props => {
  const { children, match } = props;
  const feature = getSupportFeature();
  const support = feature[match];
  return (
    <div
      style={{
        display: support ? 'display' : 'none',
      }}
    >
      {children}
    </div>
  );
};

export default FeatureCase;
