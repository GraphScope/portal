import { useNavigate } from 'react-router-dom';
const useHistory = () => {
  const navigate = useNavigate();
  const history = {
    push: navigate,
  };
  return history;
};

export default useHistory;
