import { useContext } from '../../canvas/useContext';
import { useThemeContainer } from '@graphscope/studio-components';
export const usePathStyle = (id: string) => {
  const { store } = useContext();
  const { currentId, theme } = store;
  const isSelected = id === currentId;
  const { algorithm } = useThemeContainer();
  const isDark = algorithm === 'darkAlgorithm';
  const getStyle = () => {
    if (isDark) {
      return isSelected ? theme.primaryColor : '#d7d7d7';
    }
    return isSelected ? theme.primaryColor : '#000';
  };
  return {
    isSelected,
    markerEnd: isSelected ? 'url(#arrow-selected)' : 'url(#arrow)',
    style: { stroke: getStyle(), strokeWidth: isSelected ? '2px' : '1px' },
  };
};
