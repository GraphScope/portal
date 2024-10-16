import ReactDOM from 'react-dom';

interface IAppProps {
  children: React.ReactNode;
  /** 需要传送的 DOM ID */
  targetId: string;
}

const CreatePortal: React.FunctionComponent<IAppProps> = ({ children, targetId }) => {
  return ReactDOM.createPortal(children, document.getElementById(targetId) as HTMLElement);
};

export default CreatePortal;
