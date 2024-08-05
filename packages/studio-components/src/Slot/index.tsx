import React from 'react';
export interface ISlotProps {
  id?: string;
}

const Placeholder = () => {
  return <div style={{ height: '100%', border: '1px dashed #000', borderRadius: '8px', background: '#fff' }}></div>;
};
const Slot = (props: ISlotProps) => {
  const { id } = props;
  if (id && process.env.NODE_ENV === 'production') {
    try {
      //@ts-ignore
      const Component = window.GS_STUDIO_SLOTS[id];
      return <Component />;
    } catch (error) {
      return <Placeholder />;
    }
  }
  return <Placeholder />;
};

export default Slot;
