import * as React from 'react';
import ReactDOM from 'react-dom';
const CreateHeaderPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.getElementById('header-breadcrumb') as HTMLElement);
};

export default CreateHeaderPortal;
