import { useStore } from '../../useContext';
export const usePathStyle = (id: string) => {
  const { currentId, theme } = useStore();
  const isSelected = id === currentId;
  return {
    isSelected,
    markerEnd: isSelected ? 'url(#arrow-selected)' : 'url(#arrow)',
    style: { stroke: isSelected ? theme.primaryColor : '#000', strokeWidth: isSelected ? '2px' : '1px' },
  };
};
