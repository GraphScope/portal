import { useNavigate } from 'react-router-dom';
export const useHistory = () => {
  const navigate = useNavigate();
  const history = {
    push: navigate,
  };
  return history;
};
