import React, { useState } from 'react';

const Authors: React.FC<{ str: string }> = ({ str }) => {
  const [state, updateState] = useState({
    isAllAuthors: false,
  });

  const toggleAllAuthors = () => {
    updateState(prevState => ({
      ...prevState,
      isAllAuthors: true,
    }));
  };

  const authorsList = str.split(',');

  // 直接返回str，当作者数量小于等于3或者状态为显示所有作者
  if (authorsList.length <= 3 || state.isAllAuthors) {
    return <>{str}</>;
  }

  // 当作者数量大于3且不是显示所有作者时
  return (
    <>
      {authorsList[0]}
      <span style={{ margin: '0px 6px', padding: '6px 12px', backgroundColor: '#efefef' }} onClick={toggleAllAuthors}>
        + authors
      </span>
      {authorsList[authorsList.length - 1]}
    </>
  );
};
export default Authors;
