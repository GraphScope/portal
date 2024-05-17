import * as React from 'react';

interface IAddNodeProps {}

const AddNode: React.FunctionComponent<IAddNodeProps> = props => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.9275 18.1774H20.4275M18.1775 15.9274V20.4274M17.7605 13.3024C18.3124 11.7395 18.3167 10.0353 17.7726 8.46965C17.2285 6.90396 16.1684 5.56971 14.7662 4.68584C13.364 3.80197 11.7029 3.42097 10.0557 3.60538C8.40845 3.78979 6.87281 4.52864 5.70075 5.70069C4.5287 6.87275 3.78985 8.40839 3.60544 10.0556C3.42104 11.7029 3.80203 13.3639 4.6859 14.7661C5.56977 16.1683 6.90402 17.2284 8.46971 17.7725C10.0354 18.3166 11.7395 18.3124 13.3025 17.7604"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default AddNode;
